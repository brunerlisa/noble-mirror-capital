'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Avatar from '../Avatar'

const phoneUsers = [
  { name: 'Miko Parker', gain: 330.1, photo: 'https://i.pravatar.cc/80?img=13' },
  { name: 'Alex Chen', gain: 280.1, photo: 'https://i.pravatar.cc/80?img=52' },
  { name: 'Sam Wilson', gain: 230.1, photo: 'https://i.pravatar.cc/80?img=33' },
]

const wrap = 'w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-w-0'

export default function StartCopyingSection() {
  const [activeView, setActiveView] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveView((prev) => (prev + 1) % 3)
    }, 2800)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <section className="py-12 lg:py-20 border-t border-dark-border relative overflow-x-clip lg:overflow-hidden bg-dark/40 lg:bg-transparent">
      <div className={`${wrap} flex flex-col lg:flex-row items-center gap-10 lg:gap-16`}>
        <div className="min-w-0 w-full lg:flex-1 lg:max-w-xl text-center lg:text-left">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight tracking-tight">
            Start copying & start earning
          </h2>
          <p className="mt-4 lg:mt-6 text-slate-300 leading-relaxed text-[15px] lg:text-base">
            Interactive Prime Trade provides the ability to copy successful strategies OR to share your own strategy and start earning when others copy it.
          </p>
          <p className="mt-3 lg:mt-4 text-slate-400 text-sm leading-relaxed">
            Mirror profitable traders effortlessly — copy strategies or provide your own signals to the community.
          </p>
          <Link
            href="/platform"
            className="mt-6 lg:mt-8 inline-flex items-center justify-center w-full sm:w-auto min-h-12 px-6 py-3.5 text-base font-medium rounded-xl bg-primary hover:bg-primary-dark text-white transition-colors"
          >
            Start Copytrading
          </Link>
        </div>

        <div className="relative flex justify-center min-w-0 lg:flex-1 lg:min-h-[390px]">
          <div className="absolute inset-0 items-center justify-center pointer-events-none hidden lg:flex">
            <div className="w-[360px] h-[360px] rounded-full bg-primary/40 blur-[90px] animate-float" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none lg:hidden">
            <div className="w-40 h-40 rounded-full bg-primary/25 blur-[50px]" />
          </div>

          <div className="relative z-10 w-full max-w-[280px] sm:max-w-[300px] lg:max-w-none animate-none lg:animate-float-slow">
            <div className="lg:w-[350px] xl:w-[410px] mx-auto">
              <div className="rounded-t-2xl rounded-b-md border border-slate-700/70 bg-gradient-to-b from-[#0f172a] to-[#0b1220] shadow-xl p-2 lg:p-2.5">
                <div className="h-[280px] sm:h-[300px] lg:h-[210px] xl:h-[230px] rounded-xl border border-slate-700/50 bg-[#0a1328] overflow-hidden flex flex-col min-w-0">
                  <div className="h-8 border-b border-dark-border px-3 flex items-center justify-between text-xs text-slate-400 shrink-0">
                    <span>Current User</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <div className="flex-1 overflow-hidden relative min-h-0">
                    <div
                      className="h-full flex transition-transform duration-700 ease-in-out will-change-transform"
                      style={{ transform: `translateX(-${activeView * 100}%)` }}
                    >
                      <div className="w-full shrink-0 p-2 space-y-2">
                        {phoneUsers.map(({ name, gain, photo }) => (
                          <div key={name} className="flex items-center gap-2 p-2 rounded-lg bg-dark border border-dark-border">
                            <Avatar seed={name} name={name} src={photo} className="w-8 h-8 rounded-full object-cover shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-white text-xs font-medium truncate">{name}</p>
                              <p className="text-emerald-400 text-[11px]">+{gain}%</p>
                            </div>
                            <button type="button" className="px-2.5 py-1 rounded bg-primary text-white text-[11px] font-medium shrink-0">
                              Copy
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="w-full shrink-0 p-2 space-y-2">
                        <div className="rounded-lg p-2 border border-dark-border bg-dark">
                          <p className="text-[11px] text-slate-400">Portfolio Profit</p>
                          <p className="text-lg text-emerald-400 font-semibold">+$8,420.18</p>
                          <p className="text-[11px] text-slate-500">Last 30 days</p>
                        </div>
                        <div className="rounded-lg p-2 border border-dark-border bg-dark">
                          <p className="text-[11px] text-slate-400 mb-1">Asset Allocation</p>
                          {[
                            ['FX', 42, 'bg-primary'],
                            ['Indices', 28, 'bg-emerald-500'],
                            ['Commodities', 18, 'bg-amber-500'],
                            ['Crypto', 12, 'bg-fuchsia-500'],
                          ].map(([label, pct, color]) => (
                            <div key={label} className="flex items-center gap-1.5 mb-1 last:mb-0">
                              <span className="w-16 text-[11px] text-slate-400">{label}</span>
                              <div className="flex-1 h-1.5 rounded-full bg-slate-700/70 overflow-hidden min-w-0">
                                <div className={color} style={{ width: `${pct}%`, height: '100%' }} />
                              </div>
                              <span className="w-8 text-right text-[11px] text-slate-300">{pct}%</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="w-full shrink-0 p-2 space-y-2">
                        {[
                          ['EURUSD Buy', 'Entry 1.0870', '+2.4%'],
                          ['NASDAQ Long', 'Strength score 82', '+1.8%'],
                          ['Gold Reversal', 'Watch zone 2341-2352', '+0.9%'],
                        ].map(([title, detail, score]) => (
                          <div key={title} className="rounded-lg p-2 border border-dark-border bg-dark">
                            <p className="text-xs text-white">{title}</p>
                            <p className="text-[11px] text-slate-400">{detail}</p>
                            <p className="text-xs text-emerald-400 mt-1">{score}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="h-4 flex items-center justify-center gap-1.5 shrink-0">
                    {[0, 1, 2].map((dot) => (
                      <span
                        key={dot}
                        className={`h-1 lg:h-1.5 rounded-full transition-all duration-300 ${activeView === dot ? 'w-3 lg:w-4 bg-primary' : 'w-1 lg:w-1.5 bg-slate-500/70'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="h-3 lg:h-6 xl:h-7 rounded-b-lg lg:rounded-b-2xl bg-gradient-to-b from-slate-600 to-slate-700 border-x border-slate-600/50 lg:border lg:border-slate-500/40 lg:shadow-[0_10px_18px_rgba(0,0,0,0.45)]" />
              <div className="mx-auto -mt-2 w-20 h-1.5 rounded-full bg-slate-800/80 hidden lg:block" />
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[78%] h-5 rounded-full bg-black/35 blur-md -z-10 hidden lg:block" />
          </div>
        </div>
      </div>
    </section>
  )
}
