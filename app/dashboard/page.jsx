'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'
import ProtectedRoute from '@/components/ProtectedRoute'
import { NavIcon } from '@/components/dashboard/icons'
import UserDashboardHome, { UserAvatar } from '@/components/dashboard/UserDashboardHome'
import PlaceTradeSection from '@/components/dashboard/PlaceTradeSection'
import MarketsSection from '@/components/dashboard/MarketsSection'
import CommoditiesSection from '@/components/dashboard/CommoditiesSection'
import MyTradesSection from '@/components/dashboard/MyTradesSection'
import CopyTraderSection from '@/components/dashboard/CopyTraderSection'
import TransactionsSection from '@/components/dashboard/TransactionsSection'
import ClaimBonusSection from '@/components/dashboard/ClaimBonusSection'
import KycSection from '@/components/dashboard/KycSection'
import DepositSection from '@/components/dashboard/DepositSection'
import WithdrawSection from '@/components/dashboard/WithdrawSection'
import UpgradePlanSection from '@/components/dashboard/UpgradePlanSection'
import SettingsSection from '@/components/dashboard/SettingsSection'
import { displayName, usernameHandle } from '@/components/dashboard/userDisplay'
import { planDisplayName } from '@/lib/pricingPlans'
import { BRAND_NAME } from '@/lib/brand'
import { LanguageSwitcher } from '@/components/SiteTranslator'
import {
  deleteTrader,
  getMyPlan,
  listPayments,
  listTrades,
  listTraders,
  seedDemoTraders,
  upsertTrader,
} from '@/lib/tradingAdminApi'

