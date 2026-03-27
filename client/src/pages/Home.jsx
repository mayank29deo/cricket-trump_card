import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Modal from '../components/ui/Modal'
import Button from '../components/ui/Button'
import useAuthStore from '../store/authStore'

const TAGLINES = [
  'Battle with legendary cricketers. Choose your stat. Dominate the pitch.',
  'Remember those afternoons? Shuffling cards, arguing over Sachin\'s average — it\'s back.',
  'The cricket trump cards you played as a kid, now with your friends online.',
  'Tendulkar vs Bradman. Warne vs Murali. You decide who wins.',
  'Every card a memory. Every stat a battle. Every round a story.',
]

const HOW_TO_PLAY_RULES = [
  {
    step: 1,
    title: 'Get Your Cards',
    desc: '52 legendary cricket players are shuffled and dealt equally among all players.'
  },
  {
    step: 2,
    title: 'Choose a Stat',
    desc: 'The active player picks one stat (Batting Avg, Strike Rate, Centuries, Runs, Wickets, or Catches) for all top cards to compete on.'
  },
  {
    step: 3,
    title: 'Compare & Win',
    desc: 'The player with the highest value for that stat wins all the played cards and adds them to their hand.'
  },
  {
    step: 4,
    title: 'Ties Go Neutral',
    desc: 'If multiple players tie, the cards go to a neutral pile. The next round winner takes the neutral pile too!'
  },
  {
    step: 5,
    title: 'Collect All Cards',
    desc: 'The player who collects all 52 cards (or has the most when time runs out) wins the game!'
  }
]

function FloatingBall({ style }) {
  return (
    <div
      className="cricket-ball absolute opacity-30 animate-float"
      style={style}
    />
  )
}

