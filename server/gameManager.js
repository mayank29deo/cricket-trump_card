const { v4: uuidv4 } = require('uuid');
const cricketers = require('./data/cricketers');
const iplCricketers = require('./data/iplCricketers');

const DECKS = { international: cricketers, ipl: iplCricketers };

const rooms = new Map();

function generateRoomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Attach usedStats tracker to a card (preserving existing fields) */
function freshCard(card) {
  return { ...card, usedStats: [] };
}

/** Sum of card.points in a hand */
function calcHandScore(hand) {
  return hand.reduce((sum, c) => sum + (c.points || 25), 0);
}

function createRoom(hostPlayer, timeOption, deckType) {
  let code;
  do {
    code = generateRoomCode();
  } while (rooms.has(code));

  const room = {
    code,
    host: hostPlayer.id,
    players: [
      {
        id: hostPlayer.id,
        name: hostPlayer.name,
        avatar: hostPlayer.avatar || null,
        socketId: hostPlayer.socketId,
        hand: [],
        score: 0,
        isActive: true
      }
    ],
    timeOption: timeOption || 6,
    deckType: deckType || 'international',
    gamePhase: 'waiting',
    currentRound: 0,
    activePlayerIndex: 0,
    roundCards: {},
    neutralPile: [],
    timer: null,
    timeLeft: 0,
    activeCardId: null,
    activeStat: null,
    activePlayerCard: null,
    opponentSelections: {},
    roundTimeSeconds: 0,
    activePhaseSeconds: 0,
    opponentPhaseSeconds: 0,
    createdAt: new Date()
  };

  rooms.set(code, room);
  return room;
}

function joinRoom(roomCode, player) {
  const room = rooms.get(roomCode);
  if (!room) return { error: 'Room not found' };
  if (room.gamePhase !== 'waiting') return { error: 'Game already in progress' };
  if (room.players.length >= 6) return { error: 'Room is full' };

  const existingPlayer = room.players.find(p => p.id === player.id);
  if (existingPlayer) {
    existingPlayer.socketId = player.socketId;
    return { room };
  }

  room.players.push({
    id: player.id,
    name: player.name,
    avatar: player.avatar || null,
    socketId: player.socketId,
    hand: [],
    score: 0,
    isActive: true
  });

  return { room };
}

function startGame(roomCode) {
  const room = rooms.get(roomCode);
  if (!room) return { error: 'Room not found' };
  if (room.players.length < 2) return { error: 'Need at least 2 players' };

  // Pick deck based on room setting, shuffle all 104, deal 52
  const deck = DECKS[room.deckType] || cricketers;
  const gameCards = shuffleArray(deck).slice(0, 52).map(freshCard);

  const playerCount = room.players.length;
  const cardsPerPlayer = Math.floor(52 / playerCount);

  room.players.forEach((player, index) => {
    player.hand = gameCards.slice(index * cardsPerPlayer, (index + 1) * cardsPerPlayer);
    player.score = calcHandScore(player.hand);
    player.isActive = true;
  });

  room.neutralPile = gameCards.slice(playerCount * cardsPerPlayer);
  room.activePlayerIndex = 0;
  room.currentRound = 0;
  room.roundCards = {};
  room.timeLeft = room.timeOption * 60;

  // Dynamic round timer — each phase gets at least 20s
  const rawRoundTime = Math.floor((room.timeOption * 60) / Math.ceil(52 / playerCount));
  room.roundTimeSeconds = Math.max(40, Math.min(60, rawRoundTime));
  room.activePhaseSeconds = Math.max(20, Math.floor(room.roundTimeSeconds * 0.55));
  room.opponentPhaseSeconds = Math.max(20, Math.floor(room.roundTimeSeconds * 0.45));

  room.activeCardId = null;
  room.activeStat = null;
  room.activePlayerCard = null;
  room.opponentSelections = {};
  room.gamePhase = 'active_selecting';

  return { room };
}

