'use client'
import { useEffect, useRef, useState } from 'react'
import { mountTradingView } from '@/lib/mountTradingView'

const marketTabs = [
  { title: 'Share CFDs', symbols: ['Meta', 'Netflix', 'Amazon', 'Tesla'] },
  { title: 'Crypto', symbols: ['Bitcoin', 'Ethereum', 'Solana', 'XRP'] },
  { title: 'Forex', symbols: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD'] },
  { title: 'Indices', symbols: ['S&P 500', 'Nasdaq 100', 'Dow Jones', 'FTSE 100'] },
  { title: 'Commodities', symbols: ['Gold', 'Silver', 'US Oil', 'Brent Oil'] },
]

export default function TradeMarketsSection() {
  const containerRef = useRef(null)
  const [live, setLive] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined
    setLive(false)

    return mountTradingView(container, {
      onReady: () => setLive(true),
      src: 'https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js',
      config: {
      colorTheme: 'dark',
      dateRange: '12M',
      showChart: true,
      locale: 'en',
      width: '100%',
      height: '100%',
      largeChartUrl: '',
      isTransparent: false,
      showSymbolLogo: true,
      showFloatingTooltip: true,
      plotLineColorGrowing: 'rgba(34, 197, 94, 1)',
      plotLineColorFalling: 'rgba(248, 113, 113, 1)',
      gridLineColor: 'rgba(148,163,184,0.15)',
      scaleFontColor: 'rgba(148,163,184,0.9)',
      belowLineFillColorGrowing: 'rgba(34, 197, 94, 0.05)',
      belowLineFillColorFalling: 'rgba(248, 113, 113, 0.05)',
      belowLineFillColorGrowingBottom: 'rgba(34, 197, 94, 0)',
      belowLineFillColorFallingBottom: 'rgba(248, 113, 113, 0)',
      symbolActiveColor: 'rgba(37, 99, 235, 0.3)',
      tabs: [
        {
          title: 'Share CFDs',
          symbols: [
            { s: 'NASDAQ:META', d: 'Meta' },
            { s: 'NASDAQ:NFLX', d: 'Netflix' },
            { s: 'NASDAQ:AMZN', d: 'Amazon' },
            { s: 'NASDAQ:TSLA', d: 'Tesla' },
          ],
        },
        {
          title: 'Crypto',
          symbols: [
            { s: 'BINANCE:BTCUSDT', d: 'Bitcoin' },
            { s: 'BINANCE:ETHUSDT', d: 'Ethereum' },
            { s: 'BINANCE:SOLUSDT', d: 'Solana' },
            { s: 'BINANCE:XRPUSDT', d: 'XRP' },
          ],
        },
        {
          title: 'Forex',
          symbols: [
            { s: 'FX:EURUSD', d: 'EUR/USD' },
            { s: 'FX:GBPUSD', d: 'GBP/USD' },
            { s: 'FX:USDJPY', d: 'USD/JPY' },
            { s: 'FX:AUDUSD', d: 'AUD/USD' },
          ],
        },
        {
          title: 'Indices',
          symbols: [
            { s: 'FOREXCOM:SPXUSD', d: 'S&P 500' },
            { s: 'FOREXCOM:NSXUSD', d: 'Nasdaq 100' },
            { s: 'FOREXCOM:DJI', d: 'Dow Jones' },
            { s: 'FOREXCOM:UKXGBP', d: 'FTSE 100' },
          ],
        },
        {
          title: 'Commodities',
          symbols: [
            { s: 'OANDA:XAUUSD', d: 'Gold' },
            { s: 'OANDA:XAGUSD', d: 'Silver' },
            { s: 'TVC:USOIL', d: 'US Oil' },
            { s: 'TVC:UKOIL', d: 'Brent Oil' },
          ],
        },
      ],
    },
    })
  }, [])

  return (
    <section className="py-12 lg:py-20 border-t border-dark-border">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 min-w-0">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 lg:mb-4">
          Trade Global Markets at the Lowest Costs!
        </h2>
        <p className="text-slate-400 mb-6 lg:mb-8 text-[15px] lg:text-base leading-relaxed">
          Gain fast and easy access to 1000+ of the most liquid Currencies, Indices, Commodities, Share CFDs, ETFs and more with{' '}
          <span className="text-primary font-medium">PRIME ECN</span> spreads from <span className="text-primary font-medium">0.0 pips!</span>
        </p>

        <div className="relative h-[380px] sm:h-[420px] lg:h-[420px] rounded-xl bg-dark-card border border-dark-border overflow-hidden min-w-0">
          <div className={`absolute inset-0 grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 lg:grid-cols-5 ${live ? 'invisible' : ''}`}>
            {marketTabs.map((tab) => (
              <div key={tab.title} className="rounded-lg border border-slate-700/40 bg-[#0a162d] p-3">
                <p className="text-xs font-semibold text-slate-300">{tab.title}</p>
                <ul className="mt-2 space-y-1.5">
                  {tab.symbols.map((symbol) => (
                    <li key={symbol} className="flex items-center justify-between gap-2 text-[13px] text-slate-400">
                      <span>{symbol}</span>
                      <span className="h-2 w-8 rounded-full bg-slate-700/80 animate-pulse" />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div ref={containerRef} className="absolute inset-0 z-[1] h-full w-full min-w-0 max-w-full overflow-hidden [&_iframe]:max-w-full" />
        </div>
      </div>
    </section>
  )
}
