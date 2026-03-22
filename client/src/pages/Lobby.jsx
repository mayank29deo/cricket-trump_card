import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../components/ui/Button'
import ShareModal from '../components/lobby/ShareModal'
import useAuthStore from '../store/authStore'
import useGameStore from '../store/gameStore'
import { connectSocket, getSocket, safeEmit } from '../lib/socket'

const TIME_OPTIONS = [
  { value: 4, label: '4 Min', desc: 'Quick Battle', icon: '⚡', color: 'emerald' },
  { value: 6, label: '6 Min', desc: 'Standard Game', icon: '🏏', color: 'blue' },
  { value: 10, label: '10 Min', desc: 'Extended Match', icon: '🏆', color: 'purple' }
]

function getAvatarColor(name) {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const colors = ['#1e40af', '#7c3aed', '#b45309', '#065f46', '#9f1239', '#1e3a5f']
  return colors[Math.abs(hash) % colors.length]
}

function PlayerAvatar({ name, size = 10 }) {
  const initials = name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?'
  const color = getAvatarColor(name || '')
  return (
    <div
      className={`w-${size} h-${size} rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0`}
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  )
}

export default function Lobby() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { setRoom } = useGameStore()

  const [view, setView] = useState('main') // 'main' | 'waiting'
  const [activeTab, setActiveTab] = useState('create')
  const [timeOption, setTimeOption] = useState(6)
  const [roomCode, setRoomCode] = useState('')
  const [joinCodeDigits, setJoinCodeDigits] = useState(['', '', '', '', '', ''])
  const [roomData, setRoomData] = useState(null)
  const [myId, setMyId] = useState(null)
  const [error, setError] = useState('')
  const [showShare, setShowShare] = useState(false)
  const [copied, setCopied] = useState(false)
  const [recentRooms, setRecentRooms] = useState([])
  const [isConnecting, setIsConnecting] = useState(false)
  const joinInputRefs = useRef([])

  useEffect(() => {
    if (!user) {
      navigate('/auth')
      return
    }
    setMyId(user.id)

    try {
      const stored = JSON.parse(localStorage.getItem('recent_rooms') || '[]')
      setRecentRooms(stored.slice(0, 3))
    } catch {
      // ignore
    }

    const socket = connectSocket()

    socket.on('room_created', ({ roomCode: code, room }) => {
      setRoomCode(code)
      setRoomData(room)
      setView('waiting')
      setIsConnecting(false)
      saveRecentRoom(code)
    })

    socket.on('room_joined', ({ room, myId: id }) => {
      setRoomData(room)
      setMyId(id)
      setView('waiting')
      setIsConnecting(false)
    })

    socket.on('room_updated', ({ room }) => {
      setRoomData(room)
    })

    socket.on('game_started', ({ myHand, myId: id, gameState }) => {
      const store = useGameStore.getState()
      store.setRoom(gameState.code, gameState, id)
      store.setMyHand(myHand)
      store.updateGameState(gameState)
      navigate(`/game/${gameState.code}`)
    })

    socket.on('error', ({ message }) => {
      setError(message)
      setIsConnecting(false)
    })

    socket.on('connect_error', () => {
      setError('Connection failed. Check your internet and try again.')
      setIsConnecting(false)
    })

    return () => {
      socket.off('room_created')
      socket.off('room_joined')
      socket.off('room_updated')
      socket.off('game_started')
      socket.off('error')
      socket.off('connect_error')
    }
  }, [user, navigate])

  function saveRecentRoom(code) {
    try {
      const stored = JSON.parse(localStorage.getItem('recent_rooms') || '[]')
      const updated = [code, ...stored.filter(c => c !== code)].slice(0, 3)
      localStorage.setItem('recent_rooms', JSON.stringify(updated))
      setRecentRooms(updated)
    } catch {
      // ignore
    }
  }

  const handleCreateRoom = () => {
    if (!user) return
    setError('')
    setIsConnecting(true)
    safeEmit('create_room', {
      player: { id: user.id, name: user.name },
      timeOption
    })
  }

  const handleJoinRoom = () => {
    const code = joinCodeDigits.join('').toUpperCase()
    if (code.length !== 6) {
      setError('Please enter a complete 6-character room code')
      return
    }
    setError('')
    setIsConnecting(true)
    safeEmit('join_room', {
      roomCode: code,
      player: { id: user.id, name: user.name }
    })
    setRoomCode(code)
    saveRecentRoom(code)
  }

  const handleJoinRecent = (code) => {
    setError('')
    setIsConnecting(true)
    safeEmit('join_room', {
      roomCode: code,
      player: { id: user.id, name: user.name }
    })
    setRoomCode(code)
  }

  const handleStartGame = () => {
    const socket = getSocket()
    socket.emit('start_game', { roomCode, playerId: myId })
  }

  const handleLeaveRoom = () => {
    const socket = getSocket()
    socket.emit('leave_room', { roomCode, playerId: myId })
    setView('main')
    setRoomData(null)
    setRoomCode('')
    setJoinCodeDigits(['', '', '', '', '', ''])
  }

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignore
    }
  }

  const handleDigitChange = (index, value) => {
    const char = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(-1)
    const newDigits = [...joinCodeDigits]
    newDigits[index] = char
    setJoinCodeDigits(newDigits)
    if (char && index < 5) {
      joinInputRefs.current[index + 1]?.focus()
    }
  }

  const handleDigitKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !joinCodeDigits[index] && index > 0) {
      joinInputRefs.current[index - 1]?.focus()
    }
    if (e.key === 'Enter') {
      handleJoinRoom()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 6)
    const newDigits = [...joinCodeDigits]
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i]
    }
    setJoinCodeDigits(newDigits)
    if (pasted.length > 0) {
      joinInputRefs.current[Math.min(pasted.length, 5)]?.focus()
    }
  }

  const isHost = roomData?.host === myId
  const canStart = isHost && roomData?.players?.length >= 2

  if (view === 'waiting' && roomData) {
    return (
      <div className="min-h-screen stadium-bg flex flex-col">
        <nav className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <button
            onClick={handleLeaveRoom}
            className="text-slate-400 hover:text-white flex items-center gap-1 text-sm transition-colors"
          >
            ← Leave Room
          </button>
          <span className="font-rajdhani font-bold text-emerald-400">WAITING ROOM</span>
          <button
            onClick={() => setShowShare(true)}
            className="text-slate-400 hover:text-emerald-400 text-sm transition-colors flex items-center gap-1"
          >
            📤 Share
          </button>
        </nav>

        <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
          <div className="w-full max-w-md space-y-6">
            {/* Room code display */}
            <div className="glass-card rounded-2xl p-6 text-center">
              <p className="text-slate-400 text-sm mb-1">Room Code</p>
              <div className="flex items-center justify-center gap-3">
                <span className="font-rajdhani font-bold text-4xl tracking-[0.2em] text-amber-400">
                  {roomCode}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                  title="Copy code"
                >
                  {copied ? '✓' : '📋'}
                </button>
              </div>
              <div className="flex items-center justify-center gap-4 mt-3 text-sm text-slate-400">
                <span>⏱ {roomData.timeOption} min game</span>
                <span>👥 {roomData.players.length} player{roomData.players.length !== 1 ? 's' : ''}</span>
              </div>
            </div>

            {/* Players list */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-rajdhani font-semibold text-white mb-4">
                Players ({roomData.players.length}/6)
              </h3>
              <div className="space-y-3">
                {roomData.players.map(player => (
                  <div key={player.id} className="flex items-center gap-3">
                    <PlayerAvatar name={player.name} />
                    <div className="flex-1">
                      <span className="text-white font-medium">{player.name}</span>
                      {player.id === roomData.host && (
                        <span className="ml-2 text-xs bg-amber-600/30 text-amber-400 border border-amber-600/40 px-1.5 py-0.5 rounded-full">
                          HOST
                        </span>
                      )}
                      {player.id === myId && (
                        <span className="ml-2 text-xs text-slate-500">(you)</span>
                      )}
                    </div>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                ))}
                {roomData.players.length < 6 && (
                  <div className="flex items-center gap-3 opacity-30">
                    <div className="w-10 h-10 rounded-full border-2 border-dashed border-slate-600 flex items-center justify-center text-slate-600 text-lg">
                      +
                    </div>
                    <span className="text-slate-500 text-sm">Waiting for players...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              {isHost ? (
                <>
                  {!canStart && (
                    <p className="text-center text-slate-400 text-sm">
                      Waiting for at least 1 more player to join
                    </p>
                  )}
                  <Button
                    variant="primary"
                    fullWidth
                    size="lg"
                    onClick={handleStartGame}
                    disabled={!canStart}
                    className="neon-border"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <span>🏏</span>
                      Start Game ({roomData.players.length} Players)
                    </span>
                  </Button>
                  <Button
                    variant="secondary"
                    fullWidth
                    onClick={() => setShowShare(true)}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <span>📤</span>
                      Invite Friends
                    </span>
                  </Button>
                </>
              ) : (
                <div className="glass-card rounded-xl p-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-emerald-400">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-sm font-medium">Waiting for host to start the game...</span>
                  </div>
                </div>
              )}
              <Button variant="danger" fullWidth onClick={handleLeaveRoom} size="sm">
                Leave Room
              </Button>
            </div>
          </div>
        </div>

        <ShareModal isOpen={showShare} onClose={() => setShowShare(false)} roomCode={roomCode} />
      </div>
    )
  }

  return (
    <div className="min-h-screen stadium-bg flex flex-col">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <button
          onClick={() => navigate('/')}
          className="text-slate-400 hover:text-white flex items-center gap-1 text-sm transition-colors"
        >
          ← Home
        </button>
        <span className="font-rajdhani font-bold text-emerald-400">LOBBY</span>
        <div className="flex items-center gap-2">
          <PlayerAvatar name={user?.name || 'Guest'} size={8} />
          <span className="text-slate-300 text-sm hidden sm:block">{user?.name}</span>
        </div>
      </nav>

      <div className="flex-1 flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-lg">
          <h2 className="font-rajdhani font-bold text-3xl text-white text-center mb-6">
            Play <span className="gradient-text">Cricket Trump</span>
          </h2>

          {/* Tabs */}
          <div className="flex rounded-xl overflow-hidden border border-white/10 mb-6">
            <button
              className={`flex-1 py-3 font-rajdhani font-semibold text-sm tracking-wide transition-colors ${
                activeTab === 'create' ? 'bg-emerald-700 text-white' : 'bg-pitch-800/50 text-slate-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('create')}
            >
              CREATE ROOM
            </button>
            <button
              className={`flex-1 py-3 font-rajdhani font-semibold text-sm tracking-wide transition-colors ${
                activeTab === 'join' ? 'bg-emerald-700 text-white' : 'bg-pitch-800/50 text-slate-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('join')}
            >
              JOIN ROOM
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-700/50 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {activeTab === 'create' && (
            <div className="space-y-5 animate-slide-up">
              <div className="glass-card rounded-2xl p-5">
                <h3 className="font-rajdhani font-semibold text-white mb-3">Choose Game Duration</h3>
                <div className="grid grid-cols-3 gap-3">
                  {TIME_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setTimeOption(opt.value)}
                      className={`rounded-xl p-3 border text-center transition-all ${
                        timeOption === opt.value
                          ? 'border-emerald-500 bg-emerald-900/30'
                          : 'border-white/10 hover:border-white/30 bg-white/5'
                      }`}
                    >
                      <div className="text-2xl mb-1">{opt.icon}</div>
                      <div className={`font-rajdhani font-bold text-lg ${timeOption === opt.value ? 'text-emerald-400' : 'text-white'}`}>
                        {opt.label}
                      </div>
                      <div className="text-slate-500 text-xs mt-0.5">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <Button
                variant="primary"
                fullWidth
                size="lg"
                onClick={handleCreateRoom}
                disabled={isConnecting}
                className="neon-border"
              >
                {isConnecting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⟳</span>
                    Creating...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>🏏</span>
                    Create Room
                  </span>
                )}
              </Button>
            </div>
          )}

          {activeTab === 'join' && (
            <div className="space-y-5 animate-slide-up">
              <div className="glass-card rounded-2xl p-5">
                <h3 className="font-rajdhani font-semibold text-white mb-4">Enter Room Code</h3>
                <div className="flex gap-2 justify-center mb-2">
                  {joinCodeDigits.map((digit, i) => (
                    <input
                      key={i}
                      ref={el => joinInputRefs.current[i] = el}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleDigitChange(i, e.target.value)}
                      onKeyDown={e => handleDigitKeyDown(i, e)}
                      onPaste={i === 0 ? handlePaste : undefined}
                      className={`w-11 h-14 text-center font-rajdhani font-bold text-xl rounded-lg border outline-none transition-all ${
                        digit
                          ? 'border-emerald-500 bg-emerald-900/30 text-amber-400'
                          : 'border-white/20 bg-white/5 text-white'
                      } focus:border-emerald-400 focus:bg-emerald-900/20`}
                    />
                  ))}
                </div>
                <p className="text-slate-500 text-xs text-center">Paste or type the 6-character room code</p>
              </div>

              <Button
                variant="primary"
                fullWidth
                size="lg"
                onClick={handleJoinRoom}
                disabled={isConnecting || joinCodeDigits.join('').length < 6}
              >
                {isConnecting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⟳</span>
                    Joining...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>🚪</span>
                    Join Room
                  </span>
                )}
              </Button>

              {recentRooms.length > 0 && (
                <div>
                  <h4 className="text-slate-400 text-sm mb-2 font-medium">Recent Rooms</h4>
                  <div className="space-y-2">
                    {recentRooms.map(code => (
                      <button
                        key={code}
                        onClick={() => handleJoinRecent(code)}
                        className="w-full flex items-center justify-between p-3 glass-card rounded-lg hover:border-emerald-600/40 transition-colors border border-white/5"
                      >
                        <span className="font-rajdhani font-bold text-amber-400 tracking-widest">{code}</span>
                        <span className="text-slate-400 text-sm">Rejoin →</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
