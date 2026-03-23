import { create } from 'zustand'

const useGameStore = create((set, get) => ({
  roomCode: null,
  roomData: null,
  myHand: [],
  myId: null,
  gamePhase: 'waiting',       // 'waiting' | 'active_selecting' | 'opponents_selecting' | 'ended'
  currentCard: null,
  roundResult: null,
  scores: {},
  timeLeft: 0,
  isMyTurn: false,
  overallWinner: null,
  gameEndData: null,

  // New phase state
  currentPhase: null,         // full phase data from server
  phaseTimeLeft: 0,           // countdown for current phase
  mySelectedCard: null,       // card I've chosen this round
  hasSubmittedCard: false,    // whether I've submitted my card this round

  setRoom: (roomCode, roomData, myId) => {
    set({
      roomCode,
      roomData,
      myId,
      gamePhase: roomData?.gamePhase || 'waiting'
    })
  },

  updateGameState: (gameState) => {
    const myId = get().myId
    const isMyTurn = gameState.activePlayerId === myId
    set({
      roomData: gameState,
      gamePhase: gameState.gamePhase,
      isMyTurn,
      timeLeft: gameState.timeLeft !== undefined ? gameState.timeLeft : get().timeLeft
    })
  },

  setMyHand: (hand) => {
    set({
      myHand: hand,
      currentCard: hand.length > 0 ? hand[0] : null
    })
  },

  setRoundResult: (result) => {
    set({ roundResult: result })
  },

  clearRoundResult: () => {
    set({ roundResult: null })
  },

  setTimeLeft: (timeLeft) => {
    set({ timeLeft })
  },

  setGameEnd: (data) => {
    set({
      gamePhase: 'ended',
      overallWinner: data.overallWinner,
      gameEndData: data
    })
  },

  // Called when server emits phase_changed
  setPhase: (phaseData) => {
    set({
      currentPhase: phaseData,
      gamePhase: phaseData.phase,
      phaseTimeLeft: phaseData.phaseTimeLeft,
      // Reset per-round selections whenever the phase changes
      mySelectedCard: null,
      hasSubmittedCard: false
    })
  },

  setPhaseTimeLeft: (seconds) => {
    set({ phaseTimeLeft: seconds })
  },

  setMySelectedCard: (card) => {
    set({ mySelectedCard: card })
  },

  clearRoundSelections: () => {
    set({
      mySelectedCard: null,
      hasSubmittedCard: false
    })
  },

  markCardSubmitted: () => {
    set({ hasSubmittedCard: true })
  },

  resetGame: () => {
    set({
      roomCode: null,
      roomData: null,
      myHand: [],
      myId: null,
      gamePhase: 'waiting',
      currentCard: null,
      roundResult: null,
      scores: {},
      timeLeft: 0,
      isMyTurn: false,
      overallWinner: null,
      gameEndData: null,
      currentPhase: null,
      phaseTimeLeft: 0,
      mySelectedCard: null,
      hasSubmittedCard: false
    })
  }
}))

export default useGameStore
