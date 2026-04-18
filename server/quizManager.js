const { v4: uuidv4 } = require('uuid');
const { questions, QUIZ_CATEGORIES } = require('./data/quizQuestions');

const quizRooms = new Map();

function generateQuizCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
  return code;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Pick questions for a quiz session.
 * categories: array of category keys e.g. ['international_general', 'ipl_csk']
 * count: number of questions to pick (default 10)
 */
function pickQuestions(categories, count = 10) {
  let pool = questions.filter(q => categories.includes(q.category));
  if (pool.length === 0) pool = [...questions]; // fallback
  const shuffled = shuffle(pool);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// ─── Points by player count (fastest correct answer gets highest) ──────────
const POINTS_BY_COUNT = {
  1: [10],
  2: [10, 0],
  3: [10, 8, 6],
  4: [10, 8, 6, 4],
  5: [10, 8, 6, 4, 2],
  6: [10, 8, 6, 4, 2, 0],
};

function createQuizRoom(hostPlayer, categories, questionCount = 10) {
  let code;
  do { code = generateQuizCode(); } while (quizRooms.has(code));

  const selected = pickQuestions(categories, questionCount);

  const room = {
    code,
    host: hostPlayer.id,
    players: [{
      id: hostPlayer.id,
      name: hostPlayer.name,
      socketId: hostPlayer.socketId,
      score: 0,
      answers: [], // { questionIndex, answeredAt, correct, points }
    }],
    categories,
    questions: selected,
    questionCount: selected.length,
    currentQuestion: -1, // not started
    phase: 'waiting', // waiting | question | reveal | ended
    questionStartTime: null,
    questionTimeLimit: 15, // seconds per question
    currentAnswers: {}, // playerId -> { answer, answeredAt }
    isSolo: false,
  };

  quizRooms.set(code, room);
  return room;
}

function createSoloQuiz(player, categories, questionCount = 10) {
  const room = createQuizRoom(player, categories, questionCount);
  room.isSolo = true;
  return room;
}

function joinQuizRoom(roomCode, player) {
  const room = quizRooms.get(roomCode);
  if (!room) return { error: 'Quiz room not found' };

  const existing = room.players.find(p => p.id === player.id);
  if (existing) {
    existing.socketId = player.socketId;
    return { room, rejoining: true };
  }

  if (room.phase !== 'waiting') return { error: 'Quiz already in progress' };
  if (room.players.length >= 6) return { error: 'Room is full (max 6)' };

  room.players.push({
    id: player.id,
    name: player.name,
    socketId: player.socketId,
    score: 0,
    answers: [],
  });

  return { room };
}

function startQuiz(roomCode) {
  const room = quizRooms.get(roomCode);
  if (!room) return { error: 'Room not found' };
  if (room.phase !== 'waiting') return { error: 'Quiz already started' };
  if (room.players.length < 1) return { error: 'No players' };

  room.phase = 'question';
  room.currentQuestion = 0;
  room.currentAnswers = {};
  room.questionStartTime = Date.now();

  return { room, question: getQuestionPublic(room) };
}

function getQuestionPublic(room) {
  const q = room.questions[room.currentQuestion];
  if (!q) return null;
  return {
    index: room.currentQuestion,
    total: room.questionCount,
    question: q.question,
    options: q.options,
    category: q.category,
    difficulty: q.difficulty,
    timeLimit: room.questionTimeLimit,
  };
}

function submitAnswer(roomCode, playerId, answerIndex) {
  const room = quizRooms.get(roomCode);
  if (!room) return { error: 'Room not found' };
  if (room.phase !== 'question') return { error: 'Not in question phase' };

  const player = room.players.find(p => p.id === playerId);
  if (!player) return { error: 'Player not found' };

  if (room.currentAnswers[playerId]) return { error: 'Already answered' };

  const answeredAt = Date.now();
  const elapsed = (answeredAt - room.questionStartTime) / 1000;

  // Reject if over time limit
  if (elapsed > room.questionTimeLimit + 1) return { error: 'Time expired' };

  room.currentAnswers[playerId] = { answer: answerIndex, answeredAt, elapsed };

  const allAnswered = room.players.every(p => room.currentAnswers[p.id]);

  return { room, allAnswered, answeredCount: Object.keys(room.currentAnswers).length };
}

function resolveQuestion(roomCode) {
  const room = quizRooms.get(roomCode);
  if (!room) return { error: 'Room not found' };

  const q = room.questions[room.currentQuestion];
  const correctAnswer = q.answer;

  // Rank players who answered correctly by speed
  const correctPlayers = [];
  const wrongPlayers = [];

  room.players.forEach(player => {
    const submission = room.currentAnswers[player.id];
    if (submission && submission.answer === correctAnswer) {
      correctPlayers.push({ id: player.id, elapsed: submission.elapsed });
    } else {
      wrongPlayers.push({ id: player.id });
    }
  });

  // Sort correct players by speed (fastest first)
  correctPlayers.sort((a, b) => a.elapsed - b.elapsed);

  const pointsTable = POINTS_BY_COUNT[room.players.length] || [10, 8, 6, 4, 2, 0];
  const pointsAwarded = {};

  correctPlayers.forEach((cp, rank) => {
    const pts = pointsTable[rank] ?? 0;
    const player = room.players.find(p => p.id === cp.id);
    if (player) {
      player.score += pts;
      player.answers.push({
        questionIndex: room.currentQuestion,
        correct: true,
        points: pts,
        elapsed: cp.elapsed,
      });
    }
    pointsAwarded[cp.id] = pts;
  });

  wrongPlayers.forEach(wp => {
    const player = room.players.find(p => p.id === wp.id);
    if (player) {
      player.answers.push({
        questionIndex: room.currentQuestion,
        correct: false,
        points: 0,
        elapsed: null,
      });
    }
    pointsAwarded[wp.id] = 0;
  });

  room.phase = 'reveal';

  // Build result
  const result = {
    questionIndex: room.currentQuestion,
    correctAnswer,
    correctOption: q.options[correctAnswer],
    pointsAwarded,
    leaderboard: room.players
      .map(p => ({ id: p.id, name: p.name, score: p.score }))
      .sort((a, b) => b.score - a.score),
    playerAnswers: {},
  };

  // Include each player's answer for reveal
  room.players.forEach(p => {
    const sub = room.currentAnswers[p.id];
    result.playerAnswers[p.id] = {
      answer: sub ? sub.answer : null,
      correct: sub ? sub.answer === correctAnswer : false,
      elapsed: sub ? sub.elapsed : null,
    };
  });

  return { room, result };
}

function nextQuestion(roomCode) {
  const room = quizRooms.get(roomCode);
  if (!room) return { error: 'Room not found' };

  room.currentQuestion += 1;
  room.currentAnswers = {};

  if (room.currentQuestion >= room.questionCount) {
    room.phase = 'ended';
    const finalLeaderboard = room.players
      .map(p => ({ id: p.id, name: p.name, score: p.score, answers: p.answers }))
      .sort((a, b) => b.score - a.score);

    return { room, ended: true, finalLeaderboard };
  }

  room.phase = 'question';
  room.questionStartTime = Date.now();

  return { room, ended: false, question: getQuestionPublic(room) };
}

function getQuizRoom(roomCode) {
  return quizRooms.get(roomCode) || null;
}

function leaveQuizRoom(roomCode, playerId) {
  const room = quizRooms.get(roomCode);
  if (!room) return null;

  room.players = room.players.filter(p => p.id !== playerId);
  if (room.players.length === 0) {
    quizRooms.delete(roomCode);
    return { deleted: true };
  }
  if (room.host === playerId) room.host = room.players[0].id;
  return { room };
}

module.exports = {
  createQuizRoom,
  createSoloQuiz,
  joinQuizRoom,
  startQuiz,
  submitAnswer,
  resolveQuestion,
  nextQuestion,
  getQuizRoom,
  leaveQuizRoom,
  getQuestionPublic,
  QUIZ_CATEGORIES,
};
