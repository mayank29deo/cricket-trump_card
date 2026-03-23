const { v4: uuidv4 } = require('uuid');
const cricketers = require('./data/cricketers');

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

function createRoom(hostPlayer, timeOption) {
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
    gamePhase: 'waiting',
    currentRound: 0,
    activePlayerIndex: 0,
    roundCards: {},
    neutralPile: [],
    timer: null,
    timeLeft: 0,
    // New fields for card-selection mechanic
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
  if (!room) {
    return { error: 'Room not found' };
  }
  if (room.gamePhase !== 'waiting') {
    return { error: 'Game already in progress' };
  }
  if (room.players.length >= 6) {
    return { error: 'Room is full' };
  }
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
  if (!room) {
    return { error: 'Room not found' };
  }
  if (room.players.length < 2) {
    return { error: 'Need at least 2 players' };
  }

  const shuffled = shuffleArray(cricketers);
  const playerCount = room.players.length;
  const cardsPerPlayer = Math.floor(52 / playerCount);

  room.players.forEach((player, index) => {
    player.hand = shuffled.slice(index * cardsPerPlayer, (index + 1) * cardsPerPlayer);
    player.score = 0;
    player.isActive = true;
  });

  room.neutralPile = shuffled.slice(playerCount * cardsPerPlayer);
  room.activePlayerIndex = 0;
  room.currentRound = 0;
  room.roundCards = {};
  room.timeLeft = room.timeOption * 60;

  // Calculate dynamic round timer
  const rawRoundTime = Math.floor((room.timeOption * 60) / Math.ceil(52 / playerCount));
  room.roundTimeSeconds = Math.max(12, Math.min(45, rawRoundTime));
  room.activePhaseSeconds = Math.floor(room.roundTimeSeconds * 0.55);
  room.opponentPhaseSeconds = Math.floor(room.roundTimeSeconds * 0.45);

  // Reset selection fields
  room.activeCardId = null;
  room.activeStat = null;
  room.activePlayerCard = null;
  room.opponentSelections = {};

  // New phase name
  room.gamePhase = 'active_selecting';

  return { room };
}

function selectCardAndStat(roomCode, playerId, cardId, stat) {
  const room = rooms.get(roomCode);
  if (!room) {
    return { error: 'Room not found' };
  }
  if (room.gamePhase !== 'active_selecting') {
    return { error: 'Not in card selection phase' };
  }

  const activePlayer = room.players[room.activePlayerIndex];
  if (!activePlayer || activePlayer.id !== playerId) {
    return { error: 'Not your turn' };
  }

  const validStats = ['batting_avg', 'strike_rate', 'centuries', 'total_runs', 'wickets', 'catches'];
  if (!validStats.includes(stat)) {
    return { error: 'Invalid stat' };
  }

  const card = activePlayer.hand.find(c => c.id === cardId);
  if (!card) {
    return { error: 'Card not found in your hand' };
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
  if (!room) {
    return { error: 'Room not found' };
  }
  if (room.gamePhase !== 'opponents_selecting') {
    return { error: 'Not in opponent selection phase' };
  }

  const activePlayer = room.players[room.activePlayerIndex];
  if (activePlayer && activePlayer.id === playerId) {
    return { error: 'Active player cannot select an opponent card' };
  }

  const player = room.players.find(p => p.id === playerId && p.isActive && p.hand.length > 0);
  if (!player) {
    return { error: 'Player not found or not active' };
  }

  // Already submitted
  if (room.opponentSelections[playerId]) {
    return { error: 'Already selected a card this round' };
  }

  const card = player.hand.find(c => c.id === cardId);
  if (!card) {
    return { error: 'Card not found in your hand' };
  }

  room.opponentSelections[playerId] = { card, cardId };

  // Check if all active opponents have selected
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
  if (!activePlayer || activePlayer.hand.length === 0) {
    return { error: 'Active player has no cards' };
  }

  const validStats = ['batting_avg', 'strike_rate', 'centuries', 'total_runs', 'wickets', 'catches'];

  let bestCard = null;
  let bestStat = null;
  let bestValue = -Infinity;

  activePlayer.hand.forEach(card => {
    validStats.forEach(stat => {
      const val = card.stats[stat] || 0;
      if (val > bestValue) {
        bestValue = val;
        bestCard = card;
        bestStat = stat;
      }
    });
  });

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
      // Pick card with highest value for the announced stat
      let bestCard = player.hand[0];
      let bestValue = (player.hand[0].stats[stat] || 0);
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

  if (!activeCard || !stat) {
    return { error: 'No active card or stat selected' };
  }

  // Build roundCards: { playerId: { card, statValue } }
  const roundCards = {};

  // Active player's card
  roundCards[activePlayer.id] = {
    card: activeCard,
    statValue: activeCard.stats[stat] || 0
  };

  // Opponent cards
  Object.entries(room.opponentSelections).forEach(([pid, { card }]) => {
    roundCards[pid] = {
      card,
      statValue: card.stats[stat] || 0
    };
  });

  // Find max value
  let maxValue = -Infinity;
  Object.values(roundCards).forEach(({ statValue }) => {
    if (statValue > maxValue) maxValue = statValue;
  });

  const winners = Object.entries(roundCards).filter(([, { statValue }]) => statValue === maxValue);
  const playedCards = Object.values(roundCards).map(({ card }) => card);
  const playedCardIds = new Set(playedCards.map(c => c.id));

  let winnerId = null;

  if (winners.length === 1) {
    winnerId = winners[0][0];
    const winner = room.players.find(p => p.id === winnerId);
    if (winner) {
      // Remove winner's played card from hand
      winner.hand = winner.hand.filter(c => !playedCardIds.has(c.id) || c.id !== roundCards[winnerId].card.id);
      // Add all played cards to winner's hand
      winner.hand.push(...playedCards);
      // Also collect neutral pile
      if (room.neutralPile.length > 0) {
        winner.hand.push(...room.neutralPile);
        room.neutralPile = [];
      }
      winner.score += 1;
    }

    // Remove played cards from other players
    Object.entries(roundCards).forEach(([pid, { card }]) => {
      if (pid !== winnerId) {
        const player = room.players.find(p => p.id === pid);
        if (player) {
          player.hand = player.hand.filter(c => c.id !== card.id);
        }
      }
    });
  } else {
    // Tie: all played cards go to neutral pile
    // Remove played cards from each player
    Object.entries(roundCards).forEach(([pid, { card }]) => {
      const player = room.players.find(p => p.id === pid);
      if (player) {
        player.hand = player.hand.filter(c => c.id !== card.id);
        room.neutralPile.push(card);
      }
    });
  }

  // Check eliminations
  room.players.forEach(player => {
    if (player.hand.length === 0) {
      player.isActive = false;
    }
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
      let maxCards = -1;
      room.players.forEach(player => {
        if (player.hand.length > maxCards) {
          maxCards = player.hand.length;
          overallWinner = player;
        }
      });
    }
    room.gamePhase = 'ended';
  } else {
    // Determine next active player
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

  let maxCards = -1;
  let winner = null;
  room.players.forEach(player => {
    if (player.hand.length > maxCards) {
      maxCards = player.hand.length;
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

  if (gameIsActive) {
    if (player.hand.length > 0) {
      room.neutralPile.push(...player.hand);
      player.hand = [];
    }
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
      // Adjust active player index if needed
      if (
        room.activePlayerIndex >= room.players.length ||
        !room.players[room.activePlayerIndex].isActive
      ) {
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
  if (player) {
    player.socketId = socketId;
  }
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
