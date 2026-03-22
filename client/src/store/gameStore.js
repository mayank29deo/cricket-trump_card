import { create } from 'zustand'

const useGameStore = create((set, get) => ({
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
      gameEndData: null
    })
  }
}))

export default useGameStore
