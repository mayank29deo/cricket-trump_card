import { useEffect, useRef } from 'react'

// Replace with your actual AdSense publisher ID once approved
const ADSENSE_PUB_ID = 'ca-pub-3658317140326415'

/**
 * Minimal AdSense banner — renders a responsive ad unit.
 * Variants:
 *   'banner'   – 320×50  leaderboard (bottom bars, waiting screens)
 *   'rect'     – 300×250 medium rectangle (post-game, lobby)
 *
 * Set slot to your AdSense ad-slot ID once you create ad units.
 */
export default function AdBanner({ variant = 'banner', slot = '', className = '' }) {
  const adRef = useRef(null)
  const pushed = useRef(false)

  useEffect(() => {
    // Don't push ads in dev / if no real pub ID
    if (ADSENSE_PUB_ID.includes('XXXX')) return
    if (pushed.current) return

    try {
      if (window.adsbygoogle && adRef.current) {
        window.adsbygoogle.push({})
        pushed.current = true
      }
    } catch {
      // AdSense not loaded or blocked — fail silently
    }
  }, [])

  // During development or before AdSense approval, show nothing
  if (ADSENSE_PUB_ID.includes('XXXX')) {
    return null
  }

  const isRect = variant === 'rect'

  return (
    <div
      className={`flex items-center justify-center overflow-hidden ${className}`}
      style={{
        minHeight: isRect ? 250 : 50,
        maxHeight: isRect ? 260 : 60,
      }}
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{
          display: 'block',
          width: isRect ? 300 : '100%',
          height: isRect ? 250 : 50,
        }}
        data-ad-client={ADSENSE_PUB_ID}
        data-ad-slot={slot}
        data-ad-format={isRect ? 'auto' : 'horizontal'}
        data-full-width-responsive={isRect ? 'false' : 'true'}
      />
    </div>
  )
}