function selectCardAndStat(roomCode, playerId, cardId, stat) {
  const room = rooms.get(roomCode);
  if (!room) return { error: 'Room not found' };
  if (room.gamePhase !== 'active_selecting') return { error: 'Not in card selection phase' };

  const activePlayer = room.players[room.activePlayerIndex];
  if (!activePlayer || activePlayer.id !== playerId) return { error: 'Not your turn' };

  const validStats = ['batting_avg', 'strike_rate', 'centuries', 'total_runs', 'wickets', 'catches'];
  if (!validStats.includes(stat)) return { error: 'Invalid stat' };

  const card = activePlayer.hand.find(c => c.id === cardId);
  if (!card) return { error: 'Card not found in your hand' };

  // Check if this stat has been burned on this card for this player
  if (card.usedStats && card.usedStats.includes(stat)) {
    return { error: `${stat} is already used for this card — pick a different stat or card` };
  }

  room.activeCardId = cardId;
  room.activeStat = stat;
  room.activePlayerCard = card;
  room.opponentSelections = {};
  room.gamePhase = 'opponents_selecting';

  return { room, activeCard: card, stat };
}

function selectOpponentCard(roomCode, playerId, cardId) {
  const room = rooms.get(roomCode);
  if (!room) return { error: 'Room not found' };
  if (room.gamePhase !== 'opponents_selecting') return { error: 'Not in opponent selection phase' };

  const activePlayer = room.players[room.activePlayerIndex];
  if (activePlayer && activePlayer.id === playerId) return { error: 'Active player cannot select an opponent card' };

  const player = room.players.find(p => p.id === playerId && p.isActive && p.hand.length > 0);
  if (!player) return { error: 'Player not found or not active' };

  if (room.opponentSelections[playerId]) return { error: 'Already selected a card this round' };

  const card = player.hand.find(c => c.id === cardId);
  if (!card) return { error: 'Card not found in your hand' };

  room.opponentSelections[playerId] = { card, cardId };

  const activeOpponents = room.players.filter(
    p => p.isActive && p.hand.length > 0 && p.id !== activePlayer.id
  );
  const allSelected = activeOpponents.every(p => room.opponentSelections[p.id]);

  return { room, allSelected };
}

function autoSelectActive(roomCode) {
  const room = rooms.get(roomCode);
  if (!room) return { error: 'Room not found' };

  const activePlayer = room.players[room.activePlayerIndex];
  if (!activePlayer || activePlayer.hand.length === 0) return { error: 'Active player has no cards' };

  const validStats = ['batting_avg', 'strike_rate', 'centuries', 'total_runs', 'wickets', 'catches'];

  let bestCard = null;
  let bestStat = null;
  let bestValue = -Infinity;

  activePlayer.hand.forEach(card => {
    validStats.forEach(s => {
      // Skip burned stats
      if (card.usedStats && card.usedStats.includes(s)) return;
      const val = card.stats[s] || 0;
      if (val > bestValue) {
        bestValue = val;
        bestCard = card;
        bestStat = s;
      }
    });
  });

  // Fallback: all stats burned on best cards — find any available combo
  if (!bestCard) {
    for (const card of activePlayer.hand) {
      for (const s of validStats) {
        if (!card.usedStats || !card.usedStats.includes(s)) {
          bestCard = card;
          bestStat = s;
          break;
        }
      }
      if (bestCard) break;
    }
  }

  // Last resort: all stats burned on all cards — just pick first card/stat
  if (!bestCard) {
    bestCard = activePlayer.hand[0];
    bestStat = validStats[0];
  }

  return selectCardAndStat(roomCode, activePlayer.id, bestCard.id, bestStat);
}

