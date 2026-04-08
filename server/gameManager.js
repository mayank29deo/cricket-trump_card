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
/**
 * Balanced deal — each player gets roughly equal legendary/epic/rare cards
 * with intentional ±1 variation per tier to keep games interesting.
 *
 * Algorithm:
 *  1. Bucket the full deck into rarity tiers, shuffle within each tier.
 *  2. Compute per-player targets: base allocation ± random bonus of 1 for
 *     legendary and epic, compensated by reducing rare by the same amount.
 *  3. Pull cards tier-by-tier for each player; fall back to rare if a
 *     higher tier runs dry.
 *  4. Shuffle each player's final hand so card order is random.
 */
function balancedDeal(fullDeck, playerCount, cardsPerPlayer) {
  // Bucket ALL cards by rarity, shuffle within each bucket so random players
  // within a tier are drawn, not always the same top-N.
  const buckets = { legendary: [], epic: [], rare: [], common: [] };
  const temp    = { legendary: [], epic: [], rare: [], common: [] };
  fullDeck.forEach(c => {
    const tier = (c.rarity in temp) ? c.rarity : 'common';
    temp[tier].push(c);
  });
  Object.keys(buckets).forEach(t => { buckets[t] = shuffleArray(temp[t]); });

  // Base per-player allocation (sums exactly to cardsPerPlayer)
  const baseleg = Math.max(2, Math.floor(cardsPerPlayer * 0.22));
  const baseepc = Math.max(2, Math.floor(cardsPerPlayer * 0.28));
  const basecom = Math.floor(cardsPerPlayer * 0.04);
  const baserar = cardsPerPlayer - baseleg - baseepc - basecom;

  // Generate per-player targets with ±1 variation on legendary and epic
  const targets = Array.from({ length: playerCount }, () => {
    const lb = Math.random() < 0.45 ? 1 : 0;   // ~45% chance +1 legendary
    const eb = Math.random() < 0.45 ? 1 : 0;   // ~45% chance +1 epic
    const leg = baseleg + lb;
    const epc = baseepc + eb;
    const com = basecom;
    const rar = Math.max(0, cardsPerPlayer - leg - epc - com);
    return { legendary: leg, epic: epc, rare: rar, common: com };
  });

  // Cap targets if a bucket is too shallow (e.g. very small decks)
  for (const tier of ['legendary', 'epic']) {
    const base = tier === 'legendary' ? baseleg : baseepc;
    let excess = targets.reduce((s, t) => s + t[tier], 0) - buckets[tier].length;
    for (const t of targets) {
      if (excess <= 0) break;
      if (t[tier] > base) { t[tier]--; t.rare++; excess--; }
    }
    // If still short, reduce base allocations
    for (const t of targets) {
      if (excess <= 0) break;
      if (t[tier] > 0) { t[tier]--; t.rare++; excess--; }
    }
  }

  // Draw cards from buckets for each player
  const hands = Array.from({ length: playerCount }, () => []);
  for (let p = 0; p < playerCount; p++) {
    for (const tier of ['legendary', 'epic', 'rare', 'common']) {
      const need  = targets[p][tier];
      const taken = buckets[tier].splice(0, Math.min(need, buckets[tier].length));
      hands[p].push(...taken);
      // Shortfall: bucket ran dry — top up from rare, then common
      let gap = need - taken.length;
      for (const fallback of ['rare', 'common', 'epic', 'legendary']) {
        if (gap <= 0) break;
        const fill = buckets[fallback].splice(0, Math.min(gap, buckets[fallback].length));
        hands[p].push(...fill);
        gap -= fill.length;
      }
    }
  }

  // Shuffle each hand so the player doesn't always start with legendaries on top
  return hands.map(h => shuffleArray(h));
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
    currentPhaseTimeLeft: 0,   // updated every tick so rejoiners get accurate timer
    createdAt: new Date()
  };

  rooms.set(code, room);
  return room;
}

