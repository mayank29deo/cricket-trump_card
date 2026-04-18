import { create } from 'zustand'

const useHintQuizStore = create((set) => ({
  roomCode: null,
  roomData: null,
  myId: null,
  isSolo: false,

  currentClues: null,
  displayText: '',
  hintsRemaining: 2,
  typedAnswer: '',
  hasAnswered: false,
  answeredCount: 0,
  totalPlayers: 0,

  questionResult: null,
  timeLeft: 20,
  questionIndex: 0,
  questionTotal: 0,
  difficulty: null,
  answerLength: 0,

  leaderboard: null,
  phase: 'idle', // idle | waiting | question | reveal | ended

  setRoom: (code, data, myId) => set({ roomCode: code, roomData: data, myId, phase: data.phase === 'waiting' ? 'waiting' : 'question' }),
  updateRoom: (data) => set({ roomData: data }),
  setQuestion: (q) => set({
    currentClues: q.clues, displayText: q.display, questionResult: null,
    hasAnswered: false, typedAnswer: '', hintsRemaining: 2,
    timeLeft: q.timeLimit, questionIndex: q.index, questionTotal: q.total,
    difficulty: q.difficulty, answerLength: q.answerLength || 0, phase: 'question',
  }),
  setDisplayText: (t) => set({ displayText: t }),
  setHintsRemaining: (n) => set({ hintsRemaining: n }),
  setTypedAnswer: (t) => set({ typedAnswer: t }),
  setAnswered: () => set({ hasAnswered: true }),
  setAnswerUpdate: (c, t) => set({ answeredCount: c, totalPlayers: t }),
  setTimeLeft: (t) => set({ timeLeft: t }),
  setQuestionResult: (r) => set({ questionResult: r, phase: 'reveal' }),
  setLeaderboard: (lb) => set({ leaderboard: lb, phase: 'ended' }),
  setSolo: (v) => set({ isSolo: v }),

  resetHintQuiz: () => set({
    roomCode: null, roomData: null, myId: null, isSolo: false,
    currentClues: null, displayText: '', hintsRemaining: 2, typedAnswer: '',
    hasAnswered: false, answeredCount: 0, totalPlayers: 0,
    questionResult: null, timeLeft: 20, questionIndex: 0, questionTotal: 0,
    difficulty: null, answerLength: 0, leaderboard: null, phase: 'idle',
  }),
}))

export default useHintQuizStore