function autoSelectOpponents(roomCode) {
  const room = rooms.get(roomCode);
  if (!room) return { error: 'Room not found' };

  const activePlayer = room.players[room.activePlayerIndex];
  const stat = room.activeStat;

  const activeOpponents = room.players.filter(
    p => p.isActive && p.hand.length > 0 && p.id !== activePlayer.id
  );

  activeOpponents.forEach(player => {
    if (!room.opponentSelections[player.id]) {
      let bestCard = player.hand[0];
      let bestValue = player.hand[0].stats[stat] || 0;
      player.hand.forEach(card => {
        const val = card.stats[stat] || 0;
        if (val > bestValue) {
          bestValue = val;
          bestCard = card;
        }
      });
      room.opponentSelections[player.id] = { card: bestCard, cardId: bestCard.id };
    }
  });

  return resolveRound(roomCode);
}

function resolveRound(roomCode) {
  const room = rooms.get(roomCode);
  if (!room) return { error: 'Room not found' };

  const activePlayer = room.players[room.activePlayerIndex];
  const stat = room.activeStat;
  const activeCard = room.activePlayerCard;

  if (!activeCard || !stat) return { error: 'No active card or stat selected' };

  // Build roundCards: { playerId: { card, statValue } }
  const roundCards = {};
  roundCards[activePlayer.id] = {
    card: activeCard,
    statValue: activeCard.stats[stat] || 0
  };
  Object.entries(room.opponentSelections).forEach(([pid, { card }]) => {
    roundCards[pid] = { card, statValue: card.stats[stat] || 0 };
  });

  // Find max value
  let maxValue = -Infinity;
  Object.values(roundCards).forEach(({ statValue }) => {
    if (statValue > maxValue) maxValue = statValue;
  });

  const winners = Object.entries(roundCards).filter(([, { statValue }]) => statValue === maxValue);
  const playedCards = Object.values(roundCards).map(({ card }) => card);

  let winnerId = null;

  // Remove all played cards from their owners' hands first
  Object.entries(roundCards).forEach(([pid, { card }]) => {
    const player = room.players.find(p => p.id === pid);
    if (player) {
      player.hand = player.hand.filter(c => c.id !== card.id);
    }
  });

  if (winners.length === 1) {
    winnerId = winners[0][0];
    const winner = room.players.find(p => p.id === winnerId);

    if (winner) {
      // Build cards for winner:
      // - Active player's own card (if active player won): burn the winning stat
      // - All other cards: come in fresh (no usedStats)
      const cardsForWinner = playedCards.map(card => {
        if (winnerId === activePlayer.id && card.id === activeCard.id) {
          // Burn the winning stat on the active player's own card
          return { ...card, usedStats: [...(card.usedStats || []), stat] };
        }
        // Opponent cards or active player's card going to an opponent: reset burns
        return freshCard(card);
      });

      winner.hand.push(...cardsForWinner);

      // Neutral pile goes to winner fresh
      if (room.neutralPile.length > 0) {
        winner.hand.push(...room.neutralPile.map(freshCard));
        room.neutralPile = [];
      }

      winner.score = calcHandScore(winner.hand);
    }
  } else {
    // Tie: all played cards go to neutral pile
    playedCards.forEach(card => room.neutralPile.push(freshCard(card)));
  }

  // Recompute scores for all other players (hands changed)
  room.players.forEach(player => {
    if (player.id !== winnerId) {
      player.score = calcHandScore(player.hand);
    }
  });

  // Check eliminations
  room.players.forEach(player => {
    if (player.hand.length === 0) player.isActive = false;
  });

  room.currentRound += 1;

  const stillActive = room.players.filter(p => p.isActive && p.hand.length > 0);

  let gameEnded = false;
  let overallWinner = null;

  if (stillActive.length <= 1) {
    gameEnded = true;
    if (stillActive.length === 1) {
      overallWinner = stillActive[0];
    } else {
      // Everyone out — pick by highest score
      let maxScore = -1;
      room.players.forEach(player => {
        if (player.score > maxScore) {
          maxScore = player.score;
          overallWinner = player;
        }
      });
    }
    room.gamePhase = 'ended';
  } else {
    // Next active player: winner if there is one, otherwise rotate
    if (winnerId) {
      const winnerIndex = room.players.findIndex(p => p.id === winnerId);
      room.activePlayerIndex = winnerIndex;
    } else {
      let nextIndex = (room.activePlayerIndex + 1) % room.players.length;
      let attempts = 0;
      while (!room.players[nextIndex].isActive && attempts < room.players.length) {
        nextIndex = (nextIndex + 1) % room.players.length;
        attempts++;
      }
      room.activePlayerIndex = nextIndex;
    }
    room.gamePhase = 'active_selecting';
  }

  // Clear round state
  room.opponentSelections = {};
  room.activeCardId = null;
  room.activeStat = null;
  room.activePlayerCard = null;

  return {
    room,
    roundResult: {
      stat,
      roundCards,
      winnerId,
      isTie: winners.length > 1,
      neutralPileCount: room.neutralPile.length,
      currentRound: room.currentRound
    },
    gameEnded,
    overallWinner: overallWinner
      ? { id: overallWinner.id, name: overallWinner.name, score: overallWinner.score }
      : null
  };
}

