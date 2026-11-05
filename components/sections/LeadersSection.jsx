'use client'
import Link from 'next/link'
import Avatar from '../Avatar'
import { MiniChart } from '../icons/FeatureIcons'

const leaders = [
  { name: 'Thinh Ph...', tag: null, gain: '+48%', allTime: '+50%', risk: 'Medium risk', followers: 62, last7: 14, seed: 'Thinh', photo: 'https://i.pravatar.cc/100?img=12' },
  { name: 'Maximuz', tag: null, gain: '+122%', allTime: '+295%', risk: 'Medium risk', followers: 56, last7: 12, seed: 'Maximuz', photo: 'https://i.pravatar.cc/100?img=15' },
  { name: 'Axion', tag: null, gain: '+35%', allTime: '+236%', risk: 'Medium risk', followers: 87, last7: 11, seed: 'Axion', photo: 'https://i.pravatar.cc/100?img=32' },
  { name: 'DT Trading', tag: '1-3% daily', gain: '+75%', allTime: '+165%', risk: 'Medium risk', followers: 22, last7: 8, seed: 'DT', photo: 'https://i.pravatar.cc/100?img=48' },
  { name: 'EA TRADE_', tag: 'VIP GU Gold HY 500', gain: '+41%', allTime: '+108%', risk: 'Medium risk', followers: 13, last7: 7, seed: 'EA', photo: 'https://i.pravatar.cc/100?img=59' },
  { name: 'Forex Aut_ Prashant Goutam', tag: null, gain: '+32%', allTime: '+38%', risk: 'Medium risk', followers: 23, last7: 7, seed: 'Forex', photo: 'https://i.pravatar.cc/100?img=5' },
]

export default function LeadersSection() {
  return (
    <section id="leaders" className="py-12 lg:py-20 border-t border-dark-border bg-[#0a1429]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-w-0">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-center mb-2">
          More than 1000 leaders
        </h2>
        <p className="text-slate-400 text-[15px] lg:text-base text-center mb-8 lg:mb-12">
          to choose from in Interactive Prime Trade
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {leaders.map((leader) => (
            <div
              key={leader.name}
              className="p-5 rounded-xl bg-[#f8fafc] border border-[#dbe4f2] shadow-sm relative overflow-hidden min-w-0"
            >
              <div className="absolute bottom-0 right-0 w-32 h-20 lg:w-40 lg:h-24 opacity-20 pointer-events-none">
                <MiniChart className="w-full h-full text-[#8fb9f4]" points={[0.6, 0.4, 0.5, 0.7, 0.55, 0.8]} up />
              </div>
              <div className="flex items-start justify-between gap-3 mb-3 relative">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <Avatar
                    seed={leader.seed}
                    name={leader.name}
                    src={leader.photo}
                    className="w-11 h-11 rounded-full object-cover shrink-0 border border-[#d1d9e6]"
                  />
                  <div className="min-w-0">
                    <p className="text-[#1e293b] font-medium text-sm truncate">{leader.name}</p>
                    {leader.tag && <p className="text-slate-500 text-xs leading-tight">{leader.tag}</p>}
                  </div>
                </div>
                <Link href="/platform" className="shrink-0 px-4 py-2 rounded-xl bg-[#5ea1e8] text-white text-sm font-semibold hover:bg-[#4a93e4]">
                  COPY
                </Link>
              </div>
              <div className="mb-3 relative">
                <p className="text-[38px] leading-none font-bold text-[#2f7cdf]">{leader.gain}</p>
                <p className="text-slate-600 text-sm mt-1">Gain</p>
                <p className="text-slate-500 text-sm">{leader.allTime} All time gain</p>
              </div>
              <div className="flex items-center justify-between relative gap-2">
                <span className="px-2 py-1 rounded-full bg-[#fcefc9] text-[#a67c00] text-xs">{leader.risk}</span>
                <div className="text-right text-sm text-slate-500 leading-tight min-w-0">
                  <p>{leader.followers} Followers</p>
                  <p>{leader.last7} last 7d</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
