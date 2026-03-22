import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import useAuthStore from '../store/authStore'

const TEAM_THEMES = [
  { id: 'india', label: 'India', flag: '🇮🇳', color: '#1565c0', accent: '#ff6f00' },
  { id: 'australia', label: 'Australia', flag: '🇦🇺', color: '#ffd600', accent: '#1a237e' },
  { id: 'england', label: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', color: '#1565c0', accent: '#e53935' },
  { id: 'westindies', label: 'West Indies', flag: '🏴', color: '#6d1c1c', accent: '#ffd600' },
  { id: 'pakistan', label: 'Pakistan', flag: '🇵🇰', color: '#1b5e20', accent: '#ffffff' },
  { id: 'southafrica', label: 'South Africa', flag: '🇿🇦', color: '#1b5e20', accent: '#ffd600' }
]

export default function Auth() {
  const navigate = useNavigate()
  const { signIn, signUp, continueAsGuest, isLoading, error, clearError, user } = useAuthStore()
  const [tab, setTab] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [guestName, setGuestName] = useState('')
  const [selectedTeam, setSelectedTeam] = useState('india')
  const [localError, setLocalError] = useState('')

  useEffect(() => {
    if (user) navigate('/lobby')
  }, [user, navigate])

  useEffect(() => {
    clearError()
    setLocalError('')
  }, [tab, clearError])

  const handleSignIn = async (e) => {
    e.preventDefault()
    setLocalError('')
    if (!email || !password) {
      setLocalError('Please fill in all fields')
      return
    }
    const result = await signIn(email, password)
    if (result.success) {
      navigate('/lobby')
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLocalError('')
    if (!email || !password || !name) {
      setLocalError('Please fill in all fields')
      return
    }
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters')
      return
    }
    const result = await signUp(email, password, name)
    if (result.success) {
      navigate('/lobby')
    }
  }

  const handleGuest = () => {
    const trimmed = guestName.trim()
    if (!trimmed) {
      setLocalError('Please enter your name to continue as guest')
      return
    }
    continueAsGuest(trimmed)
    navigate('/lobby')
  }

  const displayError = localError || error

  return (
    <div className="min-h-screen stadium-bg flex flex-col items-center justify-center px-4 py-8">
      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 text-slate-400 hover:text-white flex items-center gap-1 text-sm transition-colors"
      >
        ← Back
      </button>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🏏</div>
          <h1 className="font-rajdhani font-bold text-3xl gradient-text">CRICKET TRUMP CARD</h1>
          <p className="text-slate-400 text-sm mt-1">Sign in to save your progress</p>
        </div>

        <div className="glass-card rounded-2xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-white/10">
            <button
              className={`flex-1 py-3.5 font-rajdhani font-semibold text-sm tracking-wide transition-colors ${
                tab === 'signin' ? 'tab-active text-emerald-400 bg-white/5' : 'text-slate-400 hover:text-white'
              }`}
              onClick={() => setTab('signin')}
            >
              SIGN IN
            </button>
            <button
              className={`flex-1 py-3.5 font-rajdhani font-semibold text-sm tracking-wide transition-colors ${
                tab === 'signup' ? 'tab-active text-emerald-400 bg-white/5' : 'text-slate-400 hover:text-white'
              }`}
              onClick={() => setTab('signup')}
            >
              SIGN UP
            </button>
          </div>

          <div className="p-6">
            {/* Error */}
            {displayError && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-700/50 rounded-lg text-red-400 text-sm">
                {displayError}
              </div>
            )}

            {tab === 'signin' ? (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="block text-slate-400 text-sm mb-1.5">Email</label>
                  <input
                    type="email"
                    className="input-primary"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-1.5">Password</label>
                  <input
                    type="password"
                    className="input-primary"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                </div>
                <Button type="submit" variant="primary" fullWidth size="lg" disabled={isLoading}>
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
                <p className="text-center text-slate-500 text-xs">
                  Don't have Supabase configured? Use "Continue as Guest" below.
                </p>
              </form>
            ) : (
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <label className="block text-slate-400 text-sm mb-1.5">Display Name</label>
                  <input
                    type="text"
                    className="input-primary"
                    placeholder="Your name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    autoComplete="name"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-1.5">Email</label>
                  <input
                    type="email"
                    className="input-primary"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-1.5">Password</label>
                  <input
                    type="password"
                    className="input-primary"
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                </div>

                {/* Team selector */}
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Favourite Team</label>
                  <div className="grid grid-cols-3 gap-2">
                    {TEAM_THEMES.map(team => (
                      <button
                        key={team.id}
                        type="button"
                        onClick={() => setSelectedTeam(team.id)}
                        className={`py-2 px-2 rounded-lg border text-center transition-all text-sm ${
                          selectedTeam === team.id
                            ? 'border-emerald-500 bg-emerald-900/30 text-white'
                            : 'border-white/10 text-slate-400 hover:border-white/30'
                        }`}
                      >
                        <div>{team.flag}</div>
                        <div className="text-xs mt-0.5 truncate">{team.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <Button type="submit" variant="primary" fullWidth size="lg" disabled={isLoading}>
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>
            )}

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-slate-500 text-xs">OR</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Guest section */}
            <div className="space-y-3">
              <p className="text-slate-400 text-sm font-medium">Continue as Guest</p>
              <input
                type="text"
                className="input-primary"
                placeholder="Enter your name"
                value={guestName}
                onChange={e => setGuestName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleGuest()}
              />
              <Button variant="ghost" fullWidth onClick={handleGuest} className="border border-white/20">
                <span className="flex items-center justify-center gap-2">
                  <span>👤</span>
                  Play as Guest
                </span>
              </Button>
              <p className="text-slate-500 text-xs text-center">
                Guest progress is saved locally. No account required.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
