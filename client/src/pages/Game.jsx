import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CricketCard from '../components/game/CricketCard'
import GameTimer from '../components/game/GameTimer'
import Button from '../components/ui/Button'
import useAuthStore from '../store/authStore'
import useGameStore from '../store/gameStore'
import { connectSocket, getSocket, safeEmit } from '../lib/socket'

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
              style={{
                touchAction: 'manipulation',
                ...(isSelected ? { filter: 'drop-shadow(0 0 8px #f59e0b)' } : {})
              }}
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

// ─── Stat Picker Bottom Sheet ─────────────────────────────────────────────────

function StatPickerSheet({ card, statLabels, statIcons, onSelect, onClose }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Trigger slide-up on mount
    const t = setTimeout(() => setVisible(true), 10)
    return () => clearTimeout(t)
  }, [])

  const handleSelect = (stat) => {
    setVisible(false)
    setTimeout(() => onSelect(stat), 250)
  }

  const handleClose = () => {
    setVisible(false)
    setTimeout(() => onClose(), 250)
  }

  const statEntries = Object.entries(statLabels)

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 55,
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)',
          opacity: visible ? 1 : 0, transition: 'opacity 0.25s',
        }}
      />

      {/* Sheet */}
      <div style={{
        position: 'relative', zIndex: 1,
        background: 'linear-gradient(180deg, #0f1e3a 0%, #080f20 100%)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '20px 20px 0 0',
        padding: '0 16px 32px',
        transform: visible ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.3s cubic-bezier(0.34,1.1,0.64,1)',
        maxHeight: '80vh', overflowY: 'auto',
      }}>
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.2)' }} />
        </div>

        {/* Card info */}
        <div style={{ textAlign: 'center', marginBottom: 16, paddingTop: 4 }}>
          <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, letterSpacing: 2, marginBottom: 4 }}>
            SELECT STAT FOR
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#f59e0b', fontFamily: 'Rajdhani, sans-serif', letterSpacing: 1 }}>
            {card.name}
          </div>
        </div>

        {/* Stat grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {statEntries.map(([stat, label]) => {
            const value = card.stats?.[stat]
            const isBurned = card.usedStats?.includes(stat)
            if (value === undefined) return null
            return (
              <button
                key={stat}
                onClick={() => !isBurned && handleSelect(stat)}
                disabled={isBurned}
                style={{
                  background: isBurned ? 'rgba(127,29,29,0.15)' : 'rgba(16,185,129,0.12)',
                  border: `1px solid ${isBurned ? 'rgba(185,28,28,0.3)' : 'rgba(16,185,129,0.35)'}`,
                  borderRadius: 12, padding: '12px 10px', textAlign: 'left',
                  cursor: isBurned ? 'not-allowed' : 'pointer',
                  opacity: isBurned ? 0.5 : 1,
                  touchAction: 'manipulation',
                  transition: 'background 0.15s, border 0.15s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: 16 }}>{isBurned ? '🔥' : statIcons[stat]}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: isBurned ? '#ef4444' : '#94a3b8', letterSpacing: 0.5 }}>
                    {label}
                  </span>
                  {isBurned && <span style={{ fontSize: 10, color: '#ef4444', marginLeft: 'auto' }}>used</span>}
                </div>
                <div style={{
                  fontSize: 24, fontWeight: 900, fontFamily: 'Rajdhani, sans-serif',
                  color: isBurned ? '#475569' : '#f1f5f9', lineHeight: 1,
                }}>
                  {typeof value === 'number' && value % 1 !== 0 ? value.toFixed(2) : value}
                </div>
              </button>
            )
          })}
        </div>

        {/* Cancel */}
        <button
          onClick={handleClose}
          style={{
            marginTop: 14, width: '100%', padding: '12px',
            borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)',
            background: 'transparent', color: '#64748b', fontSize: 14,
            fontWeight: 600, cursor: 'pointer', touchAction: 'manipulation',
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

// ─── Round Battle Animation Overlay ──────────────────────────────────────────

function BattleCard({ playerName, card, statKey, statValue, isWinner, isTie, slideFrom, phase }) {
  const entered = phase >= 1
  const decided = phase >= 2

  return (
    <div style={{
      transform: entered ? 'translateX(0) scale(1)' : `translateX(${slideFrom === 'left' ? '-120vw' : '120vw'})`,
      opacity: decided && !isWinner && !isTie ? 0.35 : 1,
      transition: 'transform 0.55s cubic-bezier(0.34,1.4,0.64,1), opacity 0.4s ease',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
    }}>
      {/* Player name */}
      <div style={{
        fontSize: 11, fontWeight: 700, color: isWinner && decided ? '#f59e0b' : '#94a3b8',
        letterSpacing: 1, textTransform: 'uppercase', maxWidth: 90, textAlign: 'center',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
      }}>
        {playerName}
      </div>

      {/* Card face */}
      <div style={{
        width: 88, borderRadius: 12,
        background: 'linear-gradient(160deg, #1a2744 0%, #0f1e3a 100%)',
        border: `2px solid ${isWinner && decided ? '#f59e0b' : isTie ? '#8b5cf6' : '#334155'}`,
        boxShadow: isWinner && decided ? '0 0 20px #f59e0b80' : isTie ? '0 0 12px #8b5cf660' : 'none',
        padding: '10px 8px', transition: 'border 0.3s, box-shadow 0.3s',
        transform: decided && isWinner ? 'scale(1.08)' : 'scale(1)',
      }}>
        <div style={{ fontSize: 9, color: '#64748b', marginBottom: 2, fontWeight: 600 }}>
          {card?.country || '🌍'}
        </div>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', lineHeight: 1.2, marginBottom: 8, minHeight: 28 }}>
          {card?.name || 'Player'}
        </div>
        {/* Stat highlight */}
        <div style={{
          background: isWinner && decided ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.06)',
          border: `1px solid ${isWinner && decided ? '#f59e0b60' : '#ffffff15'}`,
          borderRadius: 8, padding: '5px 4px', textAlign: 'center',
          transition: 'background 0.3s, border 0.3s'
        }}>
          <div style={{ fontSize: 9, color: '#64748b', fontWeight: 600, marginBottom: 2 }}>
            {statKey?.replace(/_/g, ' ').toUpperCase()}
          </div>
          <div style={{
            fontSize: 20, fontWeight: 900, lineHeight: 1,
            color: isWinner && decided ? '#f59e0b' : '#e2e8f0',
            fontFamily: 'Rajdhani, sans-serif'
          }}>
            {typeof statValue === 'number' && statValue % 1 !== 0 ? statValue.toFixed(2) : statValue}
          </div>
        </div>
      </div>

      {/* Winner badge */}
      {isWinner && decided && (
        <div style={{
          background: 'linear-gradient(90deg,#f59e0b,#d97706)',
          borderRadius: 20, padding: '3px 10px',
          fontSize: 11, fontWeight: 800, color: '#000',
          animation: 'popIn 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        }}>
          🏆 WINS!
        </div>
      )}
      {isTie && decided && (
        <div style={{ fontSize: 11, fontWeight: 700, color: '#a78bfa' }}>🤝 TIE</div>
      )}
    </div>
  )
}

function RoundBattleOverlay({ result, players, myId, statLabels, statIcons, onDone }) {
  const [phase, setPhase] = useState(0) // 0=hidden 1=slide-in 2=compare 3=winner

  useEffect(() => {
    const t0 = setTimeout(() => setPhase(1), 50)
    const t1 = setTimeout(() => setPhase(2), 700)
    const t2 = setTimeout(() => setPhase(3), 2000)
    const t3 = setTimeout(() => onDone(), 3400)
    return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  const entries = Object.entries(result.cards || {})
  const n = entries.length
  const winnerName = result.winnerId
    ? (players.find(p => p.id === result.winnerId)?.name || 'Player')
    : null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 60,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(4,10,26,0.92)', backdropFilter: 'blur(6px)',
      padding: '16px'
    }}>
      {/* Header */}
      <div style={{ marginBottom: 12, textAlign: 'center' }}>
        <div style={{ fontSize: 11, color: '#475569', fontWeight: 600, letterSpacing: 2, marginBottom: 4 }}>
          ROUND {result.currentRound}
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)',
          borderRadius: 20, padding: '5px 14px',
        }}>
          <span style={{ fontSize: 16 }}>{statIcons[result.stat]}</span>
          <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 14, color: '#34d399', letterSpacing: 1 }}>
            {statLabels[result.stat]?.toUpperCase()}
          </span>
        </div>
      </div>

      {/* VS area */}
      <div style={{ display: 'flex', alignItems: 'center', gap: n <= 2 ? 20 : 10, flexWrap: 'wrap', justifyContent: 'center' }}>
        {entries.map(([pid, { card, statValue }], i) => {
          const player = players.find(p => p.id === pid)
          const isWinner = pid === result.winnerId
          const slideFrom = i < Math.ceil(n / 2) ? 'left' : 'right'
          return (
            <React.Fragment key={pid}>
              <BattleCard
                playerName={pid === myId ? 'YOU' : (player?.name || 'Player')}
                card={card}
                statKey={result.stat}
                statValue={statValue}
                isWinner={isWinner}
                isTie={result.isTie}
                slideFrom={slideFrom}
                phase={phase}
              />
              {i < entries.length - 1 && phase >= 1 && (
                <div style={{
                  fontSize: n <= 2 ? 22 : 14, fontWeight: 900,
                  color: 'rgba(255,255,255,0.2)', flexShrink: 0,
                  opacity: phase >= 1 ? 1 : 0, transition: 'opacity 0.3s',
                }}>
                  VS
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>

      {/* Winner announcement */}
      <div style={{
        marginTop: 20, minHeight: 32, textAlign: 'center',
        opacity: phase >= 3 ? 1 : 0, transform: phase >= 3 ? 'translateY(0)' : 'translateY(8px)',
        transition: 'opacity 0.4s, transform 0.4s'
      }}>
        {result.isTie ? (
          <div style={{ fontSize: 16, fontWeight: 700, color: '#a78bfa' }}>
            🤝 Cards go to neutral pile!
          </div>
        ) : winnerName && (
          <div style={{ fontSize: 16, fontWeight: 700, color: '#f59e0b', fontFamily: 'Rajdhani, sans-serif' }}>
            {result.winnerId === myId ? '🏆 YOU TAKE THE CARDS!' : `🏆 ${winnerName} takes the cards!`}
          </div>
        )}
      </div>

      <style>{`
        @keyframes popIn {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
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
  const [lastRound, setLastRound] = useState(false)
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
      // Always re-request state on every (re)connect.
      // The server detects returning players and sends their full current hand + phase,
      // so this is safe on initial connect AND on cellular reconnects.
      socket.emit('join_room', {
        roomCode,
        player: { id: user.id, name: user.name }
      })
    })

    socket.on('disconnect', () => {
      setConnected(false)
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
      setRoundResultData(result)
      setShowRoundResult(true)
      setRoundResult(result)
      updateGameState(gameState)
    })

    socket.on('game_state_update', ({ gameState, myHand: hand }) => {
      updateGameState(gameState)
      if (hand) setMyHand(hand)
    })

    socket.on('timer_tick', ({ timeLeft: tl }) => {
      setTimeLeft(tl)
    })

    socket.on('last_round_warning', () => {
      setLastRound(true)
    })

    socket.on('game_ended', (data) => {
      setGameEnd(data)
    })

    socket.on('error', ({ message }) => {
      setError(message)
      setTimeout(() => setError(''), 4000)
    })

    // If already connected when the component mounts, fire the sync immediately.
    if (socket.connected) {
      setConnected(true)
      socket.emit('join_room', {
        roomCode,
        player: { id: user.id, name: user.name }
      })
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
      socket.off('last_round_warning')
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
    // Use safeEmit: if momentarily disconnected (cellular blip) it queues
    // the emit and fires once the socket reconnects, so no silent drop.
    safeEmit('select_card_stat', {
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
    safeEmit('select_opponent_card', {
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

      {/* ── Reconnecting banner (cellular drop indicator) ── */}
      {!connected && (
        <div className="flex items-center justify-center gap-2 px-3 py-1.5 bg-amber-900/80 border-b border-amber-600/50 text-amber-300 text-xs font-semibold animate-pulse">
          <span>📶</span> Reconnecting… your turn will be held
        </div>
      )}

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

        {lastRound && (
          <div className="mx-4 mb-2 py-1.5 px-3 bg-red-900/60 border border-red-500/60 rounded-lg text-center animate-pulse">
            <span className="text-red-300 font-rajdhani font-bold text-sm tracking-wide">
              🏁 LAST ROUND — finish this hand to end the game
            </span>
          </div>
        )}

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

        {/* Round battle animation overlay */}
        {showRoundResult && roundResultData && (
          <RoundBattleOverlay
            result={roundResultData}
            players={roomData?.players || []}
            myId={myId}
            statLabels={statLabels}
            statIcons={statIcons}
            onDone={() => {
              setShowRoundResult(false)
              setRoundResultData(null)
              setSelectedCard(null)
              setPendingStatCard(null)
            }}
          />
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

              {/* Hint when card selected but sheet not open */}
              {selectedCard && !pendingStatCard && (
                <div className="text-slate-400 text-xs text-center animate-pulse">
                  Tap the card again to reopen stat picker
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

      {/* Stat picker bottom sheet — slides up when active player taps a card */}
      {pendingStatCard && (
        <StatPickerSheet
          card={pendingStatCard}
          statLabels={statLabels}
          statIcons={statIcons}
          onSelect={handleSelectStat}
          onClose={() => setPendingStatCard(null)}
        />
      )}
    </div>
  )
}
