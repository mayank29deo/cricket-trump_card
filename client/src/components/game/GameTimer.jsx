import React, { useEffect, useState } from 'react'

export default function GameTimer({ totalTime, timeLeft, onExpire }) {
  const percentage = totalTime > 0 ? (timeLeft / totalTime) * 100 : 0
  const radius = 36
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const isWarning = timeLeft <= 60 && timeLeft > 30
  const isDanger = timeLeft <= 30

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`

  const strokeColor = isDanger ? '#ef4444' : isWarning ? '#f59e0b' : '#10b981'

  useEffect(() => {
    if (timeLeft <= 0 && onExpire) {
      onExpire()
    }
  }, [timeLeft, onExpire])

  return (
    <div className={`relative inline-flex items-center justify-center ${isDanger ? 'animate-pulse' : ''}`}>
      <svg width="88" height="88" className="transform -rotate-90">
        <circle
          cx="44"
          cy="44"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="5"
        />
        <circle
          cx="44"
          cy="44"
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth="5"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-rajdhani font-bold text-lg leading-none"
          style={{ color: strokeColor }}
        >
          {timeString}
        </span>
        <span className="text-slate-500 text-xs">TIME</span>
      </div>
    </div>
  )
}
