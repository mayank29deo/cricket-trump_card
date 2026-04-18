import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import Button from '../components/ui/Button'
import AdBanner from '../components/ui/AdBanner'
import useAuthStore from '../store/authStore'
import useHintQuizStore from '../store/hintQuizStore'
import { getSocket } from '../lib/socket'

export default function HintQuizGame() {
  const navigate = useNavigate()
  const location = useLocation()
  const { roomCode: urlCode } = useParams()
  const { user } = useAuthStore()
  const {
    roomCode, roomData, myId, currentClues, displayText, hintsRemaining,
    typedAnswer, hasAnswered, answeredCount, totalPlayers,
    questionResult, timeLeft, questionIndex, questionTotal, difficulty,
    leaderboard, phase,
    setQuestion, setDisplayText, setHintsRemaining, setTypedAnswer,
    setAnswered, setAnswerUpdate, setTimeLeft, setQuestionResult,
    setLeaderboard, updateRoom, setRoom, resetHintQuiz,
  } = useHintQuizStore()

  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const listenersAttached = useRef(false)
  const inputRef = useRef(null)

  useEffect(() => {
    const socket = getSocket()
    if (listenersAttached.current) return
    listenersAttached.current = true

    socket.on('hquiz_current_state', ({ question, room }) => {
      if (question) setQuestion(question)
      if (room) updateRoom(room)
    })
    socket.on('hquiz_started', ({ question, room }) => {
      if (question) setQuestion(question)
      if (room) updateRoom(room)
    })
    socket.on('hquiz_timer_tick', ({ timeLeft: t }) => setTimeLeft(t))
    socket.on('hquiz_hint_result', ({ newDisplay, hintsRemaining: hr }) => {
      setDisplayText(newDisplay)
      setHintsRemaining(hr)
    })
    socket.on('hquiz_answer_update', ({ answeredCount: c, totalPlayers: t }) => setAnswerUpdate(c, t))
    socket.on('hquiz_question_result', (result) => {
      setQuestionResult(result)
      setShowLeaderboard(true)
    })
    socket.on('hquiz_next_question', ({ question, room }) => {
      updateRoom(room)
      setQuestion(question)
      setShowLeaderboard(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    })
    socket.on('hquiz_ended', ({ leaderboard: lb }) => setLeaderboard(lb))

    // Read nav state + request from server
    const navState = location.state
    if (navState?.question) {
      setQuestion(navState.question)
      if (navState.room) updateRoom(navState.room)
    }
    const code = roomCode || urlCode
    if (code) socket.emit('hquiz_get_current', { roomCode: code })

    return () => {
      socket.off('hquiz_current_state'); socket.off('hquiz_started')
      socket.off('hquiz_timer_tick'); socket.off('hquiz_hint_result')
      socket.off('hquiz_answer_update'); socket.off('hquiz_question_result')
      socket.off('hquiz_next_question'); socket.off('hquiz_ended')
      listenersAttached.current = false
    }
  }, [])

  const handleUseHint = () => {
    if (hintsRemaining <= 0 || hasAnswered || phase !== 'question') return
    const socket = getSocket()
    socket.emit('hquiz_use_hint', { roomCode: roomCode || urlCode, playerId: myId || user?.id })
  }

  const handleSubmitAnswer = () => {
    if (hasAnswered || !typedAnswer.trim() || phase !== 'question') return
    setAnswered()
    const socket = getSocket()
    socket.emit('hquiz_answer', { roomCode: roomCode || urlCode, playerId: myId || user?.id, answer: typedAnswer.trim() })
  }

  const handleLeave = () => {
    const socket = getSocket()
    socket.emit('hquiz_leave', { roomCode: roomCode || urlCode, playerId: myId || user?.id })
    resetHintQuiz()
    navigate('/quiz')
  }

  const urgent = timeLeft <= 5
  const myResult = questionResult?.playerAnswers?.[myId] || questionResult?.playerAnswers?.[user?.id]
  const myPoints = questionResult?.pointsAwarded?.[myId] ?? questionResult?.pointsAwarded?.[user?.id]

  // ─── ENDED ───────────────────────────────────────────────────────────────
  if (phase === 'ended' && leaderboard) {
    const medals = ['🥇', '🥈', '🥉']
    const myRank = leaderboard.findIndex(p => p.id === (myId || user?.id))
    const isWinner = myRank === 0
    return (
      <div className="min-h-screen stadium-bg flex flex-col">
        <nav className="flex items-center justify-center px-6 py-4 border-b border-white/5">
          <span className="font-rajdhani font-bold text-emerald-400">HINT QUIZ RESULTS</span>
        </nav>
        <div className="flex-1 flex flex-col items-center px-4 py-8">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-3">{isWinner ? '🏆' : '🧠'}</div>
              <h2 className={`font-rajdhani font-bold text-3xl ${isWinner ? 'text-amber-400' : 'text-white'}`}>
                {isWinner ? 'YOU WIN!' : 'QUIZ COMPLETE'}
              </h2>
            </div>
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-rajdhani font-semibold text-white mb-4 text-center">Leaderboard</h3>
              <div className="space-y-2">
                {leaderboard.map((p, i) => {
                  const correct = p.answers?.filter(a => a.correct).length || 0
                  const totalHints = p.answers?.reduce((s, a) => s + (a.hintsUsed || 0), 0) || 0
                  return (
                    <div key={p.id} className={`flex items-center gap-3 p-3 rounded-lg ${p.id === (myId || user?.id) ? 'bg-emerald-900/30 border border-emerald-500/40' : 'bg-white/5'}`}>
                      <span className="text-xl w-8 text-center">{medals[i] || (i + 1)}</span>
                      <span className="text-white font-medium flex-1">{p.name}</span>
                      <span className="text-slate-400 text-xs">{correct}✓ {totalHints}💡</span>
                      <span className="text-amber-400 font-bold font-rajdhani text-lg">{p.score}</span>
                    </div>
                  )
                })}
              </div>
            </div>
            <AdBanner variant="banner" slot="" className="rounded-xl overflow-hidden opacity-80" />
            <div className="flex gap-3">
              <Button variant="primary" fullWidth size="lg" onClick={() => { resetHintQuiz(); navigate('/quiz') }} className="neon-border">
                <span className="flex items-center justify-center gap-2"><span>🔄</span> Play Again</span>
              </Button>
              <Button variant="ghost" fullWidth size="lg" onClick={() => navigate('/')}>Home</Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ─── QUESTION / REVEAL ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen stadium-bg flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <button onClick={handleLeave} className="text-slate-400 hover:text-white text-sm">✕</button>
        <div className="flex items-center gap-3">
          <span className="text-slate-400 text-sm font-rajdhani">Q{questionIndex + 1}/{questionTotal || '?'}</span>
          <div className={`px-3 py-1 rounded-full border text-sm font-bold font-rajdhani ${urgent ? 'border-red-500 bg-red-900/30 text-red-400' : 'border-emerald-500/40 bg-emerald-900/20 text-emerald-400'}`}>
            ⏱ {timeLeft}s
          </div>
        </div>
        <button onClick={() => setShowLeaderboard(!showLeaderboard)} className="text-slate-400 hover:text-white text-sm">📊</button>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-white/5">
        <div className="h-full bg-emerald-500 transition-all" style={{ width: `${(questionIndex + 1) / (questionTotal || 1) * 100}%` }} />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6">
        <div className="w-full max-w-lg space-y-5">

          {/* Difficulty badge */}
          {difficulty && (
            <div className="flex items-center justify-center">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                difficulty === 'hard' ? 'border-red-500/40 text-red-400 bg-red-900/20' :
                difficulty === 'medium' ? 'border-amber-500/40 text-amber-400 bg-amber-900/20' :
                'border-emerald-500/40 text-emerald-400 bg-emerald-900/20'
              }`}>
                {difficulty?.toUpperCase()}
              </span>
            </div>
          )}

          {/* Clues */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="text-slate-400 text-xs font-semibold tracking-widest mb-3 text-center">CLUES</h3>
            <ul className="space-y-2">
              {(currentClues || []).map((clue, i) => (
                <li key={i} className="flex items-start gap-2 text-white text-sm">
                  <span className="text-emerald-400 mt-0.5">•</span>
                  <span>{clue}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Letter display */}
          <div className="glass-card rounded-2xl p-6 text-center">
            <h3 className="text-slate-400 text-xs font-semibold tracking-widest mb-4">GUESS THE CRICKETER</h3>
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {(phase === 'reveal' ? (questionResult?.correctAnswer || displayText) : displayText).split('').map((char, i) => {
                if (char === ' ') return <div key={i} className="w-3" />
                const isBlank = char === '_'
                const isRevealed = phase === 'reveal'
                return (
                  <div
                    key={i}
                    className={`w-8 h-10 flex items-center justify-center rounded-md font-rajdhani font-bold text-lg border ${
                      isRevealed ? 'border-emerald-500/60 bg-emerald-900/30 text-emerald-400' :
                      isBlank ? 'border-white/20 bg-white/5 text-white/20' :
                      'border-amber-500/60 bg-amber-900/30 text-amber-400'
                    }`}
                  >
                    {isBlank ? '' : char}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Hint button */}
          {phase === 'question' && !hasAnswered && (
            <div className="flex justify-center">
              <button
                onClick={handleUseHint}
                disabled={hintsRemaining <= 0}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                  hintsRemaining > 0
                    ? 'border-amber-500/50 bg-amber-900/20 text-amber-400 hover:bg-amber-900/40 active:scale-95'
                    : 'border-white/10 bg-white/5 text-slate-500 cursor-not-allowed'
                }`}
              >
                <span>💡</span>
                {hintsRemaining > 0 ? `Use Hint (${hintsRemaining} left)` : 'No hints left'}
                <span className="text-xs text-slate-500">(-2 pts)</span>
              </button>
            </div>
          )}

          {/* Answer input */}
          {phase === 'question' && !hasAnswered && (
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={typedAnswer}
                onChange={e => setTypedAnswer(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmitAnswer()}
                placeholder="Type cricketer name..."
                autoFocus
                className="flex-1 bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 font-rajdhani text-lg"
              />
              <Button variant="primary" onClick={handleSubmitAnswer} disabled={!typedAnswer.trim()}>
                Submit
              </Button>
            </div>
          )}

          {/* Waiting after answer */}
          {phase === 'question' && hasAnswered && (
            <div className="text-center text-slate-400 text-sm animate-pulse">
              Answer submitted, waiting for others...
            </div>
          )}

          {/* Reveal result */}
          {phase === 'reveal' && questionResult && (
            <div className={`glass-card rounded-xl p-4 text-center border ${myResult?.correct ? 'border-emerald-500/50' : 'border-red-500/50'}`}>
              <div className="text-2xl mb-1">{myResult?.correct ? '🎉' : '😅'}</div>
              <div className={`font-rajdhani font-bold text-lg ${myResult?.correct ? 'text-emerald-400' : 'text-red-400'}`}>
                {myResult?.correct
                  ? `Correct! +${myPoints || 0} pts ${myResult.hintsUsed > 0 ? `(${myResult.hintsUsed} hint${myResult.hintsUsed > 1 ? 's' : ''} used)` : '(no hints!)'}`
                  : `Wrong! The answer was ${questionResult.correctAnswer}`
                }
              </div>
            </div>
          )}

          {/* Mini leaderboard */}
          {showLeaderboard && questionResult?.leaderboard && (
            <div className="glass-card rounded-xl p-4">
              <h4 className="text-white font-rajdhani font-semibold text-sm mb-2 text-center">Leaderboard</h4>
              <div className="space-y-1">
                {questionResult.leaderboard.map((p, i) => (
                  <div key={p.id} className={`flex items-center justify-between text-sm px-2 py-1 rounded ${p.id === (myId || user?.id) ? 'bg-emerald-900/20' : ''}`}>
                    <span className="text-slate-400">{i + 1}. {p.name}</span>
                    <span className="text-amber-400 font-bold">{p.score}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