function handleTimerExpiry(roomCode) {
  const room = rooms.get(roomCode);
  if (!room || room.gamePhase === 'ended') return null;

  room.gamePhase = 'ended';

  // Winner = highest score (hand points)
  let maxScore = -1;
  let winner = null;
  room.players.forEach(player => {
    if (player.score > maxScore) {
      maxScore = player.score;
      winner = player;
    }
  });

  return {
    room,
    overallWinner: winner ? { id: winner.id, name: winner.name, score: winner.score } : null
  };
}

function leaveRoom(roomCode, playerId) {
  const room = rooms.get(roomCode);
  if (!room) return null;

  const playerIndex = room.players.findIndex(p => p.id === playerId);
  if (playerIndex === -1) return null;

  const player = room.players[playerIndex];
  player.isActive = false;

  const gameIsActive = room.gamePhase === 'active_selecting' || room.gamePhase === 'opponents_selecting';

  if (gameIsActive && player.hand.length > 0) {
    room.neutralPile.push(...player.hand.map(freshCard));
    player.hand = [];
    player.score = 0;
  }

  const activePlayers = room.players.filter(p => p.isActive);

  if (activePlayers.length === 0) {
    rooms.delete(roomCode);
    return { deleted: true };
  }

  if (room.host === playerId && activePlayers.length > 0) {
    room.host = activePlayers[0].id;
  }

  if (gameIsActive) {
    const stillActiveWithCards = room.players.filter(p => p.isActive && p.hand.length > 0);
    if (stillActiveWithCards.length <= 1) {
      room.gamePhase = 'ended';
    } else {
      if (room.activePlayerIndex >= room.players.length || !room.players[room.activePlayerIndex].isActive) {
        let nextIndex = room.activePlayerIndex % room.players.length;
        let attempts = 0;
        while (!room.players[nextIndex].isActive && attempts < room.players.length) {
          nextIndex = (nextIndex + 1) % room.players.length;
          attempts++;
        }
        room.activePlayerIndex = nextIndex;
      }
    }
  }

  return { room };
}

function getRoom(roomCode) {
  return rooms.get(roomCode) || null;
}

function updatePlayerSocket(roomCode, playerId, socketId) {
  const room = rooms.get(roomCode);
  if (!room) return null;
  const player = room.players.find(p => p.id === playerId);
  if (player) player.socketId = socketId;
  return room;
}

module.exports = {
  createRoom,
  joinRoom,
  startGame,
  selectCardAndStat,
  selectOpponentCard,
  autoSelectActive,
  autoSelectOpponents,
  resolveRound,
  handleTimerExpiry,
  leaveRoom,
  getRoom,
  updatePlayerSocket
};
