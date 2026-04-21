import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import Button from '../components/ui/Button'
import AdBanner from '../components/ui/AdBanner'
import useAuthStore from '../store/authStore'
import useQuizStore from '../store/quizStore'
import { getSocket } from '../lib/socket'

const OPTION_LABELS = ['A', 'B', 'C', 'D']
const OPTION_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']
const OPTION_BG = ['#1e3a5f', '#064e3b', '#78350f', '#7f1d1d']

export default function QuizGame() {
  const navigate = useNavigate()
  const location = useLocation()
  const { roomCode: urlCode } = useParams()
  const { user } = useAuthStore()
  const {
    roomCode, roomData, myId, currentQuestion, questionResult, timeLeft,
    answeredCount, totalPlayers, hasAnswered, selectedAnswer, leaderboard, phase,
    setQuestion, setTimeLeft, setAnswered, setAnswerUpdate, setQuestionResult,
    setLeaderboard, updateRoom, setRoom, resetQuiz,
  } = useQuizStore()

  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const listenersAttached = useRef(false)

  useEffect(() => {
    const socket = getSocket()
    if (listenersAttached.current) return
    listenersAttached.current = true

    // 1. Attach ALL listeners FIRST (before emitting anything)
    socket.on('quiz_current_state', ({ question, room }) => {
      if (question) setQuestion(question)
      if (room) updateRoom(room)
    })

    socket.on('quiz_started', ({ question, room }) => {
      if (question) setQuestion(question)
      if (room) updateRoom(room)
    })

    socket.on('quiz_timer_tick', ({ timeLeft: t }) => setTimeLeft(t))

    socket.on('quiz_answer_update', ({ answeredCount: c, totalPlayers: t }) => {
      setAnswerUpdate(c, t)
    })

    socket.on('quiz_question_result', (result) => {
      setQuestionResult(result)
      setShowLeaderboard(true)
    })

    socket.on('quiz_next_question', ({ question, room }) => {
      updateRoom(room)
      setQuestion(question)
      setShowLeaderboard(false)
    })

    socket.on('quiz_ended', ({ leaderboard: lb }) => {
      setLeaderboard(lb)
    })

    // 2. Now that listeners are attached, try navigation state + request from server
    const navState = location.state
    if (navState?.question) {
      setQuestion(navState.question)
      if (navState.room) updateRoom(navState.room)
    }

    const code = roomCode || urlCode
    if (code) {
      socket.emit('quiz_get_current', { roomCode: code })
    }

    return () => {
      socket.off('quiz_current_state')
      socket.off('quiz_started')
      socket.off('quiz_timer_tick')
      socket.off('quiz_answer_update')
      socket.off('quiz_question_result')
      socket.off('quiz_next_question')
      socket.off('quiz_ended')
      listenersAttached.current = false
    }
  }, [])

  const handleAnswer = (idx) => {
    if (hasAnswered || phase !== 'question') return
    setAnswered(idx)
    const socket = getSocket()
    socket.emit('quiz_answer', { roomCode: roomCode || urlCode, playerId: myId || user?.id, answerIndex: idx })
  }

  const handleLeave = () => {
    const socket = getSocket()
    socket.emit('quiz_leave', { roomCode: roomCode || urlCode, playerId: myId || user?.id })
    resetQuiz()
    navigate('/quiz')
  }

  const handlePlayAgain = () => {
    resetQuiz()
    navigate('/quiz')
  }

  const urgent = timeLeft <= 5
  // Try myId first, then user.id — covers edge cases where store myId hasn't synced
  const myResult = questionResult?.playerAnswers?.[myId] || questionResult?.playerAnswers?.[user?.id]
  const myPoints = questionResult?.pointsAwarded?.[myId] ?? questionResult?.pointsAwarded?.[user?.id]

  // ─── ENDED ───────────────────────────────────────────────────────────────
  if (phase === 'ended' && leaderboard) {
    const medals = ['🥇', '🥈', '🥉']
    const myRank = leaderboard.findIndex(p => p.id === myId)
    const isWinner = myRank === 0

    return (
      <div className="min-h-screen stadium-bg flex flex-col">
        <nav className="flex items-center justify-center px-6 py-4 border-b border-white/5">
          <span className="font-rajdhani font-bold text-emerald-400">QUIZ RESULTS</span>
        </nav>
        <div className="flex-1 flex flex-col items-center px-4 py-8">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-3">{isWinner ? '🏆' : '🎯'}</div>
              <h2 className={`font-rajdhani font-bold text-3xl ${isWinner ? 'text-amber-400' : 'text-white'}`}>
                {isWinner ? 'YOU WIN!' : 'QUIZ COMPLETE'}
              </h2>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-rajdhani font-semibold text-white mb-4 text-center">Leaderboard</h3>
              <div className="space-y-2">
                {leaderboard.map((p, i) => {
                  const correct = p.answers?.filter(a => a.correct).length || 0
                  return (
                    <div key={p.id} className={`flex items-center gap-3 p-3 rounded-lg ${p.id === myId ? 'bg-emerald-900/30 border border-emerald-500/40' : 'bg-white/5'}`}>
                      <span className="text-xl w-8 text-center">{medals[i] || (i + 1)}</span>
                      <span className="text-white font-medium flex-1">{p.name} {p.id === myId && <span className="text-emerald-400 text-xs">(YOU)</span>}</span>
                      <span className="text-slate-400 text-xs">{correct}/{leaderboard[0]?.answers?.length || 0}</span>
                      <span className="text-amber-400 font-bold font-rajdhani text-lg">{p.score}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <AdBanner variant="banner" slot="" className="rounded-xl overflow-hidden opacity-80" />

            <div className="flex gap-3">
              <Button variant="primary" fullWidth size="lg" onClick={handlePlayAgain} className="neon-border">
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
          <span className="text-slate-400 text-sm font-rajdhani">
            Q{(currentQuestion?.index ?? 0) + 1}/{currentQuestion?.total || '?'}
          </span>
          <div className={`px-3 py-1 rounded-full border text-sm font-bold font-rajdhani ${
            urgent ? 'border-red-500 bg-red-900/30 text-red-400' : 'border-emerald-500/40 bg-emerald-900/20 text-emerald-400'
          }`}>
            ⏱ {timeLeft}s
          </div>
        </div>
        <button onClick={() => setShowLeaderboard(!showLeaderboard)} className="text-slate-400 hover:text-white text-sm">
          📊
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-white/5">
        <div className="h-full bg-emerald-500 transition-all" style={{ width: `${((currentQuestion?.index ?? 0) + 1) / (currentQuestion?.total || 1) * 100}%` }} />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6">
        <div className="w-full max-w-lg space-y-6">

          {/* Category + difficulty badge */}
          {currentQuestion && (
            <div className="flex items-center justify-center gap-2">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                currentQuestion.difficulty === 'hard' ? 'border-red-500/40 text-red-400 bg-red-900/20' :
                currentQuestion.difficulty === 'medium' ? 'border-amber-500/40 text-amber-400 bg-amber-900/20' :
                'border-emerald-500/40 text-emerald-400 bg-emerald-900/20'
              }`}>
                {currentQuestion.difficulty?.toUpperCase()}
              </span>
            </div>
          )}

          {/* Question */}
          <div className="glass-card rounded-2xl p-6 text-center">
            <h2 className="text-white font-rajdhani font-bold text-xl leading-snug">
              {currentQuestion?.question || 'Loading...'}
            </h2>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 gap-3">
            {currentQuestion?.options?.map((opt, idx) => {
              // During reveal, use server's myResult.answer (reliable) instead of local selectedAnswer (can be stale in solo)
              const myAnswerIdx = phase === 'reveal' ? myResult?.answer : selectedAnswer
              const isSelected = myAnswerIdx === idx
              const isCorrect = phase === 'reveal' && questionResult?.correctAnswer === idx
              const isWrong = phase === 'reveal' && isSelected && !isCorrect

              let borderColor = OPTION_COLORS[idx] + '40'
              let bgColor = OPTION_BG[idx] + '40'
              if (isCorrect) { borderColor = '#10b981'; bgColor = '#064e3b' }
              if (isWrong) { borderColor = '#ef4444'; bgColor = '#7f1d1d' }
              if (isSelected && phase === 'question') { borderColor = OPTION_COLORS[idx]; bgColor = OPTION_BG[idx] }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={hasAnswered || phase === 'reveal'}
                  className="w-full text-left rounded-xl border-2 p-4 transition-all active:scale-[0.98]"
                  style={{ borderColor, backgroundColor: bgColor }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
                      style={{ backgroundColor: OPTION_COLORS[idx] + '30', color: OPTION_COLORS[idx] }}>
                      {OPTION_LABELS[idx]}
                    </div>
                    <span className="text-white font-medium flex-1">{opt}</span>
                    {isCorrect && <span className="text-emerald-400 text-lg">✓</span>}
                    {isWrong && <span className="text-red-400 text-lg">✗</span>}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Status / answered count */}
          {phase === 'question' && hasAnswered && (
            <div className="text-center text-slate-400 text-sm">
              <span className="animate-pulse">Waiting for others... ({answeredCount}/{totalPlayers || roomData?.players?.length || 1})</span>
            </div>
          )}

          {/* Reveal result */}
          {phase === 'reveal' && questionResult && (
            <div className={`glass-card rounded-xl p-4 text-center border ${myResult?.correct ? 'border-emerald-500/50' : 'border-red-500/50'}`}>
              <div className="text-2xl mb-1">{myResult?.correct ? '🎉' : '😅'}</div>
              <div className={`font-rajdhani font-bold text-lg ${myResult?.correct ? 'text-emerald-400' : 'text-red-400'}`}>
                {myResult?.correct ? `Correct! +${myPoints || 0} pts` : `Wrong! The answer was ${questionResult.correctOption}`}
              </div>
              {myResult?.correct && myResult.elapsed && (
                <div className="text-slate-400 text-xs mt-1">Answered in {myResult.elapsed.toFixed(1)}s</div>
              )}
            </div>
          )}

          {/* Mini leaderboard during reveal */}
          {showLeaderboard && questionResult?.leaderboard && (
            <div className="glass-card rounded-xl p-4">
              <h4 className="text-white font-rajdhani font-semibold text-sm mb-2 text-center">Leaderboard</h4>
              <div className="space-y-1">
                {questionResult.leaderboard.map((p, i) => (
                  <div key={p.id} className={`flex items-center justify-between text-sm px-2 py-1 rounded ${p.id === myId ? 'bg-emerald-900/20' : ''}`}>
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
