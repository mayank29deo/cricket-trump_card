import React, { useState } from 'react'
import Modal from '../ui/Modal'

export default function ShareModal({ isOpen, onClose, roomCode }) {
  const [copied, setCopied] = useState(false)

  const shareUrl = `${window.location.origin}/game/${roomCode}`
  const whatsappMessage = encodeURIComponent(
    `Join my Cricket Trump Card game! Room Code: ${roomCode}\n${shareUrl}`
  )
  const whatsappUrl = `https://wa.me/?text=${whatsappMessage}`

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const el = document.createElement('textarea')
      el.value = shareUrl
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignore
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invite Friends">
      <div className="space-y-5">
        <div className="text-center">
          <p className="text-slate-400 text-sm mb-2">Room Code</p>
          <div
            className="text-5xl font-rajdhani font-bold tracking-[0.3em] text-amber-400 cursor-pointer hover:text-amber-300 transition-colors"
            onClick={copyCode}
            title="Click to copy"
          >
            {roomCode}
          </div>
          <p className="text-slate-500 text-xs mt-1">Click to copy code</p>
        </div>

        <div className="bg-pitch-800/80 rounded-lg p-3 flex items-center gap-2">
          <span className="text-slate-400 text-xs truncate flex-1">{shareUrl}</span>
          <button
            onClick={copyLink}
            className="text-xs px-3 py-1.5 rounded bg-emerald-700 hover:bg-emerald-600 text-white font-semibold transition-colors whitespace-nowrap"
          >
            {copied ? '✓ Copied!' : 'Copy Link'}
          </button>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 w-full py-3 bg-green-700 hover:bg-green-600 text-white font-rajdhani font-semibold rounded-lg transition-colors"
        >
          <span className="text-xl">📱</span>
          Share via WhatsApp
        </a>

        <div className="text-center">
          <p className="text-slate-500 text-sm">
            Friends can join at <span className="text-emerald-400">{window.location.origin}/game/{roomCode}</span>
          </p>
        </div>
      </div>
    </Modal>
  )
}
