import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CricketCard from '../components/game/CricketCard'
import GameTimer from '../components/game/GameTimer'
import Button from '../components/ui/Button'
import useAuthStore from '../store/authStore'
import useGameStore from '../store/gameStore'
import { connectSocket, getSocket } from '../lib/socket'

const STAT_LABELS = {
  batting_avg: 'Bat Avg',
  strike_rate: 'Strike Rate',
  centuries: 'Centuries',
  total_runs: 'Total Runs',
  wickets: 'Wickets',
  catches: 'Catches'
}

const STAT_ICONS = {
  batting_avg: '🏏',
  strike_rate: '⚡',
  centuries: '💯',
  total_runs: '📊',
  wickets: '🎯',
  catches: '🤲'
}

function getAvatarColor(name) {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const colors = ['#1e40af', '#7c3aed', '#b45309', '#065f46', '#9f1239', '#1e3a5f']
  return colors[Math.abs(hash) % colors.length]
}

function PlayerAvatar({ name, size = 9 }) {
  const initials = name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?'
  const color = getAvatarColor(name || '')
  return (
    <div
      className={`w-${size} h-${size} rounded-full flex items-center justify-center font-bold text-white text-xs flex-shrink-0`}
      style={{ backgroundColor: color, minWidth: size * 4, minHeight: size * 4 }}
    >
      {initials}
    </div>
  )
}

function ConfettiPiece({ color, left, delay, duration }) {
  return (
    <div
      className="confetti-piece"
      style={{
        left: `${left}%`,
        top: '-10px',
        backgroundColor: color,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        width: Math.random() * 12 + 6,
        height: Math.random() * 12 + 6,
        borderRadius: Math.random() > 0.5 ? '50%' : '2px'
      }}
    />
  )
}

function ConfettiEffect() {
  const pieces = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    color: ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444', '#fbbf24'][Math.floor(Math.random() * 6)],
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: Math.random() * 2 + 2
  }))

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map(p => <ConfettiPiece key={p.id} {...p} />)}
    </div>
  )
}

