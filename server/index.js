const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const gameManager = require('./gameManager');
const quizManager = require('./quizManager');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  // pingInterval: how often the server pings each client.
  // pingTimeout: how long to wait for a pong before declaring disconnect.
  // Increased from 5s/10s to 8s/20s — cellular networks can spike to 3-5s
  // latency, so a 10s timeout was causing false disconnects mid-game.
  pingInterval: 8000,
  pingTimeout: 20000,
  upgradeTimeout: 15000,
});

app.use(cors({ origin: '*' }));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/quiz/categories', (req, res) => {
  res.json(quizManager.QUIZ_CATEGORIES);
});

// ─── Quiz helpers ──────────────────────────────────────────────────────────
const quizTimers = new Map();

function clearQuizTimer(roomCode) {
  if (quizTimers.has(roomCode)) {
    const { tickInterval, expireTimeout } = quizTimers.get(roomCode);
    if (tickInterval) clearInterval(tickInterval);
    if (expireTimeout) clearTimeout(expireTimeout);
    quizTimers.delete(roomCode);
  }
}

function startQuizQuestionTimer(roomCode) {
  clearQuizTimer(roomCode);
  const room = quizManager.getQuizRoom(roomCode);
  if (!room || room.phase !== 'question') return;

  let timeLeft = room.questionTimeLimit;
  const tickInterval = setInterval(() => {
    timeLeft -= 1;
    io.to('quiz_' + roomCode).emit('quiz_timer_tick', { timeLeft });
  }, 1000);

  const expireTimeout = setTimeout(() => {
    clearInterval(tickInterval);
    quizTimers.delete(roomCode);
    resolveAndAdvanceQuiz(roomCode);
  }, room.questionTimeLimit * 1000);

  quizTimers.set(roomCode, { tickInterval, expireTimeout });
}

function resolveAndAdvanceQuiz(roomCode) {
  const resolveResult = quizManager.resolveQuestion(roomCode);
  if (resolveResult.error) return;

  io.to('quiz_' + roomCode).emit('quiz_question_result', resolveResult.result);

  // After 3s reveal, advance to next question
  setTimeout(() => {
    const nextResult = quizManager.nextQuestion(roomCode);
    if (nextResult.error) return;

    if (nextResult.ended) {
      io.to('quiz_' + roomCode).emit('quiz_ended', { leaderboard: nextResult.finalLeaderboard });
    } else {
      io.to('quiz_' + roomCode).emit('quiz_next_question', { question: nextResult.question, room: quizRoomPublic(nextResult.room) });
      startQuizQuestionTimer(roomCode);
    }
  }, 3000);
}

function quizRoomPublic(room) {
  return {
    code: room.code,
    host: room.host,
    players: room.players.map(p => ({ id: p.id, name: p.name, score: p.score })),
    categories: room.categories,
    questionCount: room.questionCount,
    currentQuestion: room.currentQuestion,
    phase: room.phase,
    isSolo: room.isSolo,
  };
}

// Overall game timers (display-only countdown)
const roomTimers = new Map();

// Phase timers for active_selecting / opponents_selecting
const phaseTimers = new Map();

// Bot move timers (so they can be cleared on room cleanup)
const botTimers = new Map();

function clearBotTimer(roomCode) {
  if (botTimers.has(roomCode)) {
    clearTimeout(botTimers.get(roomCode));
    botTimers.delete(roomCode);
  }
}

/**
 * Schedule a bot move after a short random delay (2-5s) to feel natural.
 * Handles both active_selecting (bot picks card+stat) and opponents_selecting (bot picks counter card).
 */
