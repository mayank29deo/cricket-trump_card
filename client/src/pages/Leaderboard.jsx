import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import useAuthStore from '../store/authStore'
import { supabase } from '../lib/supabase'

const MOCK_GLOBAL = [
  { id: 1, name: 'CricketKing99', wins: 142, games: 180, country: '🇮🇳' },
  { id: 2, name: 'SachinFan007', wins: 128, games: 165, country: '🇮🇳' },
  { id: 3, name: 'AussieChamp', wins: 119, games: 158, country: '🇦🇺' },
  { id: 4, name: 'PitchMaster', wins: 108, games: 147, country: '🇵🇰' },
  { id: 5, name: 'LaraBoss', wins: 97, games: 132, country: '🏴' },
  { id: 6, name: 'WicketsGalore', wins: 89, games: 124, country: '🇿🇦' },
  { id: 7, name: 'SixMaxter', wins: 84, games: 118, country: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { id: 8, name: 'SpinWizard', wins: 76, games: 110, country: '🇱🇰' },
  { id: 9, name: 'FastBowler22', wins: 71, games: 105, country: '🇳🇿' },
  { id: 10, name: 'Cricketer_X', wins: 65, games: 99, country: '🇮🇳' }
]

const MOCK_WEEKLY = [
  { id: 1, name: 'WicketsGalore', wins: 24, games: 30, country: '🇿🇦' },
  { id: 2, name: 'CricketKing99', wins: 21, games: 27, country: '🇮🇳' },
  { id: 3, name: 'AussieChamp', wins: 19, games: 25, country: '🇦🇺' },
  { id: 4, name: 'SixMaxter', wins: 16, games: 22, country: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { id: 5, name: 'SpinWizard', wins: 14, games: 20, country: '🇱🇰' },
  { id: 6, name: 'FastBowler22', wins: 12, games: 18, country: '🇳🇿' },
  { id: 7, name: 'PitchMaster', wins: 11, games: 17, country: '🇵🇰' },
  { id: 8, name: 'LaraBoss', wins: 9, games: 15, country: '🏴' }
]

function getAvatarColor(name) {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const colors = ['#1e40af', '#7c3aed', '#b45309', '#065f46', '#9f1239', '#1e3a5f', '#0e7490', '#78350f']
  return colors[Math.abs(hash) % colors.length]
}

function RankBadge({ rank }) {
  if (rank === 1) return <div className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center text-black font-bold text-lg">🥇</div>
  if (rank === 2) return <div className="w-9 h-9 rounded-full bg-slate-400 flex items-center justify-center text-black font-bold text-lg">🥈</div>
  if (rank === 3) return <div className="w-9 h-9 rounded-full bg-amber-800 flex items-center justify-center text-white font-bold text-lg">🥉</div>
  return (
    <div className="w-9 h-9 rounded-full bg-pitch-700 flex items-center justify-center font-rajdhani font-bold text-slate-400">
      {rank}
    </div>
  )
}

function LeaderboardRow({ player, rank, index }) {
  const initials = player.name?.split('').slice(0, 2).join('').toUpperCase()
  const winRate = player.games > 0 ? ((player.wins / player.games) * 100).toFixed(0) : 0

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 ${
        rank <= 3
          ? 'border-amber-500/30 bg-amber-900/10'
          : 'border-white/5 bg-white/5 hover:bg-white/10'
      }`}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <RankBadge rank={rank} />

      <div
        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0"
        style={{ backgroundColor: getAvatarColor(player.name) }}
      >
        {initials}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-white font-medium truncate">{player.name}</span>
          <span className="text-sm">{player.country}</span>
        </div>
        <div className="text-slate-400 text-xs mt-0.5">
          {player.wins}W / {player.games}G
        </div>
      </div>

      <div className="text-right flex-shrink-0">
        <div className="font-rajdhani font-bold text-lg text-emerald-400">{winRate}%</div>
        <div className="text-slate-500 text-xs">Win Rate</div>
      </div>
    </div>
  )
}

export default function Leaderboard() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState('global')
  const [leaderboardData, setLeaderboardData] = useState([])
  const [loading, setLoading] = useState(true)
  const [myStats, setMyStats] = useState(null)

  useEffect(() => {
    loadLeaderboard()
  }, [activeTab])

  async function loadLeaderboard() {
    setLoading(true)
    try {
      if (activeTab === 'friends' && !user) {
        setLeaderboardData([])
        setLoading(false)
        return
      }

      // Try Supabase
      if (import.meta.env.VITE_SUPABASE_URL && !import.meta.env.VITE_SUPABASE_URL.includes('placeholder')) {
        const { data, error } = await supabase
          .from('leaderboard')
          .select('*')
          .order('wins', { ascending: false })
          .limit(20)

        if (!error && data) {
          setLeaderboardData(data)
          setLoading(false)
          return
        }
      }
      // Fall back to mock
      await new Promise(r => setTimeout(r, 300))
      setLeaderboardData(activeTab === 'weekly' ? MOCK_WEEKLY : MOCK_GLOBAL)
    } catch {
      setLeaderboardData(activeTab === 'weekly' ? MOCK_WEEKLY : MOCK_GLOBAL)
    }
    setLoading(false)
  }

  const tabs = [
    { id: 'global', label: 'Global', icon: '🌍' },
    { id: 'weekly', label: 'This Week', icon: '📅' },
    { id: 'friends', label: 'Friends', icon: '👥' }
  ]

  return (
    <div className="min-h-screen stadium-bg flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <button
          onClick={() => navigate('/')}
          className="text-slate-400 hover:text-white flex items-center gap-1 text-sm transition-colors"
        >
          ← Back
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xl">🏆</span>
          <span className="font-rajdhani font-bold text-white text-lg">LEADERBOARD</span>
        </div>
        <div className="w-16" />
      </nav>

      <div className="flex-1 px-4 py-6 max-w-2xl mx-auto w-full">
        {/* Personal stats if logged in */}
        {user && (
          <div className="glass-card rounded-2xl p-4 mb-6 border border-emerald-600/30">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg text-white"
                style={{ backgroundColor: getAvatarColor(user.name) }}
              >
                {user.name?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="font-rajdhani font-bold text-white text-lg">{user.name}</div>
                <div className="text-slate-400 text-xs">{user.isGuest ? 'Guest Player' : 'Registered Player'}</div>
              </div>
              <Button variant="primary" size="sm" onClick={() => navigate('/lobby')}>
                Play Now
              </Button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex rounded-xl overflow-hidden border border-white/10 mb-5">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`flex-1 py-2.5 text-sm font-rajdhani font-semibold tracking-wide transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-emerald-700 text-white'
                  : 'bg-pitch-800/50 text-slate-400 hover:text-white'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Header row */}
        <div className="flex items-center gap-3 px-3 py-2 text-xs text-slate-500 font-medium mb-2">
          <div className="w-9">RANK</div>
          <div className="w-10" />
          <div className="flex-1">PLAYER</div>
          <div className="text-right w-16">WIN RATE</div>
        </div>

        {/* Leaderboard list */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-4xl animate-spin-slow">🏏</div>
          </div>
        ) : activeTab === 'friends' && !user ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">👥</div>
            <p className="text-slate-400 mb-4">Sign in to see your friends' rankings</p>
            <Button variant="primary" onClick={() => navigate('/auth')}>Sign In</Button>
          </div>
        ) : leaderboardData.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">🏆</div>
            <p className="text-slate-400">No data yet. Be the first to play!</p>
          </div>
        ) : (
          <div className="space-y-2 animate-fade-in">
            {leaderboardData.map((player, index) => (
              <LeaderboardRow key={player.id} player={player} rank={index + 1} index={index} />
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-8 text-center">
          <Button variant="primary" size="lg" onClick={() => navigate('/lobby')} className="neon-border">
            <span className="flex items-center gap-2">
              <span>🏏</span>
              Play & Climb the Ranks
            </span>
          </Button>
        </div>
      </div>
    </div>
  )
}
