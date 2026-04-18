import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import useAuthStore from '../store/authStore'
import useQuizStore from '../store/quizStore'
import { connectSocket, getSocket, resetSocket, PRIMARY_URL, FALLBACK_URL, setActiveUrl } from '../lib/socket'

const INTL_CATS = [
  { key: 'international_general', label: 'General', icon: '🏏' },
  { key: 'international_test', label: 'Test Cricket', icon: '🏟️' },
  { key: 'international_odi', label: 'ODIs', icon: '🏆' },
  { key: 'international_t20i', label: 'T20Is', icon: '⚡' },
  { key: 'guess_cricketer', label: 'Guess the Cricketer', icon: '🤔' },
]

const IPL_CATS = [
  { key: 'ipl_general', label: 'General', icon: '🏏' },
  { key: 'ipl_mi', label: 'Mumbai Indians', icon: '💙' },
  { key: 'ipl_csk', label: 'Chennai Super Kings', icon: '💛' },
  { key: 'ipl_rcb', label: 'Royal Challengers', icon: '❤️' },
  { key: 'ipl_kkr', label: 'Knight Riders', icon: '💜' },
  { key: 'ipl_dc', label: 'Delhi Capitals', icon: '🔵' },
  { key: 'ipl_srh', label: 'Sunrisers Hyderabad', icon: '🧡' },
  { key: 'ipl_rr', label: 'Rajasthan Royals', icon: '💗' },
  { key: 'ipl_pbks', label: 'Punjab Kings', icon: '🔴' },
  { key: 'ipl_gt', label: 'Gujarat Titans', icon: '🩵' },
  { key: 'ipl_lsg', label: 'Lucknow Super Giants', icon: '🩶' },
]

const Q_COUNTS = [5, 10, 15, 20]