function scheduleBotMove(roomCode) {
  clearBotTimer(roomCode);
  const room = gameManager.getRoom(roomCode);
  if (!room || room.gamePhase === 'ended') return;

  const bot = gameManager.getBotPlayer(roomCode);
  if (!bot || !bot.isActive || bot.hand.length === 0) return;

  const delay = 3000 + Math.floor(Math.random() * 4000); // 3-7s

  if (room.gamePhase === 'active_selecting') {
    const activePlayer = room.players[room.activePlayerIndex];
    if (activePlayer?.isBot) {
      botTimers.set(roomCode, setTimeout(() => {
        const currentRoom = gameManager.getRoom(roomCode);
        if (!currentRoom || currentRoom.gamePhase !== 'active_selecting') return;

        const pick = botPickCardAndStat(currentRoom, activePlayer);
        const autoResult = gameManager.selectCardAndStat(roomCode, activePlayer.id, pick.cardId, pick.stat);
        if (autoResult.error) return;

        const { room: updatedRoom, activeCard, stat } = autoResult;
        const activePlayerId = updatedRoom.players[updatedRoom.activePlayerIndex]?.id;

        // Clear the normal phase timer since bot acted early
        clearPhaseTimer(roomCode);

        io.to(roomCode).emit('phase_changed', {
          phase: 'opponents_selecting',
          activePlayerId,
          activeCard,
          stat,
          statValue: activeCard.stats[stat],
          phaseTimeLeft: updatedRoom.opponentPhaseSeconds
        });

        startOpponentPhaseTimer(roomCode);
      }, delay));
    }
  } else if (room.gamePhase === 'opponents_selecting') {
    if (bot && !room.opponentSelections[bot.id]) {
      const activePlayer = room.players[room.activePlayerIndex];
      if (activePlayer && activePlayer.id !== bot.id) {
        botTimers.set(roomCode, setTimeout(() => {
          const currentRoom = gameManager.getRoom(roomCode);
          if (!currentRoom || currentRoom.gamePhase !== 'opponents_selecting') return;
          if (currentRoom.opponentSelections[bot.id]) return; // already picked

          const result = gameManager.selectOpponentCard(roomCode, bot.id, pickBestOpponentCard(currentRoom, bot));
          if (result.error) return;

          // Broadcast progress
          const activeOpponents = currentRoom.players.filter(
            p => p.isActive && p.hand.length > 0 && p.id !== activePlayer.id
          );
          const submittedCount = activeOpponents.filter(p => currentRoom.opponentSelections[p.id]).length;
          io.to(roomCode).emit('opponent_selection_update', {
            submittedCount,
            totalOpponents: activeOpponents.length
          });

          if (result.allSelected) {
            clearPhaseTimer(roomCode);
            const resolveResult = gameManager.resolveRound(roomCode);
            handleResolveResult(roomCode, resolveResult);
          }
        }, delay));
      }
    }
  }
}

/**
 * Bot picks a card + stat dynamically — rotates through different stats
 * across rounds so it doesn't always pick runs.
 * Strategy: for each available stat, find the best card, then randomly
 * pick among the top 3 stat options weighted toward the strongest.
 */
function botPickCardAndStat(room, bot) {
  const isIPL = room.deckType === 'ipl';
  const deckStats = isIPL
    ? ['ipl_runs', 'ipl_avg', 'ipl_sr', 'ipl_wickets', 'ipl_economy', 'ipl_matches']
    : ['batting_avg', 'strike_rate', 'centuries', 'total_runs', 'wickets', 'catches'];

  // For each stat, find the best eligible card and its value
  const options = [];
  deckStats.forEach(stat => {
    const lowerIsBetter = stat === 'ipl_economy';
    let bestCard = null;
    let bestValue = lowerIsBetter ? Infinity : -Infinity;

    bot.hand.forEach(card => {
      if (card.usedStats && card.usedStats.includes(stat)) return;
      const val = card.stats[stat] || 0;
      if (lowerIsBetter) {
        if (val > 0 && val < bestValue) { bestValue = val; bestCard = card; }
      } else {
        if (val > bestValue) { bestValue = val; bestCard = card; }
      }
    });

    if (bestCard) {
      options.push({ stat, card: bestCard, value: bestValue, lowerIsBetter });
    }
  });

  if (options.length === 0) {
    // All stats burned — fallback
    return { cardId: bot.hand[0].id, stat: deckStats[0] };
  }

  // Sort by relative strength: higher-is-better by value desc, lower-is-better by value asc
  options.sort((a, b) => {
    if (a.lowerIsBetter && b.lowerIsBetter) return a.value - b.value;
    if (a.lowerIsBetter) return 1; // push economy to end usually
    if (b.lowerIsBetter) return -1;
    return b.value - a.value;
  });

  // Weighted random pick from top options — 50% best, 30% second, 20% third
  const weights = [0.50, 0.30, 0.20];
  const roll = Math.random();
  let cumulative = 0;
  for (let i = 0; i < Math.min(options.length, weights.length); i++) {
    cumulative += weights[i];
    if (roll < cumulative) {
      return { cardId: options[i].card.id, stat: options[i].stat };
    }
  }

  return { cardId: options[0].card.id, stat: options[0].stat };
}

