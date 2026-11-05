import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Avatar from '../Avatar'

const phoneUsers = [
  { name: 'Miko Parker', gain: 330.1, photo: 'https://i.pravatar.cc/80?img=13' },
  { name: 'Alex Chen', gain: 280.1, photo: 'https://i.pravatar.cc/80?img=52' },
  { name: 'Sam Wilson', gain: 230.1, photo: 'https://i.pravatar.cc/80?img=33' },
]

export default function StartCopyingSection() {
  const [activeView, setActiveView] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveView((prev) => (prev + 1) % 3)
    }, 2800)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <section className="py-20 border-t border-dark-border relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        <div className="flex-1 max-w-xl">
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Start copying & start earning
          </h2>
          <p className="mt-6 text-slate-300 leading-relaxed">
            Interactive Prime Trade provides the ability to copy successful strategies OR to share your own strategy and start earning when others copy it.
          </p>
          <p className="mt-4 text-slate-400 text-sm leading-relaxed">
            Experience the sheer brilliance of Interactive Prime Trade - a revolutionary platform that effortlessly mirrors the success of profitable traders and lets you copy successful strategies or provide your own strategy to others to be copied and profit from that.
          </p>
          <Link
            to="/platform"
            className="mt-8 inline-flex items-center justify-center px-6 py-3.5 text-base font-medium rounded-lg bg-primary hover:bg-primary-dark text-white transition-colors"
          >
            Start Copytrading
          </Link>
        </div>

        <div className="flex-1 relative flex justify-center lg:justify-center min-h-[390px]">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[360px] h-[360px] rounded-full bg-cyan-300/40 blur-[90px] animate-float" />
          </div>

          {/* Laptop mockup */}
          <div className="relative z-10 animate-float-slow">
            <div className="w-[350px] md:w-[410px]">
              {/* Screen */}
              <div className="rounded-t-2xl rounded-b-md border border-slate-700/70 bg-gradient-to-b from-[#0f172a] to-[#0b1220] shadow-2xl p-2.5">
                <div className="h-[210px] md:h-[230px] rounded-xl border border-slate-700/50 bg-[#0a1328] overflow-hidden flex flex-col">
                  <div className="h-7 border-b border-dark-border px-3 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Current User</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <div className="flex-1 overflow-hidden relative">
                    <div
                      className="h-full flex transition-transform duration-700 ease-in-out"
                      style={{ transform: `translateX(-${activeView * 100}%)` }}
                    >
                      {/* View 1: Traders list */}
                      <div className="w-full shrink-0 p-2 space-y-2">
                        {phoneUsers.map(({ name, gain, photo }) => (
                          <div key={name} className="flex items-center gap-2 p-2 rounded-lg bg-dark border border-dark-border">
                            <Avatar seed={name} name={name} src={photo} className="w-8 h-8 rounded-full object-cover shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-white text-[11px] font-medium truncate">{name}</p>
                              <p className="text-emerald-400 text-[10px]">+{gain}%</p>
                            </div>
                            <button type="button" className="px-2.5 py-1 rounded bg-primary text-white text-[9px] font-medium">
                              Copy
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* View 2: Performance */}
                      <div className="w-full shrink-0 p-2 space-y-2">
                        <div className="rounded-lg p-2 border border-dark-border bg-dark">
                          <p className="text-[10px] text-slate-400">Portfolio Profit</p>
                          <p className="text-lg text-emerald-400 font-semibold">+$8,420.18</p>
                          <p className="text-[9px] text-slate-500">Last 30 days</p>
                        </div>
                        <div className="rounded-lg p-2 border border-dark-border bg-dark">
                          <p className="text-[10px] text-slate-400 mb-1">Asset Allocation</p>
                          {[
                            ['FX', 42, 'bg-primary'],
                            ['Indices', 28, 'bg-emerald-500'],
                            ['Commodities', 18, 'bg-amber-500'],
                            ['Crypto', 12, 'bg-fuchsia-500'],
                          ].map(([label, pct, color]) => (
                            <div key={label} className="flex items-center gap-1.5 mb-1 last:mb-0">
                              <span className="w-16 text-[9px] text-slate-400">{label}</span>
                              <div className="flex-1 h-1.5 rounded-full bg-slate-700/70 overflow-hidden">
                                <div className={color} style={{ width: `${pct}%`, height: '100%' }} />
                              </div>
                              <span className="w-8 text-right text-[9px] text-slate-300">{pct}%</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* View 3: Live signals */}
                      <div className="w-full shrink-0 p-2 space-y-2">
                        {[
                          ['EURUSD Buy', 'Entry 1.0870', '+2.4%'],
                          ['NASDAQ Long', 'Strength score 82', '+1.8%'],
                          ['Gold Reversal', 'Watch zone 2341-2352', '+0.9%'],
                        ].map(([title, detail, score]) => (
                          <div key={title} className="rounded-lg p-2 border border-dark-border bg-dark">
                            <p className="text-[10px] text-white">{title}</p>
                            <p className="text-[9px] text-slate-400">{detail}</p>
                            <p className="text-[10px] text-emerald-400 mt-1">{score}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="h-4 flex items-center justify-center gap-1.5">
                    {[0, 1, 2].map((dot) => (
                      <span key={dot} className={`h-1.5 rounded-full transition-all ${activeView === dot ? 'w-4 bg-primary' : 'w-1.5 bg-slate-500/70'}`} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Base / keyboard deck */}
              <div className="h-6 md:h-7 rounded-b-2xl bg-gradient-to-b from-slate-500 to-slate-700 border border-slate-500/40 shadow-[0_10px_18px_rgba(0,0,0,0.45)]" />
              <div className="mx-auto -mt-2 w-20 h-1.5 rounded-full bg-slate-800/80" />
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[78%] h-5 rounded-full bg-black/35 blur-md -z-10" />
          </div>
        </div>
      </div>
    </section>
  )
}
