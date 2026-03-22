const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const gameManager = require('./gameManager');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  }
});

app.use(cors({ origin: '*' }));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const roomTimers = new Map();

function startRoomTimer(roomCode, io) {
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

    if (timeLeft <= 0) {
      clearInterval(interval);
      roomTimers.delete(roomCode);
      const result = gameManager.handleTimerExpiry(roomCode);
      if (result) {
        io.to(roomCode).emit('game_ended', {
          reason: 'timer',
          overallWinner: result.overallWinner,
          players: result.room.players.map(p => ({
            id: p.id,
            name: p.name,
            score: p.score,
            cardCount: p.hand.length
          }))
        });
      }
    }
  }, 1000);

  roomTimers.set(roomCode, interval);
}

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('create_room', ({ player, timeOption }) => {
    try {
      const playerWithSocket = { ...player, socketId: socket.id };
      const room = gameManager.createRoom(playerWithSocket, timeOption);
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

      updatedRoom.players.forEach(player => {
        const playerSocket = io.sockets.sockets.get(player.socketId);
        if (playerSocket) {
          playerSocket.emit('game_started', {
            myHand: player.hand,
            myId: player.id,
            gameState: {
              code: updatedRoom.code,
              host: updatedRoom.host,
              players: updatedRoom.players.map(p => ({
                id: p.id,
                name: p.name,
                avatar: p.avatar,
                score: p.score,
                cardCount: p.hand.length,
                isActive: p.isActive
              })),
              timeOption: updatedRoom.timeOption,
              gamePhase: updatedRoom.gamePhase,
              currentRound: updatedRoom.currentRound,
              activePlayerId: updatedRoom.players[updatedRoom.activePlayerIndex]?.id,
              timeLeft: updatedRoom.timeLeft
            }
          });
        }
      });

      startRoomTimer(roomCode, io);
      console.log(`Game started in room ${roomCode}`);
    } catch (err) {
      socket.emit('error', { message: err.message });
    }
  });

  socket.on('select_stat', ({ roomCode, playerId, stat }) => {
    try {
      const result = gameManager.selectStat(roomCode, playerId, stat);

      if (result.error) {
        socket.emit('error', { message: result.error });
        return;
      }

      const { room, roundResult, gameEnded, overallWinner } = result;

      const roundResultPublic = {
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

      const gameStatePublic = {
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
        gamePhase: room.gamePhase,
        currentRound: room.currentRound,
        activePlayerId: room.players[room.activePlayerIndex]?.id,
        neutralPileCount: room.neutralPile.length
      };

      io.to(roomCode).emit('round_result', {
        roundResult: roundResultPublic,
        gameState: gameStatePublic
      });

      if (gameEnded) {
        if (roomTimers.has(roomCode)) {
          clearInterval(roomTimers.get(roomCode));
          roomTimers.delete(roomCode);
        }
        setTimeout(() => {
          io.to(roomCode).emit('game_ended', {
            reason: 'cards_exhausted',
            overallWinner,
            players: room.players.map(p => ({
              id: p.id,
              name: p.name,
              score: p.score,
              cardCount: p.hand.length
            }))
          });
        }, 3000);
      } else {
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
        }, 2500);
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

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Cricket Trump Card server running on port ${PORT}`);
});