/** Pick the best card for a bot opponent to counter the announced stat */
function pickBestOpponentCard(room, bot) {
  const stat = room.activeStat;
  const lowerIsBetter = stat === 'ipl_economy';
  const eligible = bot.hand.filter(c => !c.usedStats || !c.usedStats.includes(stat));
  const pool = eligible.length > 0 ? eligible : bot.hand;

  let bestCard = pool[0];
  let bestValue = lowerIsBetter ? Infinity : -Infinity;

  pool.forEach(card => {
    const val = card.stats[stat] || 0;
    if (lowerIsBetter) {
      if (val > 0 && val < bestValue) { bestValue = val; bestCard = card; }
    } else {
      if (val > bestValue) { bestValue = val; bestCard = card; }
    }
  });

  return bestCard.id;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function buildGameStatePublic(room) {
  return {
    code: room.code,
    host: room.host,
    players: room.players.map(p => ({
      id: p.id,
      name: p.name,
      avatar: p.avatar,
      score: p.score,
      cardCount: p.hand.length,
      isActive: p.isActive
    })),
    timeOption: room.timeOption,
    deckType: room.deckType,
    gamePhase: room.gamePhase,
    currentRound: room.currentRound,
    activePlayerId: room.players[room.activePlayerIndex]?.id,
    neutralPileCount: room.neutralPile.length,
    roundTimeSeconds: room.roundTimeSeconds,
    activePhaseSeconds: room.activePhaseSeconds,
    opponentPhaseSeconds: room.opponentPhaseSeconds
  };
}

function buildRoundResultPublic(roundResult) {
  return {
    stat: roundResult.stat,
    winnerId: roundResult.winnerId,
    isTie: roundResult.isTie,
    neutralPileCount: roundResult.neutralPileCount,
    currentRound: roundResult.currentRound,
    cards: Object.entries(roundResult.roundCards).reduce((acc, [pid, data]) => {
      acc[pid] = { card: data.card, statValue: data.statValue };
      return acc;
    }, {})
  };
}

function clearPhaseTimer(roomCode) {
  if (phaseTimers.has(roomCode)) {
    const { tickInterval, expireTimeout } = phaseTimers.get(roomCode);
    if (tickInterval) clearInterval(tickInterval);
    if (expireTimeout) clearTimeout(expireTimeout);
    phaseTimers.delete(roomCode);
  }
}

/**
 * After resolveRound completes, emit results and either game_ended or next
 * game_state_update with fresh hands.
 */
function handleResolveResult(roomCode, result) {
  if (!result || result.error) return;

  const { room, roundResult, gameEnded, overallWinner } = result;

  const roundResultPublic = buildRoundResultPublic(roundResult);
  const gameStatePublic = buildGameStatePublic(room);

  io.to(roomCode).emit('round_result', {
    roundResult: roundResultPublic,
    gameState: gameStatePublic
  });

  // If overall timer expired mid-round, end after this round resolves
  const timerExpiredMidRound = room.pendingEnd;

  if (gameEnded || timerExpiredMidRound) {
    // Stop overall timer
    if (roomTimers.has(roomCode)) {
      clearInterval(roomTimers.get(roomCode));
      roomTimers.delete(roomCode);
    }

    // Get final winner (re-use handleTimerExpiry if pendingEnd, else use resolved winner)
    const finalWinner = timerExpiredMidRound
      ? gameManager.handleTimerExpiry(roomCode)?.overallWinner
      : overallWinner;

    setTimeout(() => {
      io.to(roomCode).emit('game_ended', {
        reason: timerExpiredMidRound ? 'timer' : 'cards_exhausted',
        overallWinner: finalWinner,
        players: room.players.map(p => ({
          id: p.id,
          name: p.name,
          avatar: p.avatar,
          score: p.score,
          cardCount: p.hand.length
        }))
      });
    }, 3000);
  } else {
    // Send individual hands after a short reveal pause, then start next phase timer
    setTimeout(() => {
      room.players.forEach(player => {
        const playerSocket = io.sockets.sockets.get(player.socketId);
        if (playerSocket && player.isActive) {
          playerSocket.emit('game_state_update', {
            gameState: gameStatePublic,
            myHand: player.hand
          });
        }
      });

      // Emit phase_changed for the new active_selecting phase
      const activePlayerId = room.players[room.activePlayerIndex]?.id;
      io.to(roomCode).emit('phase_changed', {
        phase: 'active_selecting',
        activePlayerId,
        activeCard: null,
        stat: null,
        statValue: null,
        phaseTimeLeft: room.activePhaseSeconds
      });

      // Start the active-selection phase timer
      startActivePhaseTimer(roomCode);

      // If the new active player is a bot, schedule its move
      if (gameManager.isBotRoom(roomCode)) {
        scheduleBotMove(roomCode);
      }
    }, 2500);
  }
}

/**
 * Start the active player's selection phase timer.
 * On expiry: auto-select for active player, transition to opponents phase.
 */
function startActivePhaseTimer(roomCode) {
  clearPhaseTimer(roomCode);

  const room = gameManager.getRoom(roomCode);
  if (!room || room.gamePhase !== 'active_selecting') return;

  let phaseTimeLeft = room.activePhaseSeconds;

  const tickInterval = setInterval(() => {
    phaseTimeLeft -= 1;
    const currentRoom = gameManager.getRoom(roomCode);
    if (!currentRoom || currentRoom.gamePhase !== 'active_selecting') {
      clearInterval(tickInterval);
      return;
    }
    // Keep room in sync so reconnecting players get the real remaining time
    currentRoom.currentPhaseTimeLeft = phaseTimeLeft;
    io.to(roomCode).emit('phase_timer_tick', { phaseTimeLeft, phase: 'active_selecting' });
  }, 1000);

  const expireTimeout = setTimeout(() => {
    clearInterval(tickInterval);
    phaseTimers.delete(roomCode);

    const currentRoom = gameManager.getRoom(roomCode);
    if (!currentRoom || currentRoom.gamePhase !== 'active_selecting') return;

    // Auto-select for the active player
    const autoResult = gameManager.autoSelectActive(roomCode);
    if (autoResult.error) return;

    const { room: updatedRoom, activeCard, stat } = autoResult;
    const activePlayerId = updatedRoom.players[updatedRoom.activePlayerIndex]?.id;

    io.to(roomCode).emit('phase_changed', {
      phase: 'opponents_selecting',
      activePlayerId,
      activeCard,
      stat,
      statValue: activeCard.stats[stat],
      phaseTimeLeft: updatedRoom.opponentPhaseSeconds
    });

    startOpponentPhaseTimer(roomCode);

    // If bot is an opponent, schedule its counter-pick
    if (gameManager.isBotRoom(roomCode)) {
      scheduleBotMove(roomCode);
    }
  }, room.activePhaseSeconds * 1000);

  phaseTimers.set(roomCode, { tickInterval, expireTimeout });
}

/**
 * Start the opponents' selection phase timer.
 * On expiry: auto-select remaining opponents, then resolve round.
 */
function startOpponentPhaseTimer(roomCode) {
  clearPhaseTimer(roomCode);

  const room = gameManager.getRoom(roomCode);
  if (!room || room.gamePhase !== 'opponents_selecting') return;

  let phaseTimeLeft = room.opponentPhaseSeconds;

  const tickInterval = setInterval(() => {
    phaseTimeLeft -= 1;
    const currentRoom = gameManager.getRoom(roomCode);
    if (!currentRoom || currentRoom.gamePhase !== 'opponents_selecting') {
      clearInterval(tickInterval);
      return;
    }
    // Keep room in sync so reconnecting players get the real remaining time
    currentRoom.currentPhaseTimeLeft = phaseTimeLeft;
    io.to(roomCode).emit('phase_timer_tick', { phaseTimeLeft, phase: 'opponents_selecting' });
  }, 1000);

  const expireTimeout = setTimeout(() => {
    clearInterval(tickInterval);
    phaseTimers.delete(roomCode);

    const currentRoom = gameManager.getRoom(roomCode);
    if (!currentRoom || currentRoom.gamePhase !== 'opponents_selecting') return;

    // Auto-select remaining + resolve
    const result = gameManager.autoSelectOpponents(roomCode);
    handleResolveResult(roomCode, result);
  }, room.opponentPhaseSeconds * 1000);

  phaseTimers.set(roomCode, { tickInterval, expireTimeout });
}

/**
 * Overall countdown timer — display only.
 * Game can still continue past this; resolves by cards if not already done.
 */
function startRoomTimer(roomCode) {
  const room = gameManager.getRoom(roomCode);
  if (!room) return;

  if (roomTimers.has(roomCode)) {
    clearInterval(roomTimers.get(roomCode));
  }

  let timeLeft = room.timeOption * 60;

  const interval = setInterval(() => {
    timeLeft -= 1;
    const currentRoom = gameManager.getRoom(roomCode);
    if (!currentRoom || currentRoom.gamePhase === 'ended') {
      clearInterval(interval);
      roomTimers.delete(roomCode);
      return;
    }

    io.to(roomCode).emit('timer_tick', { timeLeft });

    // Warn players at 15s so they know the next round is the last
    if (timeLeft === 15) {
      io.to(roomCode).emit('last_round_warning');
    }

    if (timeLeft <= 0) {
      clearInterval(interval);
      roomTimers.delete(roomCode);

      const currentRoom = gameManager.getRoom(roomCode);
      const midRound = currentRoom &&
        (currentRoom.gamePhase === 'active_selecting' || currentRoom.gamePhase === 'opponents_selecting');

      if (midRound) {
        // Let the current round finish — handleResolveResult will end the game
        currentRoom.pendingEnd = true;
        io.to(roomCode).emit('timer_tick', { timeLeft: 0 }); // freeze display at 0
      } else {
        // No round in progress — end immediately
        clearPhaseTimer(roomCode);
        const result = gameManager.handleTimerExpiry(roomCode);
        if (result) {
          io.to(roomCode).emit('game_ended', {
            reason: 'timer',
            overallWinner: result.overallWinner,
            players: result.room.players.map(p => ({
              id: p.id,
              name: p.name,
              avatar: p.avatar,
              score: p.score,
              cardCount: p.hand.length
            }))
          });
        }
      }
    }
  }, 1000);

  roomTimers.set(roomCode, interval);
}

// ─── Socket Events ───────────────────────────────────────────────────────────

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('create_room', ({ player, timeOption, deckType }) => {
    try {
      const playerWithSocket = { ...player, socketId: socket.id };
      const room = gameManager.createRoom(playerWithSocket, timeOption, deckType);
      socket.join(room.code);
      socket.emit('room_created', {
        roomCode: room.code,
        room: {
          code: room.code,
          host: room.host,
          players: room.players.map(p => ({
            id: p.id,
            name: p.name,
            avatar: p.avatar,
            score: p.score,
            cardCount: p.hand.length,
            isActive: p.isActive
          })),
          timeOption: room.timeOption,
          gamePhase: room.gamePhase
        }
      });
      console.log(`Room created: ${room.code} by ${player.name}`);
    } catch (err) {
      socket.emit('error', { message: err.message });
    }
  });

  socket.on('join_room', ({ roomCode, player }) => {
    try {
      const playerWithSocket = { ...player, socketId: socket.id };
      const result = gameManager.joinRoom(roomCode, playerWithSocket);

      if (result.error) {
        socket.emit('error', { message: result.error });
        return;
      }

      socket.join(roomCode);
      const room = result.room;

      // Existing player rejoining
      if (result.rejoining) {
        if (room.gamePhase === 'ended') {
          // Game is over — send final results so they can see the leaderboard
          socket.emit('game_ended', {
            reason: 'rejoined_ended',
            overallWinner: room.overallWinner || null,
            players: room.players.map(p => ({
              id: p.id, name: p.name, avatar: p.avatar, score: p.score, cardCount: p.hand.length
            }))
          });
        } else if (room.gamePhase !== 'waiting') {
          // Game in progress — send full state so they can jump back in
          const existingPlayer = room.players.find(p => p.id === player.id);
          socket.emit('game_started', {
            myHand: existingPlayer?.hand || [],
            myId: player.id,
            gameState: buildGameStatePublic(room)
          });
          // Also re-send current phase so they know whose turn it is.
          // Use currentPhaseTimeLeft (updated every tick) so the timer doesn't
          // jump back to the full value on reconnect.
          const activePlayerId = room.players[room.activePlayerIndex]?.id;
          const remainingTime = room.currentPhaseTimeLeft > 0
            ? room.currentPhaseTimeLeft
            : (room.gamePhase === 'active_selecting' ? room.activePhaseSeconds : room.opponentPhaseSeconds);
          socket.emit('phase_changed', {
            phase: room.gamePhase,
            activePlayerId,
            activeCard: room.activePlayerCard || null,
            stat: room.activeStat || null,
            statValue: room.activePlayerCard ? room.activePlayerCard.stats[room.activeStat] : null,
            phaseTimeLeft: remainingTime
          });
          console.log(`Player ${player.name} rejoined mid-game in room ${roomCode}`);
        } else {
          // Still in waiting room — treat as normal rejoin
          const roomPublic = {
            code: room.code, host: room.host,
            players: room.players.map(p => ({ id: p.id, name: p.name, avatar: p.avatar, score: p.score, cardCount: p.hand.length, isActive: p.isActive })),
            timeOption: room.timeOption, gamePhase: room.gamePhase
          };
          socket.emit('room_joined', { room: roomPublic, myId: player.id });
          io.to(roomCode).emit('room_updated', { room: roomPublic });
        }
        return;
      }

      // New player joining waiting room
      const roomPublic = {
        code: room.code,
        host: room.host,
        players: room.players.map(p => ({
          id: p.id,
          name: p.name,
          avatar: p.avatar,
          score: p.score,
          cardCount: p.hand.length,
          isActive: p.isActive
        })),
        timeOption: room.timeOption,
        gamePhase: room.gamePhase
      };

      io.to(roomCode).emit('room_updated', { room: roomPublic });
      socket.emit('room_joined', { room: roomPublic, myId: player.id });
      console.log(`Player ${player.name} joined room ${roomCode}`);
    } catch (err) {
      socket.emit('error', { message: err.message });
    }
  });

  socket.on('start_game', ({ roomCode, playerId }) => {
    try {
      const room = gameManager.getRoom(roomCode);
      if (!room) {
        socket.emit('error', { message: 'Room not found' });
        return;
      }
      if (room.host !== playerId) {
        socket.emit('error', { message: 'Only host can start the game' });
        return;
      }

      const result = gameManager.startGame(roomCode);
      if (result.error) {
        socket.emit('error', { message: result.error });
        return;
      }

      const updatedRoom = result.room;
      const activePlayerId = updatedRoom.players[updatedRoom.activePlayerIndex]?.id;

      // Send personalised game_started to each player with their hand
      updatedRoom.players.forEach(player => {
        const playerSocket = io.sockets.sockets.get(player.socketId);
        if (playerSocket) {
          playerSocket.emit('game_started', {
            myHand: player.hand,
            myId: player.id,
            gameState: buildGameStatePublic(updatedRoom)
          });
        }
      });

      // Emit initial phase_changed so all clients know we're in active_selecting
      io.to(roomCode).emit('phase_changed', {
        phase: 'active_selecting',
        activePlayerId,
        activeCard: null,
        stat: null,
        statValue: null,
        phaseTimeLeft: updatedRoom.activePhaseSeconds
      });

      startRoomTimer(roomCode);
      startActivePhaseTimer(roomCode);

      console.log(`Game started in room ${roomCode}`);
    } catch (err) {
      socket.emit('error', { message: err.message });
    }
  });

  /**
   * Create a 1v1 game against a bot — creates room, adds bot, deals cards, starts immediately.
   */
  socket.on('create_bot_game', ({ player, timeOption, deckType }) => {
    try {
      const playerWithSocket = { ...player, socketId: socket.id };
      const room = gameManager.createRoom(playerWithSocket, timeOption, deckType);
      const roomCode = room.code;
      socket.join(roomCode);

      // Add bot to room
      const bot = gameManager.makeBotPlayer();
      gameManager.joinRoom(roomCode, bot);

      // Start game immediately
      const result = gameManager.startGame(roomCode);
      if (result.error) {
        socket.emit('error', { message: result.error });
        return;
      }

      const updatedRoom = result.room;
      const activePlayerId = updatedRoom.players[updatedRoom.activePlayerIndex]?.id;

      // Send game_started only to the human player
      const humanPlayer = updatedRoom.players.find(p => p.id === player.id);
      if (humanPlayer) {
        socket.emit('game_started', {
          myHand: humanPlayer.hand,
          myId: humanPlayer.id,
          gameState: buildGameStatePublic(updatedRoom),
          roomCode,
        });
      }

      io.to(roomCode).emit('phase_changed', {
        phase: 'active_selecting',
        activePlayerId,
        activeCard: null,
        stat: null,
        statValue: null,
        phaseTimeLeft: updatedRoom.activePhaseSeconds
      });

      startRoomTimer(roomCode);
      startActivePhaseTimer(roomCode);

      // If bot is first active player, schedule its move
      scheduleBotMove(roomCode);

      console.log(`Bot game started: ${roomCode} — ${player.name} vs ${bot.name}`);
    } catch (err) {
      socket.emit('error', { message: err.message });
    }
  });

  /**
   * Active player selects their card and a stat.
   */
  socket.on('select_card_stat', ({ roomCode, playerId, cardId, stat }) => {
    try {
      const result = gameManager.selectCardAndStat(roomCode, playerId, cardId, stat);

      if (result.error) {
        socket.emit('error', { message: result.error });
        return;
      }

      // Cancel the active-phase timer since player has chosen
      clearPhaseTimer(roomCode);

      const { room, activeCard } = result;
      const activePlayerId = room.players[room.activePlayerIndex]?.id;

      io.to(roomCode).emit('phase_changed', {
        phase: 'opponents_selecting',
        activePlayerId,
        activeCard,
        stat,
        statValue: activeCard.stats[stat],
        phaseTimeLeft: room.opponentPhaseSeconds
      });

      startOpponentPhaseTimer(roomCode);

      // If bot is an opponent, schedule its counter-pick
      if (gameManager.isBotRoom(roomCode)) {
        scheduleBotMove(roomCode);
      }
    } catch (err) {
      socket.emit('error', { message: err.message });
    }
  });

  /**
   * Opponent selects the card they want to play against the active player's card.
   */
  socket.on('select_opponent_card', ({ roomCode, playerId, cardId }) => {
    try {
      const result = gameManager.selectOpponentCard(roomCode, playerId, cardId);

      if (result.error) {
        socket.emit('error', { message: result.error });
        return;
      }

      const { room, allSelected } = result;

      if (allSelected) {
        // Everyone has picked — resolve immediately, cancel phase timer
        clearPhaseTimer(roomCode);
        const resolveResult = gameManager.resolveRound(roomCode);
        handleResolveResult(roomCode, resolveResult);
      } else {
        // Notify everyone how many have submitted
        const activePlayer = room.players[room.activePlayerIndex];
        const activeOpponents = room.players.filter(
          p => p.isActive && p.hand.length > 0 && p.id !== activePlayer.id
        );
        const submittedCount = Object.keys(room.opponentSelections).length;

        io.to(roomCode).emit('opponent_selection_update', {
          submittedCount,
          totalOpponents: activeOpponents.length
        });
      }
    } catch (err) {
      socket.emit('error', { message: err.message });
    }
  });

  socket.on('leave_room', ({ roomCode, playerId }) => {
    try {
      const result = gameManager.leaveRoom(roomCode, playerId);
      socket.leave(roomCode);

      if (result && !result.deleted) {
        const room = result.room;
        io.to(roomCode).emit('room_updated', {
          room: {
            code: room.code,
            host: room.host,
            players: room.players.map(p => ({
              id: p.id,
              name: p.name,
              avatar: p.avatar,
              score: p.score,
              cardCount: p.hand.length,
              isActive: p.isActive
            })),
            timeOption: room.timeOption,
            gamePhase: room.gamePhase
          }
        });
      }
    } catch (err) {
      socket.emit('error', { message: err.message });
    }
  });

  /**
   * Client reconnected (new socket ID) — re-add to room and refresh their state.
   */
  socket.on('rejoin_room', ({ roomCode, playerId }) => {
    try {
      const room = gameManager.getRoom(roomCode);
      if (!room) return;
      const player = room.players.find(p => p.id === playerId);
      if (!player) return;

      // Update stale socket ID
      player.socketId = socket.id;
      socket.join(roomCode);

      // Send current room state back to the rejoined client
      const roomPublic = {
        code: room.code,
        host: room.host,
        players: room.players.map(p => ({
          id: p.id,
          name: p.name,
          avatar: p.avatar,
          score: p.score,
          cardCount: p.hand.length,
          isActive: p.isActive
        })),
        timeOption: room.timeOption,
        deckType: room.deckType,
        gamePhase: room.gamePhase
      };
      socket.emit('room_updated', { room: roomPublic });
      console.log(`Player ${player.name} rejoined room ${roomCode} with new socket`);
    } catch (err) {
      console.error('rejoin_room error:', err.message);
    }
  });

  // ─── QUIZ EVENTS ──────────────────────────────────────────────────────────

  socket.on('quiz_create_room', ({ player, categories, questionCount }) => {
    try {
      const playerWithSocket = { ...player, socketId: socket.id };
      const room = quizManager.createQuizRoom(playerWithSocket, categories, questionCount || 10);
      socket.join('quiz_' + room.code);
      socket.emit('quiz_room_created', { roomCode: room.code, room: quizRoomPublic(room) });
      console.log(`Quiz room created: ${room.code} by ${player.name}`);
    } catch (err) {
      socket.emit('error', { message: err.message });
    }
  });

  socket.on('quiz_solo_start', ({ player, categories, questionCount }) => {
    try {
      const playerWithSocket = { ...player, socketId: socket.id };
      const room = quizManager.createSoloQuiz(playerWithSocket, categories, questionCount || 10);
      socket.join('quiz_' + room.code);
      const result = quizManager.startQuiz(room.code);
      if (result.error) { socket.emit('error', { message: result.error }); return; }
      socket.emit('quiz_started', { roomCode: room.code, question: result.question, room: quizRoomPublic(result.room) });
      startQuizQuestionTimer(room.code);
      console.log(`Solo quiz started: ${room.code} by ${player.name}`);
    } catch (err) {
      socket.emit('error', { message: err.message });
    }
  });

  socket.on('quiz_join_room', ({ roomCode, player }) => {
    try {
      const playerWithSocket = { ...player, socketId: socket.id };
      const result = quizManager.joinQuizRoom(roomCode, playerWithSocket);
      if (result.error) { socket.emit('error', { message: result.error }); return; }
      socket.join('quiz_' + roomCode);
      const pub = quizRoomPublic(result.room);
      io.to('quiz_' + roomCode).emit('quiz_room_updated', { room: pub });
      socket.emit('quiz_room_joined', { room: pub, myId: player.id });
    } catch (err) {
      socket.emit('error', { message: err.message });
    }
  });

  socket.on('quiz_start', ({ roomCode, playerId }) => {
    try {
      const room = quizManager.getQuizRoom(roomCode);
      if (!room) { socket.emit('error', { message: 'Room not found' }); return; }
      if (room.host !== playerId) { socket.emit('error', { message: 'Only host can start' }); return; }
      const result = quizManager.startQuiz(roomCode);
      if (result.error) { socket.emit('error', { message: result.error }); return; }
      io.to('quiz_' + roomCode).emit('quiz_started', { roomCode, question: result.question, room: quizRoomPublic(result.room) });
      startQuizQuestionTimer(roomCode);
    } catch (err) {
      socket.emit('error', { message: err.message });
    }
  });

  socket.on('quiz_answer', ({ roomCode, playerId, answerIndex }) => {
    try {
      const result = quizManager.submitAnswer(roomCode, playerId, answerIndex);
      if (result.error) { socket.emit('error', { message: result.error }); return; }

      // Broadcast answer count
      io.to('quiz_' + roomCode).emit('quiz_answer_update', {
        answeredCount: result.answeredCount,
        totalPlayers: result.room.players.length,
      });

      if (result.allAnswered) {
        clearQuizTimer(roomCode);
        resolveAndAdvanceQuiz(roomCode);
      }
    } catch (err) {
      socket.emit('error', { message: err.message });
    }
  });

  socket.on('quiz_leave', ({ roomCode, playerId }) => {
    try {
      const result = quizManager.leaveQuizRoom(roomCode, playerId);
      socket.leave('quiz_' + roomCode);
      if (result && !result.deleted) {
        io.to('quiz_' + roomCode).emit('quiz_room_updated', { room: quizRoomPublic(result.room) });
      }
    } catch (err) { /* ignore */ }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Cricket Trump Card server running on port ${PORT}`);
});