function TickerItem({ icon, text }) {
  return (
    <div className="flex items-center gap-2 px-6">
      <span className="text-lg">{icon}</span>
      <span className="text-slate-400 text-sm font-medium whitespace-nowrap">{text}</span>
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const [showHowTo, setShowHowTo] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [taglineIndex, setTaglineIndex] = useState(0)
  const [taglineFade, setTaglineFade] = useState(true)
  const { user } = useAuthStore()

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out
      setTaglineFade(false)
      setTimeout(() => {
        setTaglineIndex(i => (i + 1) % TAGLINES.length)
        // Fade in
        setTaglineFade(true)
      }, 500)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const handlePlay = () => {
    if (user) {
      navigate('/lobby')
    } else {
      navigate('/auth')
    }
  }

  return (
    <div className="min-h-screen stadium-bg flex flex-col overflow-hidden relative">
      {/* Floating Balls */}
      <FloatingBall style={{ top: '10%', left: '5%', width: 30, height: 30, animationDelay: '0s' }} />
      <FloatingBall style={{ top: '20%', right: '8%', width: 50, height: 50, animationDelay: '0.5s' }} />
      <FloatingBall style={{ top: '50%', left: '3%', width: 25, height: 25, animationDelay: '1s' }} />
      <FloatingBall style={{ top: '70%', right: '5%', width: 40, height: 40, animationDelay: '1.5s' }} />
      <FloatingBall style={{ top: '35%', left: '90%', width: 20, height: 20, animationDelay: '2s' }} />
      <FloatingBall style={{ top: '80%', left: '15%', width: 35, height: 35, animationDelay: '0.8s' }} />
      <FloatingBall style={{ top: '15%', left: '50%', width: 15, height: 15, animationDelay: '1.2s' }} />

      {/* Gradient overlay lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
        {/* Pitch lines */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-60 opacity-10"
          style={{ background: 'linear-gradient(to top, rgba(16,185,129,0.4), transparent)', borderLeft: '1px solid rgba(16,185,129,0.3)', borderRight: '1px solid rgba(16,185,129,0.3)' }} />
      </div>

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏏</span>
          <span className="font-rajdhani font-bold text-emerald-400 tracking-wider text-lg">CRICKET TRUMP</span>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-sm font-bold">
                {user.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="text-slate-300 text-sm hidden sm:block">{user.name}</span>
            </div>
          ) : (
            <Button variant="secondary" size="sm" onClick={() => navigate('/auth')}>Sign In</Button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center relative z-10">
        <div className={`transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-emerald-900/40 border border-emerald-700/50 rounded-full px-4 py-1.5 mb-6">
            <span className="text-sm">🏆</span>
            <span className="text-emerald-400 text-sm font-semibold tracking-wide">MULTIPLAYER CARD GAME</span>
          </div>

          {/* Title */}
          <h1 className="font-rajdhani font-bold leading-none mb-2">
            <span className="block text-5xl sm:text-7xl md:text-8xl gradient-text">CRICKET</span>
            <span className="block text-4xl sm:text-6xl md:text-7xl text-white">TRUMP CARD</span>
          </h1>

          {/* Rotating tagline */}
          <p
            className="text-slate-400 text-lg sm:text-xl mt-4 mb-8 max-w-md mx-auto leading-relaxed italic"
            style={{
              transition: 'opacity 0.5s ease, transform 0.5s ease',
              opacity: taglineFade ? 1 : 0,
              transform: taglineFade ? 'translateY(0)' : 'translateY(6px)',
              minHeight: '3.5rem'
            }}
          >
            {TAGLINES[taglineIndex]}
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="primary"
              size="xl"
              onClick={handlePlay}
              className="neon-border w-full sm:w-auto min-w-[180px]"
            >
              <span className="flex items-center gap-2">
                <span>🏏</span>
                PLAY NOW
              </span>
            </Button>
            <Button
              variant="secondary"
              size="xl"
              onClick={() => navigate('/leaderboard')}
              className="w-full sm:w-auto min-w-[180px]"
            >
              <span className="flex items-center gap-2">
                <span>🏆</span>
                LEADERBOARD
              </span>
            </Button>
            <Button
              variant="ghost"
              size="xl"
              onClick={() => setShowHowTo(true)}
              className="w-full sm:w-auto min-w-[180px]"
            >
              <span className="flex items-center gap-2">
                <span>❓</span>
                HOW TO PLAY
              </span>
            </Button>
          </div>
        </div>

        {/* Card Preview Strip */}
        <div className={`mt-16 flex items-center justify-center gap-4 transition-all duration-700 delay-300 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {[
            { name: 'Sachin', country: '🇮🇳', rarity: 'legendary', color: '#f59e0b' },
            { name: 'Bradman', country: '🇦🇺', rarity: 'legendary', color: '#f59e0b' },
            { name: 'Lara', country: '🏴', rarity: 'legendary', color: '#f59e0b' },
            { name: 'Warne', country: '🇦🇺', rarity: 'legendary', color: '#f59e0b' }
          ].map((player, i) => (
            <div
              key={player.name}
              className="rounded-xl overflow-hidden animate-float hidden sm:block"
              style={{
                animationDelay: `${i * 0.3}s`,
                width: 90,
                height: 125,
                background: 'linear-gradient(160deg, #1a2744 0%, #0f1e3a 100%)',
                border: `1.5px solid ${player.color}`,
                boxShadow: `0 0 15px ${player.color}40`,
                transform: `rotate(${(i - 1.5) * 3}deg)`
              }}
            >
              <div className="p-2 flex flex-col h-full">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400">{player.rarity.toUpperCase().slice(0, 3)}</span>
                  <span className="text-xs">🏏</span>
                </div>
                <div className="flex-1 flex flex-col justify-end">
                  <div className="text-xs font-bold text-white font-rajdhani">{player.name}</div>
                  <div className="text-xs">{player.country}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Stats ticker */}
      <div className="relative z-10 border-t border-white/5 bg-pitch-800/50 py-3 overflow-hidden">
        <div className="flex animate-[scroll_20s_linear_infinite] whitespace-nowrap">
          {[...Array(3)].map((_, rep) => (
            <div key={rep} className="flex items-center">
              <TickerItem icon="🎮" text="10,000+ Games Played" />
              <TickerItem icon="👥" text="5,000+ Players Online" />
              <TickerItem icon="🏏" text="52 Legendary Cricketers" />
              <TickerItem icon="🌍" text="Players from 8 Countries" />
              <TickerItem icon="⚡" text="Real-time Multiplayer" />
              <TickerItem icon="🏆" text="Daily Tournaments" />
            </div>
          ))}
        </div>
      </div>

      {/* How to Play Modal */}
      <Modal isOpen={showHowTo} onClose={() => setShowHowTo(false)} title="How to Play" maxWidth="max-w-md">
        <div className="space-y-4 mt-2">
          {HOW_TO_PLAY_RULES.map((rule) => (
            <div key={rule.step} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-sm font-bold text-white flex-shrink-0 mt-0.5">
                {rule.step}
              </div>
              <div>
                <div className="font-rajdhani font-semibold text-white">{rule.title}</div>
                <div className="text-slate-400 text-sm mt-0.5">{rule.desc}</div>
              </div>
            </div>
          ))}
          <div className="pt-2 border-t border-white/10">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span className="text-amber-400">💡</span>
              <span>Time limit options: 4, 6, or 10 minutes. Most cards when time runs out wins!</span>
            </div>
          </div>
          <Button variant="primary" fullWidth onClick={() => { setShowHowTo(false); handlePlay() }}>
            Start Playing Now
          </Button>
        </div>
      </Modal>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  )
}