function DashboardContent() {
  const { user, signOut } = useAuth()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('Home')
  const [sectionHistory, setSectionHistory] = useState([])
  const [accountPlan, setAccountPlan] = useState({ plan: 'basic', status: 'active' })

  useEffect(() => {
    if (!user) return
    let mounted = true
    getMyPlan()
      .then((data) => {
        if (!mounted) return
        if (data.pending) {
          setAccountPlan({ plan: data.pending.method || data.plan || 'basic', status: 'pending' })
        } else {
          setAccountPlan({ plan: data.plan || 'basic', status: data.status || 'active' })
        }
      })
      .catch(() => {})
    return () => {
      mounted = false
    }
  }, [user])

  useEffect(() => {
    const main = document.querySelector('main')
    if (main) main.scrollTo({ top: 0 })
  }, [activeSection])

  const goTo = (label) => {
    if (label !== activeSection) {
      setSectionHistory((prev) => [...prev.slice(-8), activeSection])
    }
    setActiveSection(label)
    setMobileNavOpen(false)
  }
  const goBack = () => {
    const previous = sectionHistory[sectionHistory.length - 1] || 'Home'
    setSectionHistory((prev) => prev.slice(0, -1))
    setActiveSection(previous)
    setMobileNavOpen(false)
  }

  const sidebarItems = [
    { label: 'Home', icon: 'home' },
    { label: 'Place Trade', icon: 'trade' },
    { label: 'Markets', icon: 'markets' },
    { label: 'Commodities', icon: 'commodities' },
    { label: 'My Trades', icon: 'trades' },
    { label: 'Copy Trader', icon: 'copy' },
    { label: 'Deposit', icon: 'deposit' },
    { label: 'Withdraw', icon: 'withdraw' },
    { label: 'KYC', icon: 'kyc' },
    { label: 'Claim Bonus', icon: 'bonus' },
    { label: 'All Transactions', icon: 'history' },
    { label: 'Upgrade Plan', icon: 'upgrade' },
  ]

  const handle = usernameHandle(user)

  return (
    <div className="h-dvh max-h-dvh bg-dark text-slate-100 flex overflow-hidden">
      {mobileNavOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          aria-label="Close menu"
          onClick={() => setMobileNavOpen(false)}
        />
      ) : null}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-[min(17rem,88vw)] bg-[#070b16] border-r border-dark-border flex flex-col transform transition-transform duration-200 ${
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="px-6 pt-6 pb-6 flex flex-col items-center text-center">
          <Link href="/" className="mb-5 text-sm font-bold leading-tight text-primary">
            {BRAND_NAME}
          </Link>
          <UserAvatar user={user} size="lg" />
          <p className="mt-3 text-base font-semibold text-white">{displayName(user)}</p>
          <p className="text-sm text-slate-400">@{handle}</p>
          <span className="mt-3 inline-flex items-center rounded-full border border-slate-500/70 px-3 py-1 text-[10px] font-semibold tracking-[0.14em] text-slate-200">
            {planDisplayName(accountPlan.plan, accountPlan.status).toUpperCase()}
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-4 text-sm">
          {sidebarItems.map((item) => {
            const isActive = activeSection === item.label
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => goTo(item.label)}
                className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 mb-0.5 transition-colors ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <NavIcon name={item.icon} className="w-[18px] h-[18px]" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="border-t border-dark-border px-3 py-3 text-sm space-y-0.5">
          <button
            type="button"
            onClick={() => goTo('Settings')}
            className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 ${
              activeSection === 'Settings' ? 'bg-primary/10 text-primary' : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <NavIcon name="settings" className="w-[18px] h-[18px]" />
            <span>Settings</span>
          </button>
          {user?.role === 'admin' && (
            <Link href="/admin" className="block px-3 py-2.5 text-amber-400 hover:bg-white/5 rounded-xl">
              Admin Panel
            </Link>
          )}
          <button
            className="w-full px-3 py-2.5 text-left text-slate-400 hover:text-white hover:bg-white/5 rounded-xl"
            onClick={async () => {
              await signOut()
            }}
          >
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        <header className="h-16 shrink-0 border-b border-dark-border flex items-center justify-between px-4 sm:px-6 bg-[#070b16]">
          <button
            type="button"
            className="lg:hidden p-2 -ml-1 rounded-lg text-slate-300 hover:bg-white/5"
            aria-label="Open menu"
            onClick={() => setMobileNavOpen(true)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="hidden lg:block" />

          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            <LanguageSwitcher compact />
            <button type="button" onClick={() => goTo('Settings')} className="text-slate-300 hover:text-white" aria-label="Notifications">
              <NavIcon name="bell" className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right leading-tight">
                <p className="text-sm text-white">{handle}</p>
                <p className="text-[10px] font-semibold tracking-[0.12em] text-slate-400">REAL ACCOUNT</p>
              </div>
              <UserAvatar user={user} size="sm" />
            </div>
          </div>
        </header>

        <main className="flex-1 min-h-0 overflow-y-auto overflow-x-clip overscroll-y-contain bg-dark">
          <div className="px-4 sm:px-6 lg:px-8 pt-6 pb-12">
            {activeSection === 'Home' && <UserDashboardHome onNavigate={goTo} />}
            {activeSection === 'Place Trade' && <PlaceTradeSection onBack={goBack} />}
            {activeSection === 'Markets' && <MarketsSection onBack={goBack} />}
            {activeSection === 'Commodities' && <CommoditiesSection onBack={goBack} />}
            {activeSection === 'My Trades' && <MyTradesSection onBack={goBack} />}
            {activeSection === 'Copy Trader' && <CopyTraderSection onBack={goBack} onNavigate={goTo} />}
            {activeSection === 'Deposit' && <DepositSection onBack={goBack} />}
            {activeSection === 'Withdraw' && <WithdrawSection onBack={goBack} />}
            {activeSection === 'KYC' && <KycSection onBack={goBack} />}
            {activeSection === 'Claim Bonus' && <ClaimBonusSection onBack={goBack} />}
            {activeSection === 'All Transactions' && <TransactionsSection onBack={goBack} />}
            {activeSection === 'Upgrade Plan' && (
              <UpgradePlanSection
                onBack={goBack}
                onNavigate={goTo}
                onPlanChange={(data) => {
                  const requested = data.requested || data.pending?.method
                  if (data.pending || data.status === 'pending') {
                    setAccountPlan({ plan: requested || data.plan || 'basic', status: 'pending' })
                    return
                  }
                  setAccountPlan({ plan: data.plan || 'basic', status: data.status || 'active' })
                }}
              />
            )}
            {activeSection === 'Settings' && <SettingsSection onBack={goBack} />}
          </div>
        </main>
      </div>
    </div>
  )
}

function TradeHistorySection({ type }) {
  const { user } = useAuth()
  const [trades, setTrades] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      const rows = await listTrades()
      if (mounted) {
        const filtered = (rows || []).filter((t) => t.user_clerk_id === user?.id || t.user_email === user?.email)
        setTrades(filtered)
        setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [user])

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-white">{type === 'copy' ? 'Copy Trade History' : 'Demo Trade History'}</h2>
      <Panel title={type === 'copy' ? 'Your copied trades' : 'Demo trades'}>
        {loading ? (
          <EmptyState label="Loading..." />
        ) : trades.length === 0 ? (
          <EmptyState label="No trades yet. Copy a trader to see your trade history here." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-400 border-b border-[#1f2937]">
                  <th className="pb-2 pr-4">Date</th>
                  <th className="pb-2 pr-4">Trader</th>
                  <th className="pb-2 pr-4">PnL</th>
                  <th className="pb-2">Result</th>
                </tr>
              </thead>
              <tbody>
                {trades.map((t) => (
                  <tr key={t.id} className="border-b border-[#1f2937]/50">
                    <td className="py-2 pr-4 text-slate-300">{t.created_at ? new Date(t.created_at).toLocaleString() : '-'}</td>
                    <td className="py-2 pr-4 text-white">{t.trader_name}</td>
                    <td className={`py-2 pr-4 font-medium ${Number(t.pnl) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      ${Number(t.pnl || 0).toLocaleString()}
                    </td>
                    <td className="py-2 text-slate-400">{t.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </section>
  )
}

function AllTransactionsSection() {
  const { user } = useAuth()
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      const rows = await listPayments()
      if (mounted) {
        const filtered = (rows || []).filter((p) => p.user_clerk_id === user?.id || p.user_email === user?.email)
        setPayments(filtered)
        setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [user])

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-white">All Transactions</h2>
      <Panel title="Deposits & Withdrawals">
        {loading ? (
          <EmptyState label="Loading..." />
        ) : payments.length === 0 ? (
          <EmptyState label="No transactions yet. Deposits and withdrawals will appear here." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-400 border-b border-[#1f2937]">
                  <th className="pb-2 pr-4">Date</th>
                  <th className="pb-2 pr-4">Type</th>
                  <th className="pb-2 pr-4">Amount</th>
                  <th className="pb-2 pr-4">Method</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-b border-[#1f2937]/50">
                    <td className="py-2 pr-4 text-slate-300">{p.created_at ? new Date(p.created_at).toLocaleString() : '-'}</td>
                    <td className="py-2 pr-4">
                      <span className={p.payment_type === 'withdrawal' ? 'text-amber-400' : 'text-emerald-400'}>
                        {p.payment_type === 'withdrawal' ? 'Withdrawal' : 'Deposit'}
                      </span>
                    </td>
                    <td className="py-2 pr-4 text-white">${Number(p.amount_usd || 0).toLocaleString()}</td>
                    <td className="py-2 pr-4 text-slate-400">{p.method || '-'}</td>
                    <td className="py-2 text-slate-400">{p.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </section>
  )
}

function TradersSection() {
  const [traders, setTraders] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [riskFilter, setRiskFilter] = useState('All')
  const [sortBy, setSortBy] = useState('monthly_profit')

  useEffect(() => {
    let mounted = true
    async function load() {
      const rows = await listTraders()
      if (mounted) {
        setTraders(rows || [])
        setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  const normalized = traders.map((t) => ({
    id: t.id,
    name: t.name || 'Unknown trader',
    avatar: t.avatar_url || '',
    risk: t.risk || t.risk_level || 'Low',
    style: t.style || t.asset_class || 'Mixed',
    monthly: Number(t.monthly_profit ?? t.monthly ?? 0),
    yearly: Number(t.yearly_profit ?? t.yearly ?? 0),
    winRate: Number(t.win_rate ?? 0),
    exp: Number(t.experience_years ?? t.experience ?? 0),
    fee: Number(t.fee_percent ?? t.fee ?? 10),
    copiers: Number(t.copiers ?? t.followers ?? 0),
    status: (t.status || 'ACTIVE').toUpperCase(),
    bio: t.bio || t.description || 'Professional trader',
  }))

  const filtered = normalized
    .filter((t) => {
      const needle = query.trim().toLowerCase()
      const hit =
        !needle ||
        t.name.toLowerCase().includes(needle) ||
        t.bio.toLowerCase().includes(needle) ||
        t.style.toLowerCase().includes(needle)
      const riskOk = riskFilter === 'All' || t.risk === riskFilter
      return hit && riskOk
    })
    .sort((a, b) => {
      if (sortBy === 'yearly_profit') return b.yearly - a.yearly
      if (sortBy === 'win_rate') return b.winRate - a.winRate
      return b.monthly - a.monthly
    })

  const riskBadge = (risk) => {
    if (risk === 'Low') return 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
    if (risk === 'Medium') return 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
    return 'bg-red-500/15 text-red-300 border border-red-500/30'
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-3xl font-semibold text-white">Copy Traders</h2>
        <p className="text-sm text-slate-400 mt-1">Choose from {filtered.length} professional traders and copy their strategies.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_auto] gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search traders by name, bio, or specialization"
          className="h-10 rounded-lg bg-[#070d1c] border border-[#1f2937] px-3 text-sm text-slate-200"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="h-10 rounded-lg bg-[#070d1c] border border-[#1f2937] px-3 text-sm text-slate-200"
        >
          <option value="monthly_profit">Monthly Profit</option>
          <option value="yearly_profit">Yearly Profit</option>
          <option value="win_rate">Win Rate</option>
        </select>
        <select
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value)}
          className="h-10 rounded-lg bg-[#070d1c] border border-[#1f2937] px-3 text-sm text-slate-200"
        >
          <option value="All">All Risk</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      {loading ? (
        <Panel title="Loading traders">
          <EmptyState label="Loading trader profiles..." />
        </Panel>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.length === 0 && (
            <div className="lg:col-span-2 xl:col-span-3 rounded-lg border border-[#1f2937] bg-[#0b1020] p-4">
              <p className="text-sm text-slate-300">No traders found yet.</p>
              <button
                type="button"
                onClick={async () => {
                  await seedDemoTraders()
                  const rows = await listTraders()
                  setTraders(rows || [])
                }}
                className="mt-3 px-3 py-1.5 rounded bg-primary text-white text-sm"
              >
                Load Demo Traders
              </button>
            </div>
          )}
          {filtered.map((trader) => (
            <div key={trader.id} className="rounded-xl bg-[#050712] border border-[#1a2a46] p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <TraderAvatar name={trader.name} avatarUrl={trader.avatar} size="md" />
                  <div className="min-w-0">
                    <p className="text-white font-semibold truncate">{trader.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${riskBadge(trader.risk)}`}>{trader.risk}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-primary/15 text-primary-light border border-primary/30">{trader.style}</span>
                    </div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  {trader.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                <div>
                  <p className="text-slate-500">Monthly</p>
                  <p className="text-emerald-400 font-semibold">+{trader.monthly}%</p>
                </div>
                <div>
                  <p className="text-slate-500">Yearly</p>
                  <p className="text-emerald-400 font-semibold">+{trader.yearly}%</p>
                </div>
                <div>
                  <p className="text-slate-500">Experience</p>
                  <p className="text-emerald-400 font-semibold">{trader.exp} Yrs</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                <p className="text-slate-400">Win Rate <span className="text-emerald-400 font-semibold ml-1">{trader.winRate}%</span></p>
                <p className="text-slate-400">Fee <span className="text-slate-200 font-semibold ml-1">{trader.fee}%</span></p>
              </div>

              <p className="text-xs text-slate-400 mt-2 line-clamp-1">{trader.bio}</p>

              <div className="mt-3 flex items-center justify-between">
                <p className="text-xs text-slate-300">
                  {trader.copiers} copiers
                </p>
                <button className="px-4 py-1.5 rounded-lg bg-[#334155] hover:bg-[#475569] text-sm text-white font-semibold">
                  Copy
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

function PlaceholderSection({ title }) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <Panel title={title}>
        <EmptyState label="This page is ready for the exact layout. Send the screenshot and it will be built to match." />
      </Panel>
    </section>
  )
}


function TraderAvatar({ name, avatarUrl, size = 'md' }) {
  const [imgError, setImgError] = useState(false)
  const showImg = avatarUrl && !imgError
  const sizeClass = size === 'sm' ? 'w-9 h-9 border-primary/60' : 'w-10 h-10'
  const textClass = size === 'sm' ? 'text-xs' : 'text-sm'
  return (
    <div className={`${sizeClass} rounded-full overflow-hidden border border-[#2f3d5f] bg-[#0b1020] shrink-0 flex items-center justify-center`}>
      {showImg ? (
        <img src={avatarUrl} alt={name} className="w-full h-full object-cover" onError={() => setImgError(true)} />
      ) : (
        <span className={`${textClass} font-semibold text-primary-light`}>{name?.[0] || '?'}</span>
      )}
    </div>
  )
}

function TraderCard({ name, risk, assetClass, monthly, yearly, experience, fee, avatarUrl = '', copiers = 0 }) {
  return (
    <div className="bg-[#050712] border border-[#111827] rounded-xl p-4 flex flex-col justify-between">
      <div className="flex items-center gap-3 mb-3">
        <TraderAvatar name={name} avatarUrl={avatarUrl} size="sm" />
        <div>
          <p className="text-sm font-semibold text-white">{name}</p>
          <p className="text-[11px] text-slate-400">
            {risk} - {assetClass}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-300 mb-3">
        <div>
          <p className="text-slate-400 text-[10px] uppercase">Monthly</p>
          <p className="mt-1 text-emerald-400 font-semibold">{monthly}</p>
        </div>
        <div>
          <p className="text-slate-400 text-[10px] uppercase">Yearly</p>
          <p className="mt-1 text-emerald-400 font-semibold">{yearly}</p>
        </div>
        <div>
          <p className="text-slate-400 text-[10px] uppercase">Experience</p>
          <p className="mt-1 text-slate-100 font-semibold">{experience}</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-300 mb-3">
        <p>Performance fee: {fee}</p>
      </div>
      <p className="text-[11px] text-slate-500 mb-2">{copiers} copiers</p>

      <button className="mt-auto w-full py-2 rounded-lg bg-primary hover:bg-primary-dark text-xs font-semibold text-white">
        Copy this trader
      </button>
    </div>
  )
}

function Panel({ title, children }) {
  return (
    <div className="bg-[#050712] border border-[#111827] rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
      </div>
      {children}
    </div>
  )
}

function EmptyState({ label }) {
  return (
    <div className="h-24 flex flex-col items-start justify-center text-xs text-slate-400">
      <p>{label}</p>
    </div>
  )
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}
