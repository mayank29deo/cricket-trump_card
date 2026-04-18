import { create } from 'zustand'

const useQuizStore = create((set) => ({
  // Room state
  roomCode: null,
  roomData: null,
  myId: null,
  isSolo: false,

  // Game state
  currentQuestion: null,
  questionResult: null,
  timeLeft: 15,
  answeredCount: 0,
  totalPlayers: 0,
  hasAnswered: false,
  selectedAnswer: null,

  // Final
  leaderboard: null,
  phase: 'idle', // idle | waiting | question | reveal | ended

  // Actions
  setRoom: (code, data, myId) => set({ roomCode: code, roomData: data, myId, phase: data.phase === 'waiting' ? 'waiting' : 'question' }),
  updateRoom: (data) => set({ roomData: data }),
  setQuestion: (q) => set({ currentQuestion: q, questionResult: null, hasAnswered: false, selectedAnswer: null, timeLeft: q.timeLimit, phase: 'question' }),
  setTimeLeft: (t) => set({ timeLeft: t }),
  setAnswered: (idx) => set({ hasAnswered: true, selectedAnswer: idx }),
  setAnswerUpdate: (count, total) => set({ answeredCount: count, totalPlayers: total }),
  setQuestionResult: (result) => set({ questionResult: result, phase: 'reveal' }),
  setLeaderboard: (lb) => set({ leaderboard: lb, phase: 'ended' }),
  setSolo: (v) => set({ isSolo: v }),

  resetQuiz: () => set({
    roomCode: null, roomData: null, myId: null, isSolo: false,
    currentQuestion: null, questionResult: null, timeLeft: 15,
    answeredCount: 0, totalPlayers: 0, hasAnswered: false, selectedAnswer: null,
    leaderboard: null, phase: 'idle',
  }),
}))

export default useQuizStore
