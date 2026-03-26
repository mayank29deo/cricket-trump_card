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

const IPL_STAT_LABELS = {
  ipl_runs: 'IPL Runs',
  ipl_avg: 'IPL Avg',
  ipl_sr: 'Strike Rate',
  ipl_wickets: 'Wickets',
  ipl_economy: 'Economy',
  ipl_matches: 'Matches'
}

const IPL_STAT_ICONS = {
  ipl_runs: '📊',
  ipl_avg: '🏏',
  ipl_sr: '⚡',
  ipl_wickets: '🎯',
  ipl_economy: '💰',
  ipl_matches: '🏟️'
}

// ─── Utility helpers ─────────────────────────────────────────────────────────

function fmtVal(value) {
  if (typeof value === 'number' && value % 1 !== 0) return value.toFixed(2)
  return value
}

function getAvatarColor(name) {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const colors = ['#1e40af', '#7c3aed', '#b45309', '#065f46', '#9f1239', '#1e3a5f']
  return colors[Math.abs(hash) % colors.length]
}

// ─── Small reusable components ────────────────────────────────────────────────

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
  const pieces = Array.from({ length: 80 }, (_, i) => ({
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

/** Phase countdown badge shown near action area */
function PhaseTimer({ seconds, phase }) {
  const isActive = phase === 'active_selecting'
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-rajdhani font-bold ${
      isActive ? 'bg-emerald-700/40 border border-emerald-500/50 text-emerald-300'
               : 'bg-amber-700/40 border border-amber-500/50 text-amber-300'
    }`}>
      <span className="animate-pulse">⏱</span>
      <span>{seconds}s</span>
    </div>
  )
}

/**
 * Horizontal scrollable hand row.
 * Renders compact CricketCard previews. If a card is selected it gets a glow border.
 * Cards in `lockedIds` are dimmed and not clickable.
 */
function HandRow({ cards, selectedCardId, onCardClick, lockedIds = [], statToHighlight = null }) {
  return (
    <div className="overflow-x-auto pb-2 -mx-3 px-3">
      <div className="flex gap-2 w-max">
        {cards.map(card => {
          const isSelected = card.id === selectedCardId
          const isLocked = lockedIds.includes(card.id)
          return (
            <div
              key={card.id}
              onClick={() => !isLocked && onCardClick && onCardClick(card)}
              className={`flex-shrink-0 cursor-pointer transition-transform ${
                isSelected ? 'scale-105' : isLocked ? 'opacity-40 cursor-default' : 'hover:scale-102 active:scale-95'
              }`}
              style={isSelected ? { filter: 'drop-shadow(0 0 8px #f59e0b)' } : undefined}
            >
              <CricketCard
                card={card}
                compact
                selectedStat={isSelected && statToHighlight ? statToHighlight : null}
                isActive={isSelected}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Game() {
  const navigate = useNavigate()
  const { roomCode } = useParams()
  const { user } = useAuthStore()
  const {
    roomData, myHand, myId, gamePhase, isMyTurn, timeLeft,
    overallWinner, gameEndData, roundResult,
    currentPhase, phaseTimeLeft, mySelectedCard, hasSubmittedCard,
    setRoom, updateGameState, setMyHand, setRoundResult, setTimeLeft,
    setGameEnd, resetGame, setPhase, setPhaseTimeLeft, setMySelectedCard, markCardSubmitted
  } = useGameStore()

  // Local UI state
  const [selectedCard, setSelectedCard] = useState(null)   // card object picked in active_selecting
  const [pendingStatCard, setPendingStatCard] = useState(null) // card whose stat buttons are shown
  const [showRoundResult, setShowRoundResult] = useState(false)
  const [roundResultData, setRoundResultData] = useState(null)
  const [isFlipping, setIsFlipping] = useState(false)
  const [joinPrompt, setJoinPrompt] = useState(false)
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState('')
  const [opponentSubmits, setOpponentSubmits] = useState({ count: 0, total: 0 })
  const socketRef = useRef(null)

  const isIPL = roomData?.deckType === 'ipl'
  const statLabels = isIPL ? IPL_STAT_LABELS : STAT_LABELS
  const statIcons  = isIPL ? IPL_STAT_ICONS  : STAT_ICONS

  const totalTime = roomData?.timeOption ? roomData.timeOption * 60 : 360

  // Derived
  const activePlayerId = roomData?.activePlayerId || currentPhase?.activePlayerId
  const isActivePlayer = activePlayerId === myId
  const opponents = roomData?.players?.filter(p => p.id !== myId && p.isActive) || []

  // ─── Socket wiring ─────────────────────────────────────────────────────────

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

    socket.on('phase_changed', (phaseData) => {
      setPhase(phaseData)
      setSelectedCard(null)
      setPendingStatCard(null)
      setOpponentSubmits({ count: 0, total: 0 })
    })

    socket.on('phase_timer_tick', ({ phaseTimeLeft: t }) => {
      setPhaseTimeLeft(t)
    })

    socket.on('opponent_selection_update', ({ submittedCount, totalOpponents }) => {
      setOpponentSubmits({ count: submittedCount, total: totalOpponents })
    })

    socket.on('round_result', ({ roundResult: result, gameState }) => {
      setIsFlipping(true)
      setTimeout(() => setIsFlipping(false), 600)

      setRoundResultData(result)
      setShowRoundResult(true)
      setRoundResult(result)
      updateGameState(gameState)

      setTimeout(() => {
        setShowRoundResult(false)
        setRoundResultData(null)
        setSelectedCard(null)
        setPendingStatCard(null)
      }, 2500)
    })

    socket.on('game_state_update', ({ gameState, myHand: hand }) => {
      updateGameState(gameState)
      if (hand) setMyHand(hand)
    })

    socket.on('timer_tick', ({ timeLeft: tl }) => {
      setTimeLeft(tl)
    })

    socket.on('game_ended', (data) => {
      setGameEnd(data)
    })

    socket.on('error', ({ message }) => {
      setError(message)
      setTimeout(() => setError(''), 4000)
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
      socket.off('phase_changed')
      socket.off('phase_timer_tick')
      socket.off('opponent_selection_update')
      socket.off('round_result')
      socket.off('game_state_update')
      socket.off('timer_tick')
      socket.off('game_ended')
      socket.off('error')
    }
  }, [roomCode, user])

  // ─── Action handlers ────────────────────────────────────────────────────────

  // Active player taps a card → show stat buttons for it
  const handleCardPickForActive = useCallback((card) => {
    if (!isActivePlayer || gamePhase !== 'active_selecting') return
    setSelectedCard(card)
    setPendingStatCard(card)
  }, [isActivePlayer, gamePhase])

  // Active player taps a stat after picking a card
  const handleSelectStat = useCallback((stat) => {
    if (!isActivePlayer || !selectedCard) return
    const socket = getSocket()
    socket.emit('select_card_stat', {
      roomCode,
      playerId: myId,
      cardId: selectedCard.id,
      stat
    })
    setPendingStatCard(null)
    setSelectedCard(card => card) // keep highlight until phase changes
  }, [isActivePlayer, selectedCard, roomCode, myId])

  // Opponent picks their card to compete
  const handleOpponentCardPick = useCallback((card) => {
    if (isActivePlayer || gamePhase !== 'opponents_selecting' || hasSubmittedCard) return
    const socket = getSocket()
    socket.emit('select_opponent_card', {
      roomCode,
      playerId: myId,
      cardId: card.id
    })
    setMySelectedCard(card)
    markCardSubmitted()
  }, [isActivePlayer, gamePhase, hasSubmittedCard, roomCode, myId, setMySelectedCard, markCardSubmitted])

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

  // ─── POST-GAME SCREEN ───────────────────────────────────────────────────────

  if (gamePhase === 'ended' && gameEndData) {
    const players = gameEndData.players || []
    const winner = gameEndData.overallWinner
    const isWinner = winner?.id === myId
    const sortedPlayers = [...players].sort((a, b) => {
      if ((b.score || 0) !== (a.score || 0)) return (b.score || 0) - (a.score || 0)
      return (b.cardCount || 0) - (a.cardCount || 0)
    })

    const positionColors = [
      'bg-amber-500 text-black',
      'bg-slate-400 text-black',
      'bg-amber-800 text-white'
    ]
    const positionEmojis = ['🥇', '🥈', '🥉']

    return (
      <div className="min-h-screen stadium-bg flex flex-col items-center justify-start px-4 py-8 relative overflow-hidden overflow-y-auto">
        {isWinner && <ConfettiEffect />}

        <div className="w-full max-w-md animate-bounce-in">
          {/* Result header */}
          <div className={`text-center mb-6 ${isWinner ? 'animate-bounce' : ''}`}>
            <div className="text-7xl mb-3">{isWinner ? '🏆' : '🏏'}</div>
            <h1 className="font-rajdhani font-bold text-4xl mb-1">
              {isWinner ? (
                <span className="gradient-text">YOU WIN!</span>
              ) : (
                <span className="text-white">GAME OVER</span>
              )}
            </h1>
            {winner && (
              <p className="text-slate-400 text-base">
                {isWinner ? 'Congratulations, champion!' : `${winner.name} wins the match!`}
              </p>
            )}
          </div>

          {/* Winner trophy card */}
          {winner && (
            <div className="glass-card rounded-2xl p-5 mb-5 border border-amber-500/40">
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl text-white flex-shrink-0 border-2 border-amber-500"
                  style={{ backgroundColor: getAvatarColor(winner.name) }}
                >
                  {winner.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <div className="text-amber-400 font-rajdhani font-bold text-2xl leading-tight">
                    {winner.name}
                  </div>
                  <div className="text-slate-400 text-sm">🏆 Match Champion</div>
                  <div className="text-emerald-400 text-sm font-semibold mt-0.5">
                    {winner.score || 0} rounds won
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* THIS GAME leaderboard */}
          <div className="glass-card rounded-2xl p-5 mb-5">
            <h3 className="font-rajdhani font-bold text-white mb-4 text-lg flex items-center gap-2">
              <span>📋</span> THIS GAME LEADERBOARD
            </h3>
            <div className="space-y-2">
              {/* Header row */}
              <div className="flex items-center gap-2 px-2 pb-1 border-b border-white/10">
                <div className="w-8 text-center text-xs text-slate-500 font-semibold">#</div>
                <div className="flex-1 text-xs text-slate-500 font-semibold">Player</div>
                <div className="w-14 text-center text-xs text-slate-500 font-semibold">Points</div>
                <div className="w-14 text-center text-xs text-slate-500 font-semibold">Cards</div>
                <div className="w-14 text-center text-xs text-slate-500 font-semibold">Result</div>
              </div>

              {sortedPlayers.map((player, index) => {
                const isMe = player.id === myId
                const isThisWinner = player.id === winner?.id
                return (
                  <div
                    key={player.id}
                    className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                      isThisWinner ? 'bg-amber-500/10 border border-amber-500/30'
                      : isMe ? 'bg-emerald-900/20 border border-emerald-700/30'
                      : 'bg-white/5'
                    }`}
                  >
                    {/* Position badge */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                      index < 3 ? positionColors[index] : 'bg-pitch-700 text-slate-400'
                    }`}>
                      {index < 3 ? positionEmojis[index] : index + 1}
                    </div>

                    {/* Avatar + name */}
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-white flex-shrink-0"
                        style={{ backgroundColor: getAvatarColor(player.name) }}
                      >
                        {player.name?.[0]?.toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="text-white text-sm font-medium truncate">{player.name}</div>
                        {isMe && (
                          <div className="text-xs text-emerald-400 font-bold">YOU</div>
                        )}
                      </div>
                    </div>

                    {/* Rounds won */}
                    <div className="w-14 text-center">
                      <div className="text-emerald-400 font-rajdhani font-bold text-base">
                        {player.score || 0}
                      </div>
                    </div>

                    {/* Cards */}
                    <div className="w-14 text-center">
                      <div className="text-slate-300 font-rajdhani font-bold text-base">
                        {player.cardCount || 0}
                      </div>
                    </div>

                    {/* Result badge */}
                    <div className="w-14 text-center">
                      {isThisWinner ? (
                        <span className="text-xs bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded px-1.5 py-0.5 font-bold">
                          WIN
                        </span>
                      ) : index === sortedPlayers.length - 1 ? (
                        <span className="text-xs bg-red-900/20 text-red-400 border border-red-700/40 rounded px-1.5 py-0.5">
                          LAST
                        </span>
                      ) : (
                        <span className="text-xs bg-slate-800 text-slate-400 border border-white/10 rounded px-1.5 py-0.5">
                          #{index + 1}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Share + navigation */}
          <div className="space-y-3">
            <button
              onClick={() => {
                const text = `I just played Cricket Trump Card! ${isWinner ? '🏆 I won!' : `${winner?.name} won!`} 🏏`
                navigator.clipboard?.writeText(text).catch(() => {})
              }}
              className="w-full p-3 rounded-xl border border-white/20 text-slate-300 text-sm font-medium hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
            >
              <span>📤</span> Share Result
            </button>
            <div className="flex gap-3">
              <Button variant="primary" fullWidth size="lg" onClick={handlePlayAgain} className="neon-border">
                <span className="flex items-center justify-center gap-2">
                  <span>🔄</span> Play Again
                </span>
              </Button>
              <Button variant="ghost" fullWidth size="lg" onClick={() => navigate('/')}>
                Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ─── ACTIVE GAME SCREEN ─────────────────────────────────────────────────────

  const activePhaseName = gamePhase === 'active_selecting' ? 'active_selecting' : 'opponents_selecting'
  const announcedStat = currentPhase?.stat || null
  const announcedCard = currentPhase?.activeCard || null
  const announcedStatValue = currentPhase?.statValue ?? null

  return (
    <div className="min-h-screen stadium-bg flex flex-col overflow-hidden">

      {/* ── Top bar ── */}
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

        <GameTimer totalTime={totalTime} timeLeft={timeLeft} />

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

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Opponents row */}
        <div className="px-3 pt-3 pb-2">
          <div className="flex items-start gap-3 justify-center flex-wrap">
            {opponents.length === 0 && gamePhase === 'waiting' && (
              <div className="text-slate-500 text-sm py-4">Waiting for game to start...</div>
            )}
            {opponents.map(opponent => (
              <div key={opponent.id} className="flex flex-col items-center gap-1.5">
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
                <div className="flex items-center gap-1">
                  <PlayerAvatar name={opponent.name} size={5} />
                  <div className="text-xs text-slate-300 max-w-[60px] truncate">{opponent.name}</div>
                </div>
                <div className="flex items-center gap-1 flex-wrap justify-center">
                  <span className="text-xs text-slate-400">{opponent.cardCount} 🃏</span>
                  {opponent.id === activePlayerId && (
                    <span className="text-xs text-amber-400 font-bold animate-pulse">TURN</span>
                  )}
                  {/* Opponent submitted indicator */}
                  {gamePhase === 'opponents_selecting' &&
                    opponent.id !== activePlayerId && (
                    <span className="text-xs text-emerald-400">✓</span>
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
                <span className="text-lg">{statIcons[roundResultData.stat]}</span>
                <div>
                  <div className="text-xs text-slate-400">Stat played</div>
                  <div className="font-rajdhani font-bold text-emerald-400">
                    {statLabels[roundResultData.stat]}
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
                    {roundResultData.winnerId === myId
                      ? 'YOU WIN!'
                      : (roomData?.players?.find(p => p.id === roundResultData.winnerId)?.name || 'Player') + ' wins!'}
                  </div>
                </div>
              )}

              <div className="flex flex-col items-end gap-1">
                {Object.entries(roundResultData.cards || {}).map(([pid, data]) => {
                  const pName = roomData?.players?.find(p => p.id === pid)?.name
                  const isWinnerEntry = pid === roundResultData.winnerId
                  return (
                    <div key={pid} className="text-xs flex items-center gap-1">
                      <span className={isWinnerEntry ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                        {pName?.split(' ')[0]}:
                      </span>
                      <span className={isWinnerEntry ? 'text-amber-300 font-bold' : 'text-slate-300'}>
                        {fmtVal(data.statValue)}
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

        {/* ─── Phase-specific main content ─── */}
        <div className="flex-1 flex flex-col items-center px-3 pb-3 overflow-y-auto gap-3">

          {/* ── Waiting to start ── */}
          {gamePhase === 'waiting' && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-slate-400">
                <div className="text-4xl mb-2 animate-float">🏏</div>
                <p className="font-rajdhani font-semibold text-lg text-white">Waiting for host to start...</p>
                <p className="text-sm mt-1">Cards will be dealt once the game begins</p>
              </div>
            </div>
          )}

          {/* ── active_selecting — I AM the active player ── */}
          {gamePhase === 'active_selecting' && isActivePlayer && myHand.length > 0 && (
            <>
              <div className="w-full">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-emerald-400 text-sm font-rajdhani font-semibold">
                    🏏 YOUR TURN — Pick a card
                  </p>
                  <PhaseTimer seconds={phaseTimeLeft} phase="active_selecting" />
                </div>
                <HandRow
                  cards={myHand}
                  selectedCardId={selectedCard?.id}
                  onCardClick={handleCardPickForActive}
                />
              </div>

              {/* Stat picker appears after a card is picked */}
              {pendingStatCard && (
                <div className="w-full glass-card rounded-xl p-3">
                  <p className="text-slate-400 text-xs mb-2 font-medium text-center">
                    SELECT A STAT FOR <span className="text-amber-400">{pendingStatCard.name}</span>
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(statLabels).map(([stat, label]) => {
                      const value = pendingStatCard.stats?.[stat]
                      const isBurned = pendingStatCard.usedStats?.includes(stat)
                      return (
                        <button
                          key={stat}
                          onClick={() => !isBurned && handleSelectStat(stat)}
                          disabled={isBurned}
                          className={`p-2.5 rounded-lg border text-left transition-all ${
                            isBurned
                              ? 'border-red-900/40 bg-red-950/20 opacity-50 cursor-not-allowed'
                              : 'border-emerald-700/50 bg-emerald-900/20 hover:border-emerald-500 hover:bg-emerald-900/40 cursor-pointer text-white'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-sm">{isBurned ? '🔥' : statIcons[stat]}</span>
                            <span className="text-xs font-semibold">{label}</span>
                            {isBurned && <span className="text-xs text-red-400 ml-auto">used</span>}
                          </div>
                          <div className={`font-rajdhani font-bold text-lg ${isBurned ? 'text-slate-600' : ''}`}>
                            {fmtVal(value)}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {selectedCard && !pendingStatCard && (
                <div className="text-slate-400 text-sm flex items-center gap-2 animate-pulse">
                  <span>⏳</span> Waiting for opponents to choose...
                </div>
              )}
            </>
          )}

          {/* ── active_selecting — I am NOT the active player ── */}
          {gamePhase === 'active_selecting' && !isActivePlayer && (
            <>
              <div className="w-full">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-slate-400 text-sm font-rajdhani">
                    ⏳ <span className="text-amber-300 font-semibold">
                      {roomData?.players?.find(p => p.id === activePlayerId)?.name || 'Opponent'}
                    </span> is choosing...
                  </p>
                  <PhaseTimer seconds={phaseTimeLeft} phase="active_selecting" />
                </div>
                {/* Show my cards dimmed/locked */}
                {myHand.length > 0 && (
                  <HandRow
                    cards={myHand}
                    lockedIds={myHand.map(c => c.id)}
                  />
                )}
              </div>
            </>
          )}

          {/* ── opponents_selecting — I AM the active player ── */}
          {gamePhase === 'opponents_selecting' && isActivePlayer && (
            <>
              {/* Show my played card prominently */}
              {announcedCard && (
                <div className="flex flex-col items-center gap-2 w-full">
                  <div className="flex items-center justify-between w-full mb-1">
                    <p className="text-slate-400 text-sm font-rajdhani">
                      Your card is played
                    </p>
                    <PhaseTimer seconds={phaseTimeLeft} phase="opponents_selecting" />
                  </div>
                  <div style={{ filter: 'drop-shadow(0 0 12px #f59e0b)' }}>
                    <CricketCard card={announcedCard} selectedStat={announcedStat} isActive />
                  </div>
                  {announcedStat && (
                    <div className="text-emerald-400 font-rajdhani font-bold text-xl text-center">
                      {statIcons[announcedStat]} {statLabels[announcedStat]}: {fmtVal(announcedStatValue)}
                    </div>
                  )}
                </div>
              )}
              <div className="text-slate-400 text-sm flex items-center gap-2">
                <span>⏳</span>
                Waiting for opponents — {opponentSubmits.count}/{opponentSubmits.total} ready
              </div>
            </>
          )}

          {/* ── opponents_selecting — I am NOT the active player ── */}
          {gamePhase === 'opponents_selecting' && !isActivePlayer && (
            <>
              {/* Active player's card shown prominently */}
              {announcedCard && (
                <div className="flex flex-col items-center gap-2 w-full">
                  <div className="flex items-center justify-between w-full mb-1">
                    <p className="text-slate-400 text-sm font-rajdhani">
                      <span className="text-amber-300 font-semibold">
                        {roomData?.players?.find(p => p.id === activePlayerId)?.name || 'Opponent'}
                      </span>'s card
                    </p>
                    <PhaseTimer seconds={phaseTimeLeft} phase="opponents_selecting" />
                  </div>
                  <div style={{ filter: 'drop-shadow(0 0 12px #f59e0b)' }}>
                    <CricketCard card={announcedCard} selectedStat={announcedStat} isActive />
                  </div>
                  {announcedStat && (
                    <div className="bg-emerald-600/20 border border-emerald-500/40 rounded-xl px-4 py-2 text-center">
                      <div className="text-slate-400 text-xs mb-0.5">Beat this</div>
                      <div className="text-emerald-300 font-rajdhani font-bold text-2xl">
                        {statIcons[announcedStat]} {statLabels[announcedStat]}: {fmtVal(announcedStatValue)}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* My hand to pick from */}
              {!hasSubmittedCard ? (
                <div className="w-full">
                  <p className="text-white text-sm font-rajdhani font-semibold mb-2">
                    Pick your card to play:
                  </p>
                  {myHand.length > 0 ? (
                    <HandRow
                      cards={myHand}
                      onCardClick={handleOpponentCardPick}
                      statToHighlight={announcedStat}
                    />
                  ) : (
                    <p className="text-slate-500 text-sm">You have no cards left.</p>
                  )}
                </div>
              ) : (
                <div className="text-emerald-400 font-semibold flex items-center gap-2">
                  <span>✓</span> Card submitted! Waiting for others...
                </div>
              )}
            </>
          )}

          {/* Stats row */}
          {myHand.length > 0 && gamePhase !== 'waiting' && (
            <div className="mt-1 flex items-center gap-4 text-sm text-slate-400">
              <span>Cards: <strong className="text-emerald-400">{myHand.length}</strong></span>
              {roomData?.neutralPileCount > 0 && (
                <span>Pile: <strong className="text-amber-400">{roomData.neutralPileCount}</strong></span>
              )}
              <span>Round: <strong className="text-slate-300">{roomData?.currentRound || 0}</strong></span>
            </div>
          )}

          {myHand.length === 0 && (gamePhase === 'active_selecting' || gamePhase === 'opponents_selecting') && (
            <div className="text-center text-slate-400">
              <div className="text-4xl mb-2">🃏</div>
              <p>You've run out of cards!</p>
              <p className="text-sm mt-1">Waiting for game to end...</p>
            </div>
          )}

          {error && (
            <div className="p-2 bg-red-900/30 border border-red-700/50 rounded-lg text-red-400 text-sm w-full max-w-md">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