function joinRoom(roomCode, player) {
  const room = rooms.get(roomCode);
  if (!room) return { error: 'Room not found' };

  // Allow existing players to rejoin regardless of game phase
  const existingPlayer = room.players.find(p => p.id === player.id);
  if (existingPlayer) {
    existingPlayer.socketId = player.socketId;
    return { room, rejoining: true };
  }

  if (room.gamePhase !== 'waiting') return { error: 'Game already in progress' };
  if (room.players.length >= 6) return { error: 'Room is full' };

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

  // Deduplicate deck
  const deck = DECKS[room.deckType] || cricketers;
  const seen = new Set();
  const unique = deck.filter(c => { if (seen.has(c.id)) return false; seen.add(c.id); return true; });

  // 2 players → 26 cards each; 3–6 players → 18 cards each
  const playerCount = room.players.length;
  const cardsPerPlayer = playerCount <= 2 ? 26 : 18;

  // Balanced deal: each player gets a fair rarity spread with ±1 variation
  const dealtHands = balancedDeal(unique, playerCount, cardsPerPlayer);

  room.players.forEach((player, index) => {
    player.hand = dealtHands[index].map(card => {
      const fc = freshCard(card);
      // Burn ipl_economy for pure batsmen so they can't exploit it
      if (room.deckType === 'ipl' && (card.stats.ipl_wickets || 0) < 1) {
        fc.usedStats.push('ipl_economy');
      }
      return fc;
    });
    player.score = 0;
    player.isActive = true;
  });

  room.neutralPile = [];
  room.activePlayerIndex = 0;
  room.currentRound = 0;
  room.roundCards = {};
  room.timeLeft = room.timeOption * 60;

  // Dynamic round timer — each phase gets at least 24s
  const rawRoundTime = Math.floor((room.timeOption * 60) / cardsPerPlayer);
  room.roundTimeSeconds = Math.max(48, Math.min(70, rawRoundTime));
  room.activePhaseSeconds = Math.max(24, Math.floor(room.roundTimeSeconds * 0.55));
  room.opponentPhaseSeconds = Math.max(24, Math.floor(room.roundTimeSeconds * 0.45));

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

  const validStats = [
    'batting_avg', 'strike_rate', 'centuries', 'total_runs', 'wickets', 'catches', // international
    'ipl_runs', 'ipl_avg', 'ipl_sr', 'ipl_wickets', 'ipl_economy', 'ipl_matches'   // ipl
  ];
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

  const isIPL = room.deckType === 'ipl';
  const primaryStat = isIPL ? 'ipl_runs' : 'total_runs';
  const deckStats = isIPL
    ? ['ipl_runs', 'ipl_avg', 'ipl_sr', 'ipl_wickets', 'ipl_economy', 'ipl_matches']
    : ['batting_avg', 'strike_rate', 'centuries', 'total_runs', 'wickets', 'catches'];

  // First choice: best card by primary runs stat, declared as the stat
  let bestCard = null;
  let bestValue = -Infinity;

  activePlayer.hand.forEach(card => {
    if (card.usedStats && card.usedStats.includes(primaryStat)) return;
    const val = card.stats[primaryStat] || 0;
    if (val > bestValue) {
      bestValue = val;
      bestCard = card;
    }
  });

  if (bestCard) {
    return selectCardAndStat(roomCode, activePlayer.id, bestCard.id, primaryStat);
  }

  // Fallback: runs stat burned on all cards — pick best card+stat combo across deck stats
  let fallbackCard = null;
  let fallbackStat = null;
  let fallbackValue = -Infinity;

  activePlayer.hand.forEach(card => {
    deckStats.forEach(s => {
      if (card.usedStats && card.usedStats.includes(s)) return;
      const val = card.stats[s] || 0;
      if (val > fallbackValue) {
        fallbackValue = val;
        fallbackCard = card;
        fallbackStat = s;
      }
    });
  });

  if (fallbackCard) {
    return selectCardAndStat(roomCode, activePlayer.id, fallbackCard.id, fallbackStat);
  }

  // Last resort: all stats burned — pick first available combo
  for (const card of activePlayer.hand) {
    for (const s of deckStats) {
      if (!card.usedStats || !card.usedStats.includes(s)) {
        return selectCardAndStat(roomCode, activePlayer.id, card.id, s);
      }
    }
  }

  return selectCardAndStat(roomCode, activePlayer.id, activePlayer.hand[0].id, deckStats[0]);
}