function PlayerAvatar({ name, size = 8 }) {
  let hash = 0
  for (let i = 0; i < (name || '').length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  const colors = ['#1e40af', '#7c3aed', '#b45309', '#065f46', '#9f1239', '#1e3a5f']
  const bg = colors[Math.abs(hash) % colors.length]
  return (
    <div className={`w-${size} h-${size} rounded-full flex items-center justify-center text-white font-bold`} style={{ backgroundColor: bg, width: size * 4, height: size * 4, fontSize: size * 1.5 }}>
      {name?.[0]?.toUpperCase() || '?'}
    </div>
  )
}

export default function QuizLobby() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { roomData, roomCode, myId, setRoom, updateRoom, resetQuiz, setQuestion, setSolo } = useQuizStore()

  const [view, setView] = useState('main') // main | waiting
  const [activeTab, setActiveTab] = useState('create') // create | join
  const [deckTab, setDeckTab] = useState('international')
  const [selectedCats, setSelectedCats] = useState([])
  const [questionCount, setQuestionCount] = useState(10)
  const [joinCode, setJoinCode] = useState('')
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)
  const listenersAttached = useRef(false)

  const displayName = nickname.trim() || user?.name || 'Player'

  useEffect(() => {
    return () => { resetQuiz() }
  }, [])

  function attachListeners(socket) {
    if (listenersAttached.current) return
    listenersAttached.current = true

    socket.on('quiz_room_created', ({ roomCode: code, room }) => {
      setRoom(code, room, user.id)
      setView('waiting')
      setIsConnecting(false)
    })
    socket.on('quiz_room_joined', ({ room, myId: id }) => {
      setRoom(room.code, room, id)
      setView('waiting')
      setIsConnecting(false)
    })
    socket.on('quiz_room_updated', ({ room }) => {
      updateRoom(room)
    })
    socket.on('quiz_started', ({ roomCode: code, question, room }) => {
      setRoom(code, room, myId || user.id)
      setQuestion(question)
      // Small delay to let store flush before navigating to QuizGame
      setTimeout(() => navigate(`/quiz/play/${code}`), 50)
    })
    socket.on('error', ({ message }) => {
      setError(message)
      setIsConnecting(false)
    })
  }

  async function connectAndEmit(emitFn) {
    setError('')
    setIsConnecting(true)
    resetSocket()

    let workingUrl = null
    try {
      const res = await fetch(`${PRIMARY_URL}/health`, { signal: AbortSignal.timeout(6000) })
      if (res.ok) workingUrl = PRIMARY_URL
    } catch {}
    if (!workingUrl && FALLBACK_URL) {
      try {
        const res = await fetch(`${FALLBACK_URL}/health`, { signal: AbortSignal.timeout(10000) })
        if (res.ok) workingUrl = FALLBACK_URL
      } catch {}
    }
    if (!workingUrl) {
      setError('Server unreachable. Check your connection.')
      setIsConnecting(false)
      return
    }
    setActiveUrl(workingUrl)
    const socket = connectSocket()
    attachListeners(socket)
    const doEmit = () => emitFn(socket)
    socket.connected ? doEmit() : socket.once('connect', doEmit)
  }

  const handleCreateRoom = () => {
    if (!user) return
    if (selectedCats.length === 0) { setError('Select at least one category'); return }
    connectAndEmit((s) => s.emit('quiz_create_room', {
      player: { id: user.id, name: displayName },
      categories: selectedCats,
      questionCount,
    }))
  }

  const handleSoloStart = () => {
    if (!user) return
    if (selectedCats.length === 0) { setError('Select at least one category'); return }
    setSolo(true)
    connectAndEmit((s) => s.emit('quiz_solo_start', {
      player: { id: user.id, name: displayName },
      categories: selectedCats,
      questionCount,
    }))
  }

  const handleJoinRoom = () => {
    if (!user) return
    const code = joinCode.trim().toUpperCase()
    if (code.length < 4) { setError('Enter a valid room code'); return }
    connectAndEmit((s) => s.emit('quiz_join_room', {
      roomCode: code,
      player: { id: user.id, name: displayName },
    }))
  }

  const handleStartQuiz = () => {
    const socket = getSocket()
    socket.emit('quiz_start', { roomCode, playerId: myId })
  }

  const handleLeave = () => {
    const socket = getSocket()
    socket.emit('quiz_leave', { roomCode, playerId: myId })
    setView('main')
    resetQuiz()
    listenersAttached.current = false
  }

  const toggleCat = (key) => {
    setSelectedCats(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])
  }

  const isHost = roomData?.host === myId
  const canStart = isHost && roomData?.players?.length >= 1
  const cats = deckTab === 'international' ? INTL_CATS : IPL_CATS

  // ─── Waiting room ────────────────────────────────────────────────────────
  if (view === 'waiting' && roomData) {
    return (
      <div className="min-h-screen stadium-bg flex flex-col">
        <nav className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <button onClick={handleLeave} className="text-slate-400 hover:text-white text-sm">← Leave</button>
          <span className="font-rajdhani font-bold text-emerald-400">QUIZ ROOM</span>
          <div />
        </nav>
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
          <div className="w-full max-w-md space-y-6">
            <div className="glass-card rounded-2xl p-6 text-center">
              <p className="text-slate-400 text-sm mb-1">Room Code</p>
              <span className="font-rajdhani font-bold text-4xl tracking-[0.2em] text-amber-400">{roomCode}</span>
              <p className="text-slate-400 text-sm mt-2">{roomData.questionCount} questions</p>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-rajdhani font-semibold text-white mb-4">Players ({roomData.players.length}/6)</h3>
              <div className="space-y-3">
                {roomData.players.map(p => (
                  <div key={p.id} className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
                    <PlayerAvatar name={p.name} size={8} />
                    <span className="text-white font-medium flex-1">{p.name}</span>
                    <span className="text-emerald-400 text-sm font-bold">{p.score} pts</span>
                    {p.id === roomData.host && <span className="text-amber-400 text-xs font-bold bg-amber-900/30 px-2 py-0.5 rounded">HOST</span>}
                  </div>
                ))}
              </div>
            </div>

            {isHost ? (
              <Button variant="primary" fullWidth size="lg" onClick={handleStartQuiz} disabled={!canStart} className="neon-border">
                <span className="flex items-center justify-center gap-2">
                  <span>🧠</span> Start Quiz
                </span>
              </Button>
            ) : (
              <div className="glass-card rounded-xl p-4 text-center">
                <div className="flex items-center justify-center gap-2 text-emerald-400">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-sm">Waiting for host to start...</span>
                </div>
              </div>
            )}
            <Button variant="danger" fullWidth onClick={handleLeave} size="sm">Leave Room</Button>
          </div>
        </div>
      </div>
    )
  }

  // ─── Main lobby ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen stadium-bg flex flex-col">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <button onClick={() => navigate('/')} className="text-slate-400 hover:text-white text-sm">← Home</button>
        <span className="font-rajdhani font-bold text-emerald-400">CRICKET QUIZ</span>
        <div className="flex items-center gap-2">
          <PlayerAvatar name={user?.name || 'Guest'} size={8} />
        </div>
      </nav>

      <div className="flex-1 flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-lg">
          <h2 className="font-rajdhani font-bold text-3xl text-white text-center mb-6">
            Cricket <span className="gradient-text">Quiz</span>
          </h2>

          {/* Tabs */}
          <div className="flex rounded-xl overflow-hidden border border-white/10 mb-6">
            {['create', 'join'].map(t => (
              <button key={t}
                className={`flex-1 py-3 font-rajdhani font-semibold text-sm tracking-wide transition-colors ${activeTab === t ? 'bg-emerald-700 text-white' : 'bg-pitch-800/50 text-slate-400 hover:text-white'}`}
                onClick={() => setActiveTab(t)}
              >
                {t === 'create' ? 'CREATE / SOLO' : 'JOIN ROOM'}
              </button>
            ))}
          </div>

          {error && <div className="mb-4 p-3 bg-red-900/30 border border-red-700/50 rounded-lg text-red-400 text-sm">{error}</div>}

          {activeTab === 'create' && (
            <div className="space-y-5 animate-slide-up">
              {/* Nickname */}
              <div className="glass-card rounded-2xl p-5">
                <h3 className="font-rajdhani font-semibold text-white mb-1">Your Name <span className="text-slate-500 text-sm">(optional)</span></h3>
                <input type="text" maxLength={20} value={nickname} onChange={e => setNickname(e.target.value)}
                  placeholder={user?.name || 'Your name'}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 font-rajdhani"
                />
              </div>

              {/* Deck tabs */}
              <div className="glass-card rounded-2xl p-5">
                <h3 className="font-rajdhani font-semibold text-white mb-3">Choose Categories</h3>
                <div className="flex rounded-lg overflow-hidden border border-white/10 mb-4">
                  {[{ k: 'international', l: '🌍 International' }, { k: 'ipl', l: '🏆 IPL' }].map(d => (
                    <button key={d.k}
                      className={`flex-1 py-2 text-sm font-semibold transition-colors ${deckTab === d.k ? 'bg-emerald-700 text-white' : 'bg-white/5 text-slate-400'}`}
                      onClick={() => { setDeckTab(d.k); setSelectedCats([]) }}
                    >
                      {d.l}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {cats.map(c => (
                    <button key={c.key} onClick={() => toggleCat(c.key)}
                      className={`rounded-lg p-3 border text-left text-sm transition-all ${
                        selectedCats.includes(c.key)
                          ? 'border-emerald-500 bg-emerald-900/30 text-emerald-400'
                          : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/30'
                      }`}
                    >
                      <span className="mr-1">{c.icon}</span> {c.label}
                    </button>
                  ))}
                </div>
                {selectedCats.length > 0 && (
                  <p className="text-emerald-400 text-xs mt-2">{selectedCats.length} selected</p>
                )}
              </div>

              {/* Question count */}
              <div className="glass-card rounded-2xl p-5">
                <h3 className="font-rajdhani font-semibold text-white mb-3">Number of Questions</h3>
                <div className="flex gap-3">
                  {Q_COUNTS.map(n => (
                    <button key={n} onClick={() => setQuestionCount(n)}
                      className={`flex-1 py-3 rounded-xl border text-center font-rajdhani font-bold text-lg transition-all ${
                        questionCount === n ? 'border-emerald-500 bg-emerald-900/30 text-emerald-400' : 'border-white/10 bg-white/5 text-slate-400'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <Button variant="primary" fullWidth size="lg" onClick={handleCreateRoom} disabled={isConnecting} className="neon-border">
                {isConnecting ? <span className="animate-spin">⟳</span> : <span className="flex items-center justify-center gap-2"><span>🏏</span> Create Quiz Room</span>}
              </Button>

              <div className="relative flex items-center gap-3 py-1">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-slate-500 text-xs font-semibold tracking-wider">OR PLAY SOLO</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              <Button variant="secondary" fullWidth size="lg" onClick={handleSoloStart} disabled={isConnecting}>
                {isConnecting ? <span className="animate-spin">⟳</span> : <span className="flex items-center justify-center gap-2"><span>🧠</span> Solo Quiz</span>}
              </Button>
            </div>
          )}

          {activeTab === 'join' && (
            <div className="space-y-5 animate-slide-up">
              <div className="glass-card rounded-2xl p-5">
                <h3 className="font-rajdhani font-semibold text-white mb-1">Your Name</h3>
                <input type="text" maxLength={20} value={nickname} onChange={e => setNickname(e.target.value)}
                  placeholder={user?.name || 'Your name'}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 font-rajdhani mb-4"
                />
                <h3 className="font-rajdhani font-semibold text-white mb-1">Room Code</h3>
                <input type="text" maxLength={6} value={joinCode}
                  onChange={e => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="e.g. AB12CD"
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-amber-400 placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 font-rajdhani text-xl font-bold text-center tracking-[0.3em]"
                />
              </div>
              <Button variant="primary" fullWidth size="lg" onClick={handleJoinRoom} disabled={isConnecting} className="neon-border">
                {isConnecting ? <span className="animate-spin">⟳</span> : <span className="flex items-center justify-center gap-2"><span>⟶</span> Join Quiz Room</span>}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
