const { v4: uuidv4 } = require('uuid');
const { hintQuestions, HINT_QUIZ_CATEGORIES } = require('./data/hintQuizQuestions');

const hintRooms = new Map();

function generateCode() {
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

function pickQuestions(categories, count = 10) {
  let pool = hintQuestions.filter(q => categories.includes(q.category));
  if (pool.length === 0) pool = [...hintQuestions];
  return shuffle(pool).slice(0, Math.min(count, pool.length));
}

/**
 * Generate a letter mask for the answer.
 * Shows ~30% of letters initially. Prepares 2 hint sets of 2-3 letters each.
 * Spaces are always visible.
 */
function generateLetterMask(answer) {
  const upper = answer.toUpperCase();
  const letterPositions = []; // indices of actual letters (not spaces)
  for (let i = 0; i < upper.length; i++) {
    if (upper[i] !== ' ') letterPositions.push(i);
  }

  const shuffledPositions = shuffle(letterPositions);
  const initialCount = Math.max(2, Math.floor(letterPositions.length * 0.3));
  const hint1Count = Math.min(3, Math.floor((letterPositions.length - initialCount) / 2));
  const hint2Count = Math.min(3, letterPositions.length - initialCount - hint1Count);

  const initialRevealed = shuffledPositions.slice(0, initialCount);
  const hint1Positions = shuffledPositions.slice(initialCount, initialCount + hint1Count);
  const hint2Positions = shuffledPositions.slice(initialCount + hint1Count, initialCount + hint1Count + hint2Count);

  // Build initial display
  let display = '';
  for (let i = 0; i < upper.length; i++) {
    if (upper[i] === ' ') { display += '  '; }
    else if (initialRevealed.includes(i)) { display += upper[i]; }
    else { display += '_'; }
  }

  return {
    answer: upper,
    display,
    initialRevealed,
    hintSets: [hint1Positions, hint2Positions],
  };
}

/** Apply hint to display string, revealing positions */
function applyHint(display, answer, positions) {
  const chars = display.split('');
  positions.forEach(pos => {
    if (pos < answer.length) chars[pos] = answer[pos];
  });
  return chars.join('');
}

function createHintRoom(hostPlayer, categories, questionCount = 10) {
  let code;
  do { code = generateCode(); } while (hintRooms.has(code));

  const selected = pickQuestions(categories, questionCount);
  const room = {
    code,
    host: hostPlayer.id,
    players: [{
      id: hostPlayer.id, name: hostPlayer.name, socketId: hostPlayer.socketId,
      score: 0, answers: [],
    }],
    categories,
    questions: selected,
    questionCount: selected.length,
    currentQuestion: -1,
    phase: 'waiting',
    questionStartTime: null,
    questionTimeLimit: 20,
    currentAnswers: {},
    currentHints: {}, // playerId -> { count, display }
    letterMask: null,
    isSolo: false,
    gameMode: 'hint_quiz',
  };

  hintRooms.set(code, room);
  return room;
}

function createSoloHintQuiz(player, categories, questionCount = 10) {
  const room = createHintRoom(player, categories, questionCount);
  room.isSolo = true;
  return room;
}

function joinHintRoom(roomCode, player) {
  const room = hintRooms.get(roomCode);
  if (!room) return { error: 'Room not found' };
  const existing = room.players.find(p => p.id === player.id);
  if (existing) { existing.socketId = player.socketId; return { room, rejoining: true }; }
  if (room.phase !== 'waiting') return { error: 'Quiz already in progress' };
  if (room.players.length >= 6) return { error: 'Room is full (max 6)' };
  room.players.push({ id: player.id, name: player.name, socketId: player.socketId, score: 0, answers: [] });
  return { room };
}

function startHintQuiz(roomCode) {
  const room = hintRooms.get(roomCode);
  if (!room) return { error: 'Room not found' };
  if (room.phase !== 'waiting') return { error: 'Already started' };

  room.currentQuestion = 0;
  room.currentAnswers = {};
  room.currentHints = {};
  room.questionStartTime = Date.now();
  room.phase = 'question';

  const q = room.questions[0];
  room.letterMask = generateLetterMask(q.answer);

  // Init hints for all players
  room.players.forEach(p => {
    room.currentHints[p.id] = { count: 0, display: room.letterMask.display };
  });

  return { room, question: getHintQuestionPublic(room) };
}

function getHintQuestionPublic(room) {
  const q = room.questions[room.currentQuestion];
  if (!q) return null;
  return {
    index: room.currentQuestion,
    total: room.questionCount,
    clues: q.clues,
    display: room.letterMask.display, // base display (player-specific overrides sent separately)
    difficulty: q.difficulty,
    timeLimit: room.questionTimeLimit,
    answerLength: q.answer.length,
  };
}

function useHint(roomCode, playerId) {
  const room = hintRooms.get(roomCode);
  if (!room || room.phase !== 'question') return { error: 'Not in question phase' };
  if (room.currentAnswers[playerId]) return { error: 'Already answered' };

  const hint = room.currentHints[playerId];
  if (!hint) return { error: 'Player not found' };
  if (hint.count >= 2) return { error: 'No hints remaining' };

  const hintSet = room.letterMask.hintSets[hint.count];
  hint.count += 1;
  hint.display = applyHint(hint.display, room.letterMask.answer, hintSet);

  return { newDisplay: hint.display, hintsRemaining: 2 - hint.count };
}

function normalizeAnswer(str) {
  return str.toUpperCase().trim().replace(/\s+/g, ' ');
}

function submitHintAnswer(roomCode, playerId, answerText) {
  const room = hintRooms.get(roomCode);
  if (!room || room.phase !== 'question') return { error: 'Not in question phase' };
  if (room.currentAnswers[playerId]) return { error: 'Already answered' };

  const player = room.players.find(p => p.id === playerId);
  if (!player) return { error: 'Player not found' };

  const normalized = normalizeAnswer(answerText);
  const q = room.questions[room.currentQuestion];
  const correct = q.acceptedAnswers.some(a => normalizeAnswer(a) === normalized);

  const elapsed = (Date.now() - room.questionStartTime) / 1000;
  const hintsUsed = room.currentHints[playerId]?.count || 0;

  room.currentAnswers[playerId] = { answer: normalized, correct, elapsed, hintsUsed };

  const allAnswered = room.players.every(p => room.currentAnswers[p.id]);
  return { room, allAnswered, answeredCount: Object.keys(room.currentAnswers).length };
}

function resolveHintQuestion(roomCode) {
  const room = hintRooms.get(roomCode);
  if (!room) return { error: 'Room not found' };

  const q = room.questions[room.currentQuestion];
  const pointsAwarded = {};

  // Group correct answers by hints used, sort by speed within each group
  const correctPlayers = [];
  room.players.forEach(p => {
    const sub = room.currentAnswers[p.id];
    if (sub?.correct) {
      correctPlayers.push({ id: p.id, elapsed: sub.elapsed, hintsUsed: sub.hintsUsed });
    }
  });

  // Sort: fewer hints first, then faster
  correctPlayers.sort((a, b) => a.hintsUsed - b.hintsUsed || a.elapsed - b.elapsed);

  // Points: 10 base, -2 per hint used. Speed bonus: +2 for fastest in each hint-group
  correctPlayers.forEach((cp, rank) => {
    const base = Math.max(4, 10 - cp.hintsUsed * 2);
    const isFirstInGroup = rank === 0 || correctPlayers[rank - 1].hintsUsed !== cp.hintsUsed;
    const speedBonus = isFirstInGroup ? 2 : 0;
    const pts = base + speedBonus;

    const player = room.players.find(p => p.id === cp.id);
    if (player) {
      player.score += pts;
      player.answers.push({ questionIndex: room.currentQuestion, correct: true, points: pts, hintsUsed: cp.hintsUsed });
    }
    pointsAwarded[cp.id] = pts;
  });

  // Wrong / no answer
  room.players.forEach(p => {
    if (!pointsAwarded[p.id]) {
      p.answers.push({ questionIndex: room.currentQuestion, correct: false, points: 0, hintsUsed: room.currentHints[p.id]?.count || 0 });
      pointsAwarded[p.id] = 0;
    }
  });

  room.phase = 'reveal';

  return {
    room,
    result: {
      questionIndex: room.currentQuestion,
      correctAnswer: q.answer,
      pointsAwarded,
      leaderboard: room.players.map(p => ({ id: p.id, name: p.name, score: p.score })).sort((a, b) => b.score - a.score),
      playerAnswers: Object.fromEntries(room.players.map(p => {
        const sub = room.currentAnswers[p.id];
        return [p.id, { answer: sub?.answer || null, correct: sub?.correct || false, hintsUsed: room.currentHints[p.id]?.count || 0 }];
      })),
    },
  };
}

function nextHintQuestion(roomCode) {
  const room = hintRooms.get(roomCode);
  if (!room) return { error: 'Room not found' };

  room.currentQuestion += 1;
  room.currentAnswers = {};
  room.currentHints = {};

  if (room.currentQuestion >= room.questionCount) {
    room.phase = 'ended';
    return {
      room, ended: true,
      finalLeaderboard: room.players.map(p => ({ id: p.id, name: p.name, score: p.score, answers: p.answers })).sort((a, b) => b.score - a.score),
    };
  }

  const q = room.questions[room.currentQuestion];
  room.letterMask = generateLetterMask(q.answer);
  room.players.forEach(p => {
    room.currentHints[p.id] = { count: 0, display: room.letterMask.display };
  });
  room.phase = 'question';
  room.questionStartTime = Date.now();

  return { room, ended: false, question: getHintQuestionPublic(room) };
}

function getHintRoom(roomCode) { return hintRooms.get(roomCode) || null; }

function leaveHintRoom(roomCode, playerId) {
  const room = hintRooms.get(roomCode);
  if (!room) return null;
  room.players = room.players.filter(p => p.id !== playerId);
  if (room.players.length === 0) { hintRooms.delete(roomCode); return { deleted: true }; }
  if (room.host === playerId) room.host = room.players[0].id;
  return { room };
}

module.exports = {
  createHintRoom, createSoloHintQuiz, joinHintRoom, startHintQuiz,
  useHint, submitHintAnswer, resolveHintQuestion, nextHintQuestion,
  getHintRoom, leaveHintRoom, getHintQuestionPublic,
  HINT_QUIZ_CATEGORIES,
};