function autoSelectOpponents(roomCode) {
  const room = rooms.get(roomCode);
  if (!room) return { error: 'Room not found' };

  const activePlayer = room.players[room.activePlayerIndex];
  const stat = room.activeStat;

  const activeOpponents = room.players.filter(
    p => p.isActive && p.hand.length > 0 && p.id !== activePlayer.id
  );

  const lowerIsBetter = stat === 'ipl_economy';

  activeOpponents.forEach(player => {
    if (!room.opponentSelections[player.id]) {
      let bestCard = player.hand[0];
      let bestValue = lowerIsBetter ? Infinity : -Infinity;

      player.hand.forEach(card => {
        const val = card.stats[stat] || 0;
        if (lowerIsBetter) {
          // Pick lowest non-zero value; if all zero, fall back to first card
          if (val > 0 && val < bestValue) {
            bestValue = val;
            bestCard = card;
          }
        } else {
          if (val > bestValue) {
            bestValue = val;
            bestCard = card;
          }
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

  // For ipl_economy: lower non-zero value wins; for all others: highest wins
  const lowerIsBetter = stat === 'ipl_economy';
  let targetValue;
  if (lowerIsBetter) {
    const nonZeroValues = Object.values(roundCards).map(({ statValue }) => statValue).filter(v => v > 0);
    targetValue = nonZeroValues.length > 0 ? Math.min(...nonZeroValues) : 0;
  } else {
    targetValue = Math.max(...Object.values(roundCards).map(({ statValue }) => statValue));
  }

  const winners = Object.entries(roundCards).filter(([, { statValue }]) => {
    if (lowerIsBetter) return statValue === targetValue && statValue > 0;
    return statValue === targetValue;
  });
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
      // Burn the round's stat on ALL played cards — whoever holds the card
      // next cannot reuse the same stat on it (fair across all players)
      const cardsForWinner = playedCards.map(card => {
        const used = card.usedStats || [];
        return { ...card, usedStats: used.includes(stat) ? used : [...used, stat] };
      });

      winner.hand.push(...cardsForWinner);

      // Neutral pile goes to winner — preserve usedStats history from prior rounds
      if (room.neutralPile.length > 0) {
        winner.hand.push(...room.neutralPile);
        room.neutralPile = [];
      }
    }
  } else {
    // Tie: burn the stat on cards going to neutral pile too
    playedCards.forEach(card => {
      const used = card.usedStats || [];
      room.neutralPile.push({ ...card, usedStats: used.includes(stat) ? used : [...used, stat] });
    });
  }

  // ── Round points: rank all participants by stat value, award 10/8/6/4 ──
  // Ties share the higher bracket (both get the higher points).
  const playerCount = Object.keys(roundCards).length;
  const ROUND_POINTS_BY_COUNT = {
    2: [10, 0],
    3: [10, 7, 5],
    4: [10, 7, 5, 2],
    5: [10, 8, 6, 4, 2],
    6: [10, 8, 6, 4, 2, 0],
  };
  const ROUND_POINTS = ROUND_POINTS_BY_COUNT[playerCount] || [10, 8, 6, 4, 2, 0];
  const participants = Object.entries(roundCards)
    .map(([pid, { statValue }]) => ({ pid, statValue }));

  // Sort: for lowerIsBetter, non-zero lowest first; otherwise highest first
  participants.sort((a, b) => {
    if (lowerIsBetter) {
      if (a.statValue === 0 && b.statValue === 0) return 0;
      if (a.statValue === 0) return 1;
      if (b.statValue === 0) return -1;
      return a.statValue - b.statValue;
    }
    return b.statValue - a.statValue;
  });

  const roundPointsAwarded = {};
  let rank = 0;
  for (let i = 0; i < participants.length; i++) {
    // Tied with previous → same rank (same points bracket)
    if (i > 0 && participants[i].statValue === participants[i - 1].statValue) {
      // same rank as previous
    } else {
      rank = i;
    }
    const pts = ROUND_POINTS[rank] ?? 0;
    const player = room.players.find(p => p.id === participants[i].pid);
    if (player) {
      player.score += pts;
      roundPointsAwarded[participants[i].pid] = pts;
    }
  }

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
    room.overallWinner = overallWinner
      ? { id: overallWinner.id, name: overallWinner.name, score: overallWinner.score }
      : null;
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
      currentRound: room.currentRound,
      roundPointsAwarded,
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

  const overallWinner = winner ? { id: winner.id, name: winner.name, score: winner.score } : null;
  room.overallWinner = overallWinner;

  return { room, overallWinner };
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
    room.neutralPile.push(...player.hand);
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
