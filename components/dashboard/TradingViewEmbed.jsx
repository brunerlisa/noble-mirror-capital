'use client'

import { useEffect, useRef, useState } from 'react'
import { mountTradingView } from '@/lib/mountTradingView'

export default function TradingViewEmbed({
  src,
  config,
  height = 360,
  className = '',
}) {
  const containerRef = useRef(null)
  const [live, setLive] = useState(false)
  const configKey = JSON.stringify(config)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined
    setLive(false)

    return mountTradingView(container, { src, config, onReady: () => setLive(true) })
    // configKey tracks the serialized widget options.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, configKey])

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-dark-border bg-dark-card ${className}`}
      style={{ height }}
    >
      <div className={`absolute inset-0 flex flex-col justify-center gap-3 px-5 ${live ? 'invisible' : ''}`}>
        <div className="h-3 w-1/3 rounded-full bg-slate-700/70 animate-pulse" />
        <div className="h-3 w-2/3 rounded-full bg-slate-800/80 animate-pulse" />
        <div className="h-3 w-1/2 rounded-full bg-slate-800/80 animate-pulse" />
      </div>
      <div ref={containerRef} className="absolute inset-0 z-[1] h-full w-full" />
    </div>
  )
}
