'use client'
import { useEffect, useRef, useState } from 'react'
import { mountTradingView } from '@/lib/mountTradingView'

const snapshotQuotes = [
  { name: 'Nvidia', mark: 'bg-[#76b900]' },
  { name: 'Microsoft', mark: 'bg-[#00a4ef]' },
  { name: 'Amazon', mark: 'bg-[#ff9900]' },
  { name: 'EUR/USD', mark: 'bg-[#3b82f6]' },
]

function LiveMarketWidget() {
  const containerRef = useRef(null)
  const [live, setLive] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined
    setLive(false)

    return mountTradingView(container, {
      onReady: () => setLive(true),
      src: 'https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js',
      config: {
        symbolsGroups: [
          {
            name: 'Major Assets',
            symbols: [
              { name: 'NASDAQ:NVDA', displayName: 'Nvidia' },
              { name: 'NASDAQ:MSFT', displayName: 'Microsoft' },
              { name: 'NASDAQ:AMZN', displayName: 'Amazon' },
              { name: 'FX:EURUSD', displayName: 'EUR/USD' },
            ],
          },
        ],
        showSymbolLogo: true,
        isTransparent: false,
        colorTheme: 'dark',
        locale: 'en',
      },
    })
  }, [])

  return (
    <div className="relative h-full w-full min-h-0 overflow-hidden rounded-lg lg:rounded-xl border border-slate-700/40 bg-[#0a162d]">
      <div className={`absolute inset-0 flex flex-col justify-center px-3 py-2 ${live ? 'invisible' : ''}`}>
        <div className="grid grid-cols-[1fr_72px_64px] gap-2 px-1 pb-1.5 text-[10px] uppercase tracking-wide text-slate-500">
          <span>Name</span>
          <span className="text-right">Change</span>
          <span className="text-right">Chg%</span>
        </div>
        {snapshotQuotes.map((quote) => (
          <div key={quote.name} className="grid grid-cols-[1fr_72px_64px] items-center gap-2 border-t border-slate-700/40 px-1 py-2">
            <span className="flex items-center gap-2 text-sm text-slate-100">
              <span className={`h-2 w-2 rounded-full ${quote.mark}`} />
              {quote.name}
            </span>
            <span className="h-2.5 justify-self-end w-12 rounded-full bg-slate-700/70 animate-pulse" />
            <span className="h-2.5 justify-self-end w-10 rounded-full bg-slate-700/70 animate-pulse" />
          </div>
        ))}
      </div>
      <div ref={containerRef} className="absolute inset-0 z-[1] h-full w-full max-w-full overflow-hidden [&_iframe]:max-w-full" />
    </div>
  )
}

/**
 * @param {{ dense?: boolean, responsiveDensity?: boolean }} props
 * `responsiveDensity` — dense card + shorter widget below lg; classic sizes at lg+
 */
export default function HeroPhone({ dense = false, responsiveDensity = false }) {
  const denseOnly = dense && !responsiveDensity
  const useResponsive = responsiveDensity

  const box = useResponsive
    ? 'p-4 sm:p-5 lg:p-6 rounded-2xl w-full mx-auto max-w-none lg:max-w-[560px] lg:mx-0'
    : denseOnly
      ? 'p-2 sm:p-2.5 rounded-lg'
      : 'p-5 md:p-6 rounded-2xl'

  const title = useResponsive
    ? 'text-sm lg:text-base'
    : denseOnly
      ? 'text-[10px] sm:text-[11px]'
      : 'text-sm md:text-base'

  const widgetH = useResponsive
    ? 'h-[280px] sm:h-[300px] lg:h-72 xl:h-80'
    : denseOnly
      ? 'h-[220px] sm:h-[240px]'
      : 'h-72 md:h-80'

  const wrap = useResponsive
    ? 'min-h-0 w-full lg:min-h-[390px]'
    : denseOnly
      ? 'min-h-0'
      : 'min-h-[390px] md:min-h-[440px]'

  const badge = useResponsive
    ? 'text-xs px-2 py-1 lg:text-[11px]'
    : denseOnly
      ? 'text-[9px] sm:text-[10px]'
      : 'text-[11px]'

  return (
    <div className={`relative flex items-center justify-center max-w-full min-w-0 ${wrap}`}>
      <div aria-hidden="true" className="pointer-events-none absolute -inset-x-14 -top-8 -bottom-16 z-0 sm:-inset-x-20 sm:-bottom-20">
        <div className="snapshot-glow absolute inset-0" />
      </div>

      <div className={`relative z-[1] w-full min-w-0 border border-slate-700/50 bg-gradient-to-b from-[#0f172a] to-[#0b1220] shadow-xl lg:shadow-2xl ${box}`}>
        <div className="flex items-center justify-between gap-2 mb-3 lg:mb-4">
          <p className={`text-slate-200 font-semibold ${title} min-w-0`}>
            Live Portfolio Snapshot
          </p>
          <span
            className={`text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-full shrink-0 ${badge}`}
          >
            +4.83% Today
          </span>
        </div>

        <div className={`${widgetH} min-w-0`}>
          <LiveMarketWidget />
        </div>

        <p className="mt-3 text-[11px] text-slate-500 text-right">
          Live data powered by TradingView
        </p>
      </div>
    </div>
  )
}
