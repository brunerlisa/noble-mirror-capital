'use client'

import { useEffect, useRef, useState } from 'react'
import { ChartErrorBoundary } from '@/components/ChartErrorBoundary'
import { mountTradingView } from '@/lib/mountTradingView'

export default function TradingViewChart({ symbol = 'NASDAQ:AAPL' }) {
  return (
    <ChartErrorBoundary>
      <ChartFrame symbol={symbol} />
    </ChartErrorBoundary>
  )
}

function ChartFrame({ symbol }) {
  const containerRef = useRef(null)
  const [live, setLive] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined
    setLive(false)

    return mountTradingView(container, {
      onReady: () => setLive(true),
      src: 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js',
      config: {
        autosize: true,
        symbol,
        interval: 'D',
        timezone: 'Etc/UTC',
        theme: 'dark',
        style: '1',
        locale: 'en',
        hide_top_toolbar: false,
        hide_legend: false,
        allow_symbol_change: true,
        save_image: true,
        calendar: false,
        hide_volume: false,
        support_host: 'https://www.tradingview.com',
        backgroundColor: '#050a14',
        gridColor: 'rgba(148,163,184,0.08)',
        withdateranges: true,
      },
    })
  }, [symbol])

  return (
    <div className="relative h-[420px] lg:h-[560px] rounded-2xl border border-dark-border overflow-hidden bg-[#050a14]">
      <div className={`absolute inset-0 flex items-center justify-center text-sm text-slate-500 ${live ? 'invisible' : ''}`}>
        Loading chart
      </div>
      <div ref={containerRef} className="absolute inset-0 z-[1] h-full w-full" />
    </div>
  )
}
