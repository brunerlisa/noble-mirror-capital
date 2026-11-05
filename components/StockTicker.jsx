'use client'
import { useEffect, useRef, useState } from 'react'
import { mountTradingView } from '@/lib/mountTradingView'

const tickerSymbols = [
  { proName: 'FOREXCOM:SPXUSD', title: 'S&P 500' },
  { proName: 'FOREXCOM:NSXUSD', title: 'Nasdaq 100' },
  { proName: 'FX_IDC:EURUSD', title: 'EUR to USD' },
  { proName: 'NASDAQ:MSFT', title: 'Microsoft' },
  { proName: 'NASDAQ:AMZN', title: 'Amazon' },
  { proName: 'NASDAQ:META', title: 'Meta' },
  { proName: 'NASDAQ:NVDA', title: 'Nvidia' },
]

/**
 * Market ticker under the hero. Full-width on phones; pinned to the hero bottom on desktop.
 */
export default function StockTicker() {
  const containerRef = useRef(null)
  const [live, setLive] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined
    setLive(false)

    return mountTradingView(container, {
      onReady: () => setLive(true),
      src: 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js',
      config: {
        symbols: tickerSymbols,
        showSymbolLogo: true,
        isTransparent: false,
        displayMode: 'adaptive',
        colorTheme: 'dark',
        locale: 'en',
      },
    })
  }, [])

  const tape = [...tickerSymbols, ...tickerSymbols]

  return (
    <div
      className="relative lg:absolute lg:bottom-0 lg:left-0 lg:right-0 z-[5] min-w-0 max-w-full
        h-12 lg:h-[56px] w-full overflow-hidden touch-pan-x overscroll-contain
        border-y lg:border-y-0 border-dark-border lg:border-t
        bg-dark/90 lg:bg-dark/80"
    >
      <div className={`absolute inset-0 flex items-center overflow-hidden ${live ? 'invisible' : ''}`}>
        <div className="animate-ticker flex w-max items-center gap-8 px-4 text-sm text-slate-300">
          {tape.map((symbol, index) => (
            <span key={`${symbol.proName}-${index}`} className="whitespace-nowrap">
              {symbol.title}
            </span>
          ))}
        </div>
      </div>
      <div ref={containerRef} className="absolute inset-0 z-[1] h-full w-full min-w-0 max-w-full overflow-hidden [&_iframe]:max-w-full" />
    </div>
  )
}
