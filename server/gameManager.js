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
  const remainder = 52 % playerCount;

  room.players.forEach((player, index) => {
    player.hand = shuffled.slice(index * cardsPerPlayer, (index + 1) * cardsPerPlayer);
    player.score = 0;
    player.isActive = true;
  });

  room.neutralPile = shuffled.slice(playerCount * cardsPerPlayer);
  room.activePlayerIndex = 0;
  room.gamePhase = 'playing';
  room.currentRound = 0;
  room.roundCards = {};
  room.timeLeft = room.timeOption * 60;

  return { room };
}

function selectStat(roomCode, playerId, stat) {
  const room = rooms.get(roomCode);
  if (!room) {
    return { error: 'Room not found' };
  }
  if (room.gamePhase !== 'playing') {
    return { error: 'Game not in playing phase' };
  }

  const activePlayer = room.players[room.activePlayerIndex];
  if (!activePlayer || activePlayer.id !== playerId) {
    return { error: 'Not your turn' };
  }

  const validStats = ['batting_avg', 'strike_rate', 'centuries', 'total_runs', 'wickets', 'catches'];
  if (!validStats.includes(stat)) {
    return { error: 'Invalid stat' };
  }

  const activePlayers = room.players.filter(p => p.isActive && p.hand.length > 0);

  const roundCards = {};
  activePlayers.forEach(player => {
    if (player.hand.length > 0) {
      roundCards[player.id] = {
        card: player.hand[0],
        statValue: player.hand[0].stats[stat]
      };
    }
  });

  let maxValue = -Infinity;
  Object.values(roundCards).forEach(({ statValue }) => {
    if (statValue > maxValue) maxValue = statValue;
  });

  const winners = Object.entries(roundCards).filter(([, { statValue }]) => statValue === maxValue);

  let winnerId = null;
  const playedCards = Object.values(roundCards).map(({ card }) => card);

  if (winners.length === 1) {
    winnerId = winners[0][0];
    const winner = room.players.find(p => p.id === winnerId);
    if (winner) {
      winner.hand.shift();
      winner.hand.push(...playedCards);
      if (room.neutralPile.length > 0) {
        winner.hand.push(...room.neutralPile);
        room.neutralPile = [];
      }
      winner.score += 1;
    }
    activePlayers.forEach(player => {
      if (player.id !== winnerId && player.hand.length > 0) {
        player.hand.shift();
      }
    });
  } else {
    activePlayers.forEach(player => {
      if (player.hand.length > 0) {
        room.neutralPile.push(player.hand.shift());
      }
    });
  }

  activePlayers.forEach(player => {
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
  }

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
    overallWinner: overallWinner ? { id: overallWinner.id, name: overallWinner.name, score: overallWinner.score } : null
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

  if (room.gamePhase === 'playing') {
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

  if (room.gamePhase === 'playing') {
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
  if (player) {
    player.socketId = socketId;
  }
  return room;
}

module.exports = {
  createRoom,
  joinRoom,
  startGame,
  selectStat,
  handleTimerExpiry,
  leaveRoom,
  getRoom,
  updatePlayerSocket
};