export default function Game() {
  const navigate = useNavigate()
  const { roomCode } = useParams()
  const { user } = useAuthStore()
  const {
    roomData, myHand, myId, gamePhase, isMyTurn, timeLeft,
    overallWinner, gameEndData, roundResult,
    setRoom, updateGameState, setMyHand, setRoundResult, setTimeLeft, setGameEnd, resetGame
  } = useGameStore()

  const [selectedStat, setSelectedStat] = useState(null)
  const [showRoundResult, setShowRoundResult] = useState(false)
  const [roundResultData, setRoundResultData] = useState(null)
  const [isFlipping, setIsFlipping] = useState(false)
  const [joinPrompt, setJoinPrompt] = useState(false)
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState('')
  const socketRef = useRef(null)

  const currentCard = myHand?.[0] || null
  const totalTime = roomData?.timeOption ? roomData.timeOption * 60 : 360

  useEffect(() => {
    if (!user) {
      navigate('/auth')
      return
    }

    const socket = connectSocket()
    socketRef.current = socket

    socket.on('connect', () => {
      setConnected(true)
      if (!roomData || roomData?.code !== roomCode) {
        setJoinPrompt(true)
        socket.emit('join_room', {
          roomCode,
          player: { id: user.id, name: user.name }
        })
      }
    })

    socket.on('room_joined', ({ room, myId: id }) => {
      setRoom(room.code, room, id)
      setJoinPrompt(false)
      if (room.gamePhase === 'playing') {
        // rejoining mid game, we need hands from server
      }
    })

    socket.on('room_updated', ({ room }) => {
      updateGameState(room)
    })

    socket.on('game_started', ({ myHand: hand, myId: id, gameState }) => {
      setRoom(gameState.code, gameState, id)
      setMyHand(hand)
      updateGameState(gameState)
      setJoinPrompt(false)
    })

    socket.on('round_result', ({ roundResult: result, gameState }) => {
      setIsFlipping(true)
      setTimeout(() => setIsFlipping(false), 600)

      setRoundResultData(result)
      setShowRoundResult(true)
      setRoundResult(result)

      setTimeout(() => {
        setShowRoundResult(false)
        setRoundResultData(null)
        setSelectedStat(null)
      }, 2500)
    })

    socket.on('game_state_update', ({ gameState, myHand: hand }) => {
      updateGameState(gameState)
      if (hand) {
        setMyHand(hand)
      }
    })

    socket.on('timer_tick', ({ timeLeft: tl }) => {
      setTimeLeft(tl)
    })

    socket.on('game_ended', (data) => {
      setGameEnd(data)
    })

    socket.on('error', ({ message }) => {
      setError(message)
    })

    if (socket.connected) {
      setConnected(true)
      if (!roomData || roomData?.code !== roomCode) {
        socket.emit('join_room', {
          roomCode,
          player: { id: user.id, name: user.name }
        })
      }
    }

    return () => {
      socket.off('connect')
      socket.off('room_joined')
      socket.off('room_updated')
      socket.off('game_started')
      socket.off('round_result')
      socket.off('game_state_update')
      socket.off('timer_tick')
      socket.off('game_ended')
      socket.off('error')
    }
  }, [roomCode, user])

  const handleSelectStat = useCallback((stat) => {
    if (!isMyTurn || selectedStat) return
    setSelectedStat(stat)
    const socket = getSocket()
    socket.emit('select_stat', {
      roomCode,
      playerId: myId,
      stat
    })
  }, [isMyTurn, selectedStat, roomCode, myId])

  const handleLeaveGame = () => {
    const socket = getSocket()
    socket.emit('leave_room', { roomCode, playerId: myId })
    resetGame()
    navigate('/lobby')
  }

  const handlePlayAgain = () => {
    resetGame()
    navigate('/lobby')
  }

  // Game ended screen
  if (gamePhase === 'ended' && gameEndData) {
    const players = gameEndData.players || []
    const winner = gameEndData.overallWinner
    const isWinner = winner?.id === myId
    const sortedPlayers = [...players].sort((a, b) => (b.score || 0) - (a.score || 0))

    return (
      <div className="min-h-screen stadium-bg flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
        {isWinner && <ConfettiEffect />}

        <div className="w-full max-w-md text-center animate-bounce-in">
          {/* Result header */}
          <div className={`text-6xl mb-4 ${isWinner ? 'animate-bounce' : ''}`}>
            {isWinner ? '🏆' : '🏏'}
          </div>
          <h1 className="font-rajdhani font-bold text-4xl mb-2">
            {isWinner ? (
              <span className="gradient-text">YOU WIN!</span>
            ) : (
              <span className="text-white">GAME OVER</span>
            )}
          </h1>
          {winner && (
            <p className="text-slate-400 text-lg mb-6">
              {isWinner ? 'Congratulations!' : `${winner.name} wins the match!`}
            </p>
          )}

          {/* Winner podium */}
          {winner && (
            <div className="glass-card rounded-2xl p-5 mb-6 border border-amber-500/30">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl text-white"
                  style={{ backgroundColor: getAvatarColor(winner.name) }}
                >
                  {winner.name?.[0]?.toUpperCase()}
                </div>
                <div className="text-left">
                  <div className="text-amber-400 font-rajdhani font-bold text-xl">{winner.name}</div>
                  <div className="text-slate-400 text-sm">🏆 Champion</div>
                </div>
              </div>
            </div>
          )}

          {/* All players scores */}
          <div className="glass-card rounded-2xl p-5 mb-6">
            <h3 className="font-rajdhani font-semibold text-white mb-4 text-left">Final Standings</h3>
            <div className="space-y-2">
              {sortedPlayers.map((player, index) => (
                <div key={player.id} className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    index === 0 ? 'bg-amber-500 text-black' :
                    index === 1 ? 'bg-slate-400 text-black' :
                    index === 2 ? 'bg-amber-800 text-white' : 'bg-pitch-700 text-slate-400'
                  }`}>
                    {index + 1}
                  </div>
                  <PlayerAvatar name={player.name} size={8} />
                  <div className="flex-1 text-left">
                    <div className="text-white text-sm font-medium">{player.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-emerald-400 font-rajdhani font-bold">{player.score || 0}</div>
                    <div className="text-slate-500 text-xs">rounds won</div>
                  </div>
                  <div className="text-right">
                    <div className="text-slate-300 font-rajdhani font-bold">{player.cardCount || 0}</div>
                    <div className="text-slate-500 text-xs">cards</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="primary" fullWidth size="lg" onClick={handlePlayAgain} className="neon-border">
              <span className="flex items-center justify-center gap-2">
                <span>🔄</span>
                Play Again
              </span>
            </Button>
            <Button variant="ghost" fullWidth size="lg" onClick={() => navigate('/')}>
              Home
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const activePlayerId = roomData?.activePlayerId
  const isActivePlayer = activePlayerId === myId
  const opponents = roomData?.players?.filter(p => p.id !== myId && p.isActive) || []
  const myPlayerData = roomData?.players?.find(p => p.id === myId)

  return (
    <div className="min-h-screen stadium-bg flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 bg-pitch-800/60 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={handleLeaveGame}
            className="text-slate-400 hover:text-red-400 text-xs transition-colors p-1"
            title="Leave game"
          >
            ✕
          </button>
          <div className="glass-card rounded-lg px-2 py-1">
            <span className="font-rajdhani font-bold text-amber-400 text-sm tracking-widest">{roomCode}</span>
          </div>
        </div>

        {/* Timer */}
        <GameTimer totalTime={totalTime} timeLeft={timeLeft} />

        {/* Scores */}
        <div className="flex items-center gap-1">
          {roomData?.players?.slice(0, 4).map(p => (
            <div key={p.id} className="text-center">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: getAvatarColor(p.name), opacity: p.isActive ? 1 : 0.4 }}
              >
                {p.name?.[0]?.toUpperCase()}
              </div>
              <div className="text-xs text-emerald-400 font-bold">{p.score || 0}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main game area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Opponents area */}
        <div className="px-3 pt-3 pb-2">
          <div className="flex items-start gap-3 justify-center flex-wrap">
            {opponents.length === 0 && gamePhase === 'waiting' && (
              <div className="text-slate-500 text-sm py-4">Waiting for game to start...</div>
            )}
            {opponents.map(opponent => (
              <div key={opponent.id} className="flex flex-col items-center gap-1.5">
                {/* Opponent card stack */}
                <div className="relative">
                  {opponent.cardCount > 2 && (
                    <div style={{ position: 'absolute', top: -4, left: -4, zIndex: 0 }}>
                      <CricketCard isBack compact />
                    </div>
                  )}
                  {opponent.cardCount > 1 && (
                    <div style={{ position: 'absolute', top: -2, left: -2, zIndex: 1 }}>
                      <CricketCard isBack compact />
                    </div>
                  )}
                  <div style={{ position: 'relative', zIndex: 2 }}>
                    <CricketCard isBack compact />
                  </div>
                </div>
                {/* Opponent info */}
                <div className="flex items-center gap-1">
                  <PlayerAvatar name={opponent.name} size={5} />
                  <div className="text-xs text-slate-300 max-w-[60px] truncate">{opponent.name}</div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-slate-400">{opponent.cardCount} 🃏</span>
                  {opponent.id === activePlayerId && (
                    <span className="text-xs text-amber-400 font-bold animate-pulse">TURN</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Round result overlay */}
        {showRoundResult && roundResultData && (
          <div className="mx-3 mb-2 glass-card rounded-xl p-3 border border-emerald-500/30 animate-bounce-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">{STAT_ICONS[roundResultData.stat]}</span>
                <div>
                  <div className="text-xs text-slate-400">Stat played</div>
                  <div className="font-rajdhani font-bold text-emerald-400">
                    {STAT_LABELS[roundResultData.stat]}
                  </div>
                </div>
              </div>

              {roundResultData.isTie ? (
                <div className="text-center">
                  <div className="text-xl">🤝</div>
                  <div className="text-xs text-amber-400 font-bold">TIE!</div>
                  <div className="text-xs text-slate-400">Cards go to pile</div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-xl">🏆</div>
                  <div className="text-xs text-amber-400 font-bold">
                    {roundResultData.winnerId === myId ? 'YOU WIN!' :
                      roomData?.players?.find(p => p.id === roundResultData.winnerId)?.name + ' wins!'}
                  </div>
                </div>
              )}

              <div className="flex flex-col items-end gap-1">
                {Object.entries(roundResultData.cards || {}).map(([pid, data]) => {
                  const pName = roomData?.players?.find(p => p.id === pid)?.name
                  const isWinner = pid === roundResultData.winnerId
                  return (
                    <div key={pid} className="text-xs flex items-center gap-1">
                      <span className={isWinner ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                        {pName?.split(' ')[0]}:
                      </span>
                      <span className={isWinner ? 'text-amber-300 font-bold' : 'text-slate-300'}>
                        {typeof data.statValue === 'number' && data.statValue % 1 !== 0
                          ? data.statValue.toFixed(2) : data.statValue}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
            {roundResultData.neutralPileCount > 0 && (
              <div className="mt-2 pt-2 border-t border-white/10 text-xs text-amber-400 text-center">
                ⚠️ Neutral pile: {roundResultData.neutralPileCount} cards
              </div>
            )}
          </div>
        )}

        {/* Turn indicator */}
        <div className="px-3 mb-2">
          {gamePhase === 'playing' && (
            <div className={`rounded-lg px-3 py-1.5 text-center text-sm font-rajdhani font-semibold ${
              isActivePlayer
                ? 'bg-emerald-800/40 border border-emerald-600/50 text-emerald-400'
                : 'bg-pitch-700/40 border border-white/10 text-slate-400'
            }`}>
              {isActivePlayer ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-pulse">●</span>
                  YOUR TURN — Choose a stat!
                </span>
              ) : (
                <span>
                  {roomData?.players?.find(p => p.id === activePlayerId)?.name || 'Opponent'}'s turn...
                </span>
              )}
            </div>
          )}
          {gamePhase === 'waiting' && (
            <div className="rounded-lg px-3 py-1.5 text-center text-sm text-slate-400 border border-white/5">
              Waiting for game to start...
            </div>
          )}
        </div>

        {/* Current card + stat buttons */}
        <div className="flex-1 flex flex-col items-center px-3 pb-3 overflow-y-auto">
          {currentCard ? (
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-2xl">
              {/* My card */}
              <div className={`flex-shrink-0 ${isFlipping ? 'animate-card-flip' : ''}`}>
                <CricketCard
                  card={currentCard}
                  isActive={isActivePlayer && !selectedStat}
                  selectedStat={selectedStat}
                  onStatClick={handleSelectStat}
                  isFlipped={isFlipping}
                />
              </div>

              {/* Stat buttons (mobile) */}
              <div className="flex-1 w-full sm:hidden">
                <div className="glass-card rounded-xl p-3">
                  <p className="text-slate-400 text-xs mb-2 font-medium text-center">
                    {isActivePlayer ? 'SELECT A STAT TO PLAY' : 'WAITING FOR OPPONENT'}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(STAT_LABELS).map(([stat, label]) => {
                      const value = currentCard?.stats?.[stat]
                      const isSelected = selectedStat === stat
                      return (
                        <button
                          key={stat}
                          onClick={() => handleSelectStat(stat)}
                          disabled={!isActivePlayer || !!selectedStat}
                          className={`p-2.5 rounded-lg border text-left transition-all ${
                            isSelected
                              ? 'border-amber-500 bg-amber-500/20 text-amber-400'
                              : isActivePlayer && !selectedStat
                              ? 'border-emerald-700/50 bg-emerald-900/20 hover:border-emerald-500 hover:bg-emerald-900/40 text-white cursor-pointer'
                              : 'border-white/10 bg-white/5 text-slate-500 cursor-default'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-sm">{STAT_ICONS[stat]}</span>
                            <span className="text-xs font-semibold">{label}</span>
                          </div>
                          <div className="font-rajdhani font-bold text-lg">
                            {typeof value === 'number' && value % 1 !== 0 ? value.toFixed(2) : value}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Stat buttons (desktop) */}
              <div className="flex-1 w-full hidden sm:block">
                <div className="glass-card rounded-xl p-4">
                  <p className="text-slate-400 text-xs mb-3 font-medium text-center">
                    {isActivePlayer ? 'SELECT A STAT TO PLAY' : 'WAITING FOR OPPONENT'}
                  </p>
                  <div className="space-y-2">
                    {Object.entries(STAT_LABELS).map(([stat, label]) => {
                      const value = currentCard?.stats?.[stat]
                      const isSelected = selectedStat === stat
                      return (
                        <button
                          key={stat}
                          onClick={() => handleSelectStat(stat)}
                          disabled={!isActivePlayer || !!selectedStat}
                          className={`w-full p-3 rounded-lg border text-left transition-all flex items-center justify-between ${
                            isSelected
                              ? 'border-amber-500 bg-amber-500/20 text-amber-400'
                              : isActivePlayer && !selectedStat
                              ? 'border-emerald-700/50 bg-emerald-900/20 hover:border-emerald-500 hover:bg-emerald-900/40 text-white cursor-pointer'
                              : 'border-white/10 bg-white/5 text-slate-500 cursor-default'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{STAT_ICONS[stat]}</span>
                            <span className="font-semibold text-sm">{label}</span>
                          </div>
                          <div className="font-rajdhani font-bold text-lg">
                            {typeof value === 'number' && value % 1 !== 0 ? value.toFixed(2) : value}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              {gamePhase === 'playing' ? (
                <div className="text-center text-slate-400">
                  <div className="text-4xl mb-2">🃏</div>
                  <p>You've run out of cards!</p>
                  <p className="text-sm mt-1">Waiting for game to end...</p>
                </div>
              ) : gamePhase === 'waiting' ? (
                <div className="text-center text-slate-400">
                  <div className="text-4xl mb-2 animate-float">🏏</div>
                  <p className="font-rajdhani font-semibold text-lg text-white">Waiting for host to start...</p>
                  <p className="text-sm mt-1">Cards will be dealt once the game begins</p>
                </div>
              ) : null}
            </div>
          )}

          {/* My card count */}
          {myHand.length > 0 && (
            <div className="mt-3 flex items-center gap-4 text-sm text-slate-400">
              <span>Your cards: <strong className="text-emerald-400">{myHand.length}</strong></span>
              {roomData?.neutralPileCount > 0 && (
                <span>Neutral pile: <strong className="text-amber-400">{roomData.neutralPileCount}</strong></span>
              )}
              <span>Round: <strong className="text-slate-300">{roomData?.currentRound || 0}</strong></span>
            </div>
          )}

          {error && (
            <div className="mt-3 p-2 bg-red-900/30 border border-red-700/50 rounded-lg text-red-400 text-sm w-full max-w-md">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
