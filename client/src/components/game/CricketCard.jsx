import React from 'react'

const STAT_MAX = {
  batting_avg: 100,
  strike_rate: 200,
  centuries: 100,
  total_runs: 35000,
  wickets: 1400,
  catches: 450
}

const STAT_LABELS = {
  batting_avg: 'BAT AVG',
  strike_rate: 'STRIKE RATE',
  centuries: 'CENTURIES',
  total_runs: 'TOTAL RUNS',
  wickets: 'WICKETS',
  catches: 'CATCHES'
}

const RARITY_COLORS = {
  legendary: { border: 'card-legendary', badge: 'rarity-legendary', text: '#f59e0b', stars: '★★★★★' },
  epic: { border: 'card-epic', badge: 'rarity-epic', text: '#8b5cf6', stars: '★★★★☆' },
  rare: { border: 'card-rare', badge: 'rarity-rare', text: '#3b82f6', stars: '★★★☆☆' },
  common: { border: 'card-common', badge: 'rarity-common', text: '#6b7280', stars: '★★☆☆☆' }
}

const COUNTRY_FLAGS = {
  IN: '🇮🇳',
  AU: '🇦🇺',
  WI: '🏴',
  ZA: '🇿🇦',
  PK: '🇵🇰',
  GB: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  LK: '🇱🇰',
  NZ: '🇳🇿'
}

function getAvatarColor(name) {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const colors = [
    '#1e40af', '#7c3aed', '#b45309', '#065f46',
    '#9f1239', '#1e3a5f', '#5b21b6', '#92400e'
  ]
  return colors[Math.abs(hash) % colors.length]
}

function StatBar({ statKey, value, isSelected, onClick, isActive }) {
  const max = STAT_MAX[statKey]
  const percent = Math.min((value / max) * 100, 100)
  const label = STAT_LABELS[statKey]

  const barColor = isSelected
    ? '#f59e0b'
    : statKey === 'batting_avg' ? '#10b981'
    : statKey === 'strike_rate' ? '#3b82f6'
    : statKey === 'centuries' ? '#f59e0b'
    : statKey === 'total_runs' ? '#10b981'
    : statKey === 'wickets' ? '#ef4444'
    : '#8b5cf6'

  return (
    <button
      className={`w-full text-left rounded-md px-2 py-1 transition-all duration-200 ${
        isSelected
          ? 'bg-amber-500/20 border border-amber-500/50'
          : isActive
          ? 'hover:bg-white/5 border border-transparent cursor-pointer'
          : 'border border-transparent cursor-default'
      }`}
      onClick={() => isActive && onClick && onClick(statKey)}
      disabled={!isActive}
    >
      <div className="flex items-center justify-between mb-0.5">
        <span className={`text-xs font-semibold tracking-wide ${isSelected ? 'text-amber-400' : 'text-slate-400'}`}>
          {label}
        </span>
        <span className={`text-xs font-bold font-rajdhani ${isSelected ? 'text-amber-300' : 'text-slate-200'}`}>
          {typeof value === 'number' && value % 1 !== 0 ? value.toFixed(2) : value}
        </span>
      </div>
      <div className="stat-bar-track">
        <div
          className="stat-bar-fill"
          style={{
            width: `${percent}%`,
            backgroundColor: barColor,
            boxShadow: isSelected ? `0 0 6px ${barColor}` : 'none'
          }}
        />
      </div>
    </button>
  )
}

export default function CricketCard({
  card,
  isFlipped = false,
  isSelected = false,
  isWinner = false,
  selectedStat = null,
  onStatClick,
  isActive = false,
  isBack = false,
  compact = false
}) {
  if (!card && !isBack) return null

  if (isBack) {
    return (
      <div className="relative rounded-xl overflow-hidden" style={{
        width: compact ? '80px' : '160px',
        height: compact ? '110px' : '220px',
        background: 'linear-gradient(135deg, #0d2040 0%, #1a3a5c 50%, #0d2040 100%)',
        border: '2px solid rgba(16,185,129,0.4)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
      }}>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <div className="text-3xl">🏏</div>
          <div className="text-emerald-500 font-rajdhani font-bold text-xs tracking-widest">TRUMP</div>
          <div className="w-8 h-0.5 bg-emerald-600/50 rounded" />
          <div className="text-emerald-600 text-xs font-rajdhani">CRICKET</div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 to-transparent pointer-events-none" />
      </div>
    )
  }

  const rarity = RARITY_COLORS[card.rarity] || RARITY_COLORS.common
  const flagEmoji = COUNTRY_FLAGS[card.countryCode] || '🏳️'
  const avatarColor = getAvatarColor(card.name)
  const initials = card.name.split(' ').map(n => n[0]).join('').slice(0, 2)

  return (
    <div
      className={`relative rounded-xl overflow-hidden transition-all duration-300 select-none ${rarity.border} ${
        isWinner ? 'scale-105 ring-4 ring-amber-400 ring-offset-2 ring-offset-pitch-900' : ''
      } ${isFlipped ? 'animate-card-flip' : ''}`}
      style={{
        width: compact ? '140px' : '220px',
        minWidth: compact ? '140px' : '220px',
        background: 'linear-gradient(160deg, #1a2744 0%, #0f1e3a 100%)',
        boxShadow: isWinner ? '0 0 30px rgba(245,158,11,0.6)' : undefined
      }}
    >
      {/* Header */}
      <div className="px-3 pt-3 pb-2">
        <div className="flex items-center justify-between mb-1">
          <span className={`text-xs px-2 py-0.5 rounded-full font-bold tracking-wide ${rarity.badge}`}>
            {card.rarity.toUpperCase()}
          </span>
          <span className="text-xs" style={{ color: rarity.text }}>{rarity.stars}</span>
        </div>

        {/* Avatar + Country */}
        <div className="flex items-center gap-2 mt-2">
          <div
            className="avatar w-10 h-10 text-sm flex-shrink-0"
            style={{ backgroundColor: avatarColor }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-rajdhani font-bold text-white text-sm leading-tight truncate">
              {card.name}
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-xs">{flagEmoji}</span>
              <span className="text-slate-400 text-xs truncate">{card.country}</span>
            </div>
          </div>
        </div>

        {/* Role + Era */}
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-xs px-1.5 py-0.5 rounded bg-white/10 text-slate-300 font-semibold">
            {card.role}
          </span>
          <span className="text-xs text-slate-500">{card.era}</span>
        </div>
      </div>

      <div className="w-full h-px bg-white/10 mx-0" />

      {/* Stats */}
      <div className="px-2 py-2 space-y-0.5">
        {Object.entries(card.stats).map(([statKey, value]) => (
          <StatBar
            key={statKey}
            statKey={statKey}
            value={value}
            isSelected={selectedStat === statKey}
            isActive={isActive}
            onClick={onStatClick}
          />
        ))}
      </div>

      {/* Winner overlay */}
      {isWinner && (
        <div className="absolute top-2 right-2 bg-amber-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">
          WINNER
        </div>
      )}
    </div>
  )
}
