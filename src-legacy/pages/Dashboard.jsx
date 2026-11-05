import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  addTradeUpdate,
  createPaymentRequest,
  deleteTrader,
  listAccounts,
  listPayments,
  listTrades,
  listTraders,
  listUsers,
  seedDemoTraders,
  updatePaymentStatus,
  upsertAccount,
  upsertTrader,
} from '../lib/tradingAdminApi'

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('Dashboard')
  const [expandedMenus, setExpandedMenus] = useState({
    Payments: true,
    'Trade History': true,
    'Market Tools': true,
    More: true,
  })

  const toggleMenu = (menuLabel) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuLabel]: !prev[menuLabel],
    }))
  }

  const sidebarItems = [
    { label: 'Dashboard' },
    {
      label: 'Payments',
      children: [{ label: 'Deposit' }, { label: 'Withdrawal' }],
    },
    { label: 'Copytrading' },
    { label: 'Traders' },
    {
      label: 'Trade History',
      children: [{ label: 'Copy Trade History' }, { label: 'Demo Trade History' }],
    },
    { label: 'All Transactions' },
    {
      label: 'Market Tools',
      children: [{ label: 'Technical Insights' }, { label: 'Trading Courses' }, { label: 'Economic Calendar' }],
    },
    { label: 'Loyalty Status' },
    {
      label: 'More',
      children: [
        { label: 'Settings' },
        { label: 'All Notifications' },
        { label: 'Account Verification' },
        { label: 'Login History' },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-[#050816] text-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-60 bg-[#050712] border-r border-[#111827] flex flex-col">
        <div className="h-14 px-5 flex items-center border-b border-[#111827]">
          <div className="flex flex-col">
            <span className="text-[11px] text-slate-400">interactiveprimetrd.com</span>
            <span className="text-sm font-semibold tracking-wide">
              <span className="text-primary">Interactive Prime Trade</span>
            </span>
          </div>
        </div>

        <nav className="flex-1 py-4 text-sm">
          <DashboardSidebarNav
            items={sidebarItems}
            active={activeSection}
            expanded={expandedMenus}
            onToggle={toggleMenu}
            onSelect={setActiveSection}
          />
        </nav>

        <div className="border-t border-[#111827] py-3 text-sm">
          <button
            className="w-full px-5 py-2 text-left text-slate-300 hover:bg-[#0b1020]"
            onClick={async () => {
              await signOut()
              navigate('/auth')
            }}
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col">
        {/* Dashboard header with profile */}
        <header className="h-14 border-b border-[#111827] flex items-center justify-between px-6 bg-[#050816]">
          <div className="flex items-center gap-3">
            <button className="px-3 py-1.5 text-xs rounded-full bg-[#111827] text-slate-200 border border-[#1f2937]">
              Copy referral link
            </button>
            <span className="hidden md:inline text-[11px] text-slate-400">
              Invite friends and earn a share when they copy trade.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-3 py-1.5 text-xs rounded-full bg-[#111827] text-slate-200 border border-[#1f2937]">
              Practice area
            </button>
            <div className="flex items-center gap-2 text-xs">
              <span className="hidden sm:inline text-slate-300">
                {user?.email || 'User'}
              </span>
              <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/60 flex items-center justify-center text-[11px] font-semibold uppercase">
                {(user?.email || 'U')[0]}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-[#050816]">
          <div className="px-6 pt-5 pb-10 space-y-6">
            {activeSection === 'Dashboard' && (
              <DashboardHome
                onDepositClick={() => setActiveSection('Deposit')}
                onKycClick={() => setActiveSection('Account Verification')}
              />
            )}

            {activeSection === 'Deposit' && <PaymentsSection />}
            {activeSection === 'Withdrawal' && <PlaceholderSection title="Withdrawal" />}
            {activeSection === 'Copytrading' && <CopytradingSection />}
            {activeSection === 'Traders' && <TradersSection />}
            {activeSection === 'Copy Trade History' && <PlaceholderSection title="Copy Trade History" />}
            {activeSection === 'Demo Trade History' && <PlaceholderSection title="Demo Trade History" />}
            {activeSection === 'All Transactions' && <PlaceholderSection title="All Transactions" />}
            {activeSection === 'Technical Insights' && <PlaceholderSection title="Technical Insights" />}
            {activeSection === 'Trading Courses' && <PlaceholderSection title="Trading Courses" />}
            {activeSection === 'Economic Calendar' && <PlaceholderSection title="Economic Calendar" />}
            {activeSection === 'Loyalty Status' && <PlaceholderSection title="Loyalty Status" />}
            {activeSection === 'Settings' && <AdminSection />}
            {activeSection === 'All Notifications' && <PlaceholderSection title="All Notifications" />}
            {activeSection === 'Account Verification' && <KycSection />}
            {activeSection === 'Login History' && <PlaceholderSection title="Login History" />}
          </div>
        </main>
      </div>
    </div>
  )
}

function DashboardSidebarNav({ items, active, expanded, onToggle, onSelect }) {
  return (
    <ul>
      {items.map((item) => {
        const hasChildren = Array.isArray(item.children) && item.children.length > 0
        const isExpanded = !!expanded[item.label]
        const isParentActive = hasChildren && item.children.some((child) => child.label === active)
        const isActive = active === item.label || isParentActive

        return (
          <li key={item.label}>
            <button
              type="button"
              onClick={() => {
                if (hasChildren) {
                  onToggle(item.label)
                } else {
                  onSelect(item.label)
                }
              }}
              className={`w-full text-left px-5 py-2.5 text-sm transition-colors flex items-center justify-between ${
                isActive ? 'bg-[#111827] text-slate-50 border-r-2 border-primary' : 'text-slate-300 hover:bg-[#0b1020]'
              }`}
            >
              <span>{item.label}</span>
              {hasChildren && <span className="text-xs text-slate-500">{isExpanded ? 'v' : '>'}</span>}
            </button>

            {hasChildren && isExpanded && (
              <ul className="pb-1">
                {item.children.map((child) => {
                  const childActive = active === child.label
                  return (
                    <li key={child.label}>
                      <button
                        type="button"
                        onClick={() => onSelect(child.label)}
                        className={`w-full text-left px-10 py-1.5 text-sm transition-colors ${
                          childActive
                            ? 'text-slate-200 bg-[#0b1020] border-r-2 border-primary'
                            : 'text-slate-500 hover:text-slate-300 hover:bg-[#0b1020]'
                        }`}
                      >
                        {child.label}
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </li>
        )
      })}
    </ul>
  )
}

function DashboardHome({ onDepositClick, onKycClick }) {
  const chartSymbols = [
    { label: 'Apple', value: 'NASDAQ:AAPL' },
    { label: 'Google', value: 'NASDAQ:GOOGL' },
    { label: 'Microsoft', value: 'NASDAQ:MSFT' },
    { label: 'NVDA', value: 'NASDAQ:NVDA' },
    { label: 'AMZN', value: 'NASDAQ:AMZN' },
  ]
  const chartIntervals = ['1D', '1W', '1M', '1Y']
  const [selectedSymbol, setSelectedSymbol] = useState(chartSymbols[0].value)
  const [selectedInterval, setSelectedInterval] = useState('1D')
  const [featuredTraders, setFeaturedTraders] = useState([])
  const sliderRef = useRef(null)

  useEffect(() => {
    let mounted = true
    async function loadFeatured() {
      const rows = await listTraders()
      if (mounted) setFeaturedTraders((rows || []).slice(0, 18))
    }
    loadFeatured()
    return () => {
      mounted = false
    }
  }, [])

  const slideTraders = (direction) => {
    if (!sliderRef.current) return
    const amount = 300
    sliderRef.current.scrollBy({ left: direction === 'next' ? amount : -amount, behavior: 'smooth' })
  }

  return (
    <>
      <div className="space-y-2">
        <InfoBanner>
          Your balance is empty.{' '}
          <button
            type="button"
            onClick={onDepositClick}
            className="text-primary underline underline-offset-2"
          >
            Make a deposit
          </button>{' '}
          to start copying trades.
        </InfoBanner>
        <InfoBanner>
          We need your KYC data for some actions.{' '}
          <button
            type="button"
            onClick={onKycClick}
            className="text-primary underline underline-offset-2"
          >
            Provide KYC data
          </button>{' '}
          when you&apos;re ready.
        </InfoBanner>
      </div>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="bg-[#050712] border border-[#111827] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-slate-400">Total balance</p>
              <p className="text-2xl font-semibold text-white mt-1">$0</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-primary text-xs font-semibold">
              Copy
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs text-slate-300 mb-4">
            <SummaryPill label="Deposit" value="$0" />
            <SummaryPill label="Interest" value="$0" />
            <SummaryPill label="Trades" value="0" />
          </div>

          <div className="flex gap-3 text-xs">
            <button
              type="button"
              onClick={onDepositClick}
              className="flex-1 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white font-medium"
            >
              Deposit
            </button>
            <button className="flex-1 py-2 rounded-lg border border-[#1f2937] text-slate-200 hover:bg-[#0b1020]">
              Withdraw
            </button>
          </div>
        </div>

        <div className="xl:col-span-2 bg-[#050712] border border-[#111827] rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-slate-400">Top traders (slide to view all)</p>
            <div className="flex gap-2">
              <button type="button" onClick={() => slideTraders('prev')} className="px-2 py-1 rounded bg-[#111827] text-slate-300 text-xs">{'<'}</button>
              <button type="button" onClick={() => slideTraders('next')} className="px-2 py-1 rounded bg-[#111827] text-slate-300 text-xs">{'>'}</button>
            </div>
          </div>
          <div ref={sliderRef} className="flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory">
            {featuredTraders.length === 0 ? (
              <div className="w-full rounded-lg border border-[#1f2937] bg-[#0b1020] px-4 py-6 text-xs text-slate-400">
                No traders yet. Ask admin to add traders in More {'>'} Settings.
              </div>
            ) : (
              featuredTraders.map((trader) => (
                <div key={trader.id} className="snap-start min-w-[260px] max-w-[260px]">
                  <TraderCard
                    name={trader.name || 'Trader'}
                    risk={trader.risk || 'Low'}
                    assetClass={trader.style || 'Mixed'}
                    monthly={`+${Number(trader.monthly_profit ?? 0)}%`}
                    yearly={`+${Number(trader.yearly_profit ?? 0)}%`}
                    experience={`${Number(trader.experience_years ?? 0)} yrs`}
                    fee={`${Number(trader.fee_percent ?? 10)}%`}
                    avatarUrl={trader.avatar_url || ''}
                    minCapital={Number(trader.min_capital ?? 3000)}
                    copiers={Number(trader.copiers ?? 0)}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel title="Recent trades">
          <EmptyState label="No trades found yet. Once you start copying, your trades will appear here." />
        </Panel>
        <Panel title="Recent transactions">
          <EmptyState label="No transactions yet. Deposits and withdrawals will show here." />
        </Panel>
      </section>

      <section className="bg-[#050712] border border-[#111827] rounded-xl p-4 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            {chartSymbols.map((symbol) => (
              <AssetChip
                key={symbol.value}
                active={selectedSymbol === symbol.value}
                onClick={() => setSelectedSymbol(symbol.value)}
              >
                {symbol.label}
              </AssetChip>
            ))}
          </div>
          <div className="flex gap-2 text-[11px] text-slate-400">
            {chartIntervals.map((interval) => (
              <button
                key={interval}
                type="button"
                onClick={() => setSelectedInterval(interval)}
                className={`px-2 py-1 rounded ${
                  selectedInterval === interval ? 'bg-[#111827] text-slate-200' : 'hover:bg-[#111827]'
                }`}
              >
                {interval}
              </button>
            ))}
          </div>
        </div>

        <LiveMarketChart symbol={selectedSymbol} interval={selectedInterval} />
      </section>
    </>
  )
}

function InfoBanner({ children }) {
  return (
    <div className="flex items-start gap-2 rounded-md bg-[#111827] border border-[#1f2937] px-3 py-2 text-xs text-slate-200">
      <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-amber-400" />
      <p>{children}</p>
    </div>
  )
}

function PaymentsSection() {
  const { user } = useAuth()
  const methodOptions = [
    'Bitcoin BTC',
    'Usdt ERC20',
    'Ethereum ETH',
    'Usdt TRC20',
    'Solana SOL',
    'Xrp XRP',
    'Shiba INU',
    'USDC ERC20',
    'ETH Arbitrum',
    'Dogecoin DOGE',
  ]
  const [selectedMethod, setSelectedMethod] = useState(methodOptions[0])
  const [showMethodOptions, setShowMethodOptions] = useState(false)
  const [amountUsd, setAmountUsd] = useState('$0.00')
  const [amountCrypto, setAmountCrypto] = useState('0')
  const [minimumDeposit, setMinimumDeposit] = useState('1')
  const [submitting, setSubmitting] = useState(false)
  const [notice, setNotice] = useState('')

  const parseMoney = (value) => Number(String(value).replace(/[^0-9.-]/g, '')) || 0

  const submitDepositRequest = async () => {
    setSubmitting(true)
    setNotice('')
    try {
      await createPaymentRequest({
        user_email: user?.email || 'unknown@user',
        user_clerk_id: user?.id || '',
        amount_usd: parseMoney(amountUsd),
        amount_crypto: parseMoney(amountCrypto),
        method: selectedMethod,
        status: 'pending',
        notes: `Minimum deposit shown: ${minimumDeposit}`,
      })
      setNotice('Deposit request submitted. Admin will review and credit your account.')
    } catch {
      setNotice('Could not submit deposit request right now. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="min-h-[70vh] flex items-center justify-center py-4">
      <div className="w-full max-w-[380px] rounded-md border border-[#111b2f] bg-[#040b1b]/95 shadow-[0_0_0_1px_rgba(16,32,61,0.35)] p-4">
        <h2 className="text-[22px] font-semibold text-white mb-4 leading-none">Start Deposit</h2>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="relative">
            <label className="block text-xs text-slate-200 mb-1.5">Select Method</label>
            <button
              type="button"
              onClick={() => setShowMethodOptions((prev) => !prev)}
              className="w-full h-10 rounded-md border border-[#253a66] bg-[#0d1a34] text-left px-3 text-base text-white flex items-center justify-between"
            >
              <span>{selectedMethod}</span>
              <span className="text-slate-300 text-xs">{showMethodOptions ? 'v' : '>'}</span>
            </button>

            {showMethodOptions && (
              <ul className="absolute z-20 mt-1 w-full rounded-md border border-[#2e4778] bg-[#0d1a34] max-h-52 overflow-y-auto shadow-lg">
                {methodOptions.map((method) => {
                  const isSelected = method === selectedMethod
                  return (
                    <li key={method}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedMethod(method)
                          setShowMethodOptions(false)
                        }}
                        className={`w-full px-3 py-1.5 text-left text-sm ${
                          isSelected
                            ? 'bg-[#11a8ff] text-[#03132a] font-semibold'
                            : 'text-slate-100 hover:bg-[#11254a]'
                        }`}
                      >
                        {method}
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          <div>
            <label className="block text-xs text-slate-200 mb-1.5">Amount in USD</label>
            <input
              value={amountUsd}
              onChange={(e) => setAmountUsd(e.target.value)}
              className="w-full h-10 rounded-md border border-[#253a66] bg-[#0d1a34] px-3 text-base text-white placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="block text-xs text-slate-200 mb-1.5">Amount in Bitcoin</label>
          <input
            value={amountCrypto}
            onChange={(e) => setAmountCrypto(e.target.value)}
            className="w-full h-10 rounded-md border border-[#253a66] bg-[#0d1a34] px-3 text-base text-white placeholder:text-slate-400"
          />
        </div>

        <div className="mb-4">
          <label className="block text-xs text-slate-200 mb-1.5">Minimum Deposit</label>
          <input
            value={minimumDeposit}
            onChange={(e) => setMinimumDeposit(e.target.value)}
            className="w-full h-10 rounded-md border border-[#253a66] bg-[#0d1a34] px-3 text-base text-white placeholder:text-slate-400"
          />
        </div>

        <button
          type="button"
          onClick={submitDepositRequest}
          disabled={submitting}
          className="w-full h-10 rounded-md bg-primary hover:bg-primary-dark disabled:opacity-60 text-white text-lg font-medium"
        >
          {submitting ? 'Submitting...' : 'Deposit'}
        </button>
        {notice && <p className="mt-3 text-xs text-slate-300">{notice}</p>}
      </div>
    </section>
  )
}

function KycSection() {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-white">KYC verification</h2>
      <p className="text-sm text-slate-300">
        To comply with regulations and keep your account secure, we&apos;ll collect a few personal details and a
        government-issued ID.
      </p>

      <div className="bg-[#050712] border border-[#111827] rounded-xl p-4 space-y-4 text-sm">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs mb-1 text-slate-400">Full name</label>
            <input className="w-full rounded-md bg-[#020617] border border-[#1f2937] px-3 py-2 text-xs" />
          </div>
          <div>
            <label className="block text-xs mb-1 text-slate-400">Date of birth</label>
            <input type="date" className="w-full rounded-md bg-[#020617] border border-[#1f2937] px-3 py-2 text-xs" />
          </div>
          <div>
            <label className="block text-xs mb-1 text-slate-400">Document type</label>
            <select className="w-full rounded-md bg-[#020617] border border-[#1f2937] px-3 py-2 text-xs">
              <option>National ID</option>
              <option>Driver&apos;s license</option>
              <option>Passport</option>
            </select>
          </div>
          <div>
            <label className="block text-xs mb-1 text-slate-400">Country of issue</label>
            <input className="w-full rounded-md bg-[#020617] border border-[#1f2937] px-3 py-2 text-xs" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs mb-1 text-slate-400">Front of document</label>
            <input type="file" className="w-full text-xs text-slate-300" />
          </div>
          <div>
            <label className="block text-xs mb-1 text-slate-400">Back of document</label>
            <input type="file" className="w-full text-xs text-slate-300" />
          </div>
        </div>

        <button className="mt-2 inline-flex items-center justify-center px-4 py-2 rounded-md bg-primary hover:bg-primary-dark text-xs font-semibold text-white">
          Submit KYC for review
        </button>
      </div>
    </section>
  )
}

function CopytradingSection() {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-white">Copytrading</h2>
      <p className="text-sm text-slate-300">
        Here you&apos;ll later see curated strategies and traders.
      </p>
      <Panel title="Featured traders">
        <EmptyState label="Admin can configure featured traders in the Admin panel under 'More'." />
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
    capital: Number(t.min_capital ?? 10000),
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
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-[#2f3d5f] bg-[#0b1020] shrink-0">
                    {trader.avatar ? (
                      <img src={trader.avatar} alt={trader.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm text-slate-300">{trader.name[0]}</div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-semibold truncate">{trader.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${riskBadge(trader.risk)}`}>{trader.risk}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-sky-500/15 text-sky-300 border border-sky-500/30">{trader.style}</span>
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
                  ${trader.capital.toLocaleString()} <span className="text-slate-500 ml-2">{trader.copiers} copiers</span>
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
        <EmptyState label="This section is a placeholder for future data and functionality." />
      </Panel>
    </section>
  )
}

function AdminSection() {
  const { user, isAdmin } = useAuth()
  const canAccessAdmin = isAdmin

  const [tab, setTab] = useState('traders')
  const [traders, setTraders] = useState([])
  const [payments, setPayments] = useState([])
  const [accounts, setAccounts] = useState([])
  const [trades, setTrades] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [notice, setNotice] = useState('')

  const [traderForm, setTraderForm] = useState({
    id: '',
    name: '',
    avatar_url: '',
    risk: 'Low',
    style: 'Mixed',
    monthly_profit: 90,
    yearly_profit: 95,
    win_rate: 90,
    experience_years: 8,
    fee_percent: 10,
    min_capital: 10000,
    copiers: 0,
    status: 'ACTIVE',
    bio: '',
  })

  const [accountForm, setAccountForm] = useState({
    user_email: '',
    balance: 0,
    profit: 0,
    status: 'active',
  })

  const [tradeForm, setTradeForm] = useState({
    user_email: '',
    trader_name: '',
    pnl: 0,
    result: 'profit',
    notes: '',
  })

  const loadAdminData = async () => {
    setLoading(true)
    const [t, p, a, tr, u] = await Promise.all([listTraders(), listPayments(), listAccounts(), listTrades(), listUsers()])
    setTraders(t || [])
    setPayments(p || [])
    setAccounts(a || [])
    setTrades(tr || [])
    setUsers(u || [])
    setLoading(false)
  }

  useEffect(() => {
    loadAdminData()
  }, [])

  const saveTrader = async () => {
    if (!traderForm.name.trim()) return
    await upsertTrader(traderForm)
    setNotice('Trader saved successfully.')
    setTraderForm({
      id: '',
      name: '',
      avatar_url: '',
      risk: 'Low',
      style: 'Mixed',
      monthly_profit: 90,
      yearly_profit: 95,
      win_rate: 90,
      experience_years: 8,
      fee_percent: 10,
      min_capital: 10000,
      copiers: 0,
      status: 'ACTIVE',
      bio: '',
    })
    loadAdminData()
  }

  const editTrader = (trader) => {
    setTraderForm({
      id: trader.id,
      name: trader.name || '',
      avatar_url: trader.avatar_url || '',
      risk: trader.risk || 'Low',
      style: trader.style || 'Mixed',
      monthly_profit: Number(trader.monthly_profit ?? 0),
      yearly_profit: Number(trader.yearly_profit ?? 0),
      win_rate: Number(trader.win_rate ?? 0),
      experience_years: Number(trader.experience_years ?? 0),
      fee_percent: Number(trader.fee_percent ?? 10),
      min_capital: Number(trader.min_capital ?? 10000),
      copiers: Number(trader.copiers ?? 0),
      status: trader.status || 'ACTIVE',
      bio: trader.bio || '',
    })
    setTab('traders')
  }

  const removeTrader = async (id) => {
    await deleteTrader(id)
    setNotice('Trader removed.')
    loadAdminData()
  }

  const changePaymentStatus = async (payment, status) => {
    await updatePaymentStatus(payment.id, status)
    if (status === 'approved') {
      const existing = accounts.find(
        (a) => (a.user_email || '').toLowerCase() === (payment.user_email || '').toLowerCase()
      )
      const currentBalance = Number(existing?.balance || 0)
      const amount = Number(payment.amount_usd || 0)
      await upsertAccount({
        ...existing,
        user_email: payment.user_email,
        balance: currentBalance + amount,
        profit: Number(existing?.profit || 0),
        status: existing?.status || 'active',
      })
    }
    setNotice(`Payment ${status}.`)
    loadAdminData()
  }

  const saveAccount = async () => {
    if (!accountForm.user_email.trim()) return
    await upsertAccount(accountForm)
    setNotice('Account updated.')
    setAccountForm({ user_email: '', balance: 0, profit: 0, status: 'active' })
    loadAdminData()
  }

  const saveTradeUpdate = async () => {
    if (!tradeForm.user_email.trim() || !tradeForm.trader_name.trim()) return
    await addTradeUpdate(tradeForm)
    const existing = accounts.find(
      (a) => (a.user_email || '').toLowerCase() === tradeForm.user_email.toLowerCase()
    )
    const pnlValue = Number(tradeForm.pnl || 0)
    await upsertAccount({
      ...existing,
      user_email: tradeForm.user_email,
      balance: Number(existing?.balance || 0) + pnlValue,
      profit: Number(existing?.profit || 0) + pnlValue,
      status: existing?.status || 'active',
    })
    setNotice('Trade and profit update saved.')
    setTradeForm({ user_email: '', trader_name: '', pnl: 0, result: 'profit', notes: '' })
    loadAdminData()
  }

  if (!canAccessAdmin) {
    return (
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">Admin Control</h2>
        <p className="text-sm text-slate-300">
          This area is restricted. Admin access is required.
        </p>
      </section>
    )
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">Admin Control Center</h2>
          <p className="text-sm text-slate-400">Manage traders, payments, user balances, and profit updates.</p>
        </div>
        <button
          type="button"
          onClick={loadAdminData}
          className="px-3 py-2 rounded-lg text-sm border border-[#1f2937] bg-[#0a1328] hover:bg-[#0f1a33]"
        >
          Refresh Data
        </button>
      </div>
      {notice && <p className="text-xs text-emerald-300">{notice}</p>}

      <div className="flex flex-wrap gap-2">
        {[
          ['traders', 'Traders'],
          ['payments', 'Payments'],
          ['accounts', 'Accounts & Profits'],
          ['users', 'Users'],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`px-3 py-1.5 rounded-lg text-sm ${
              tab === id ? 'bg-primary text-white' : 'bg-[#0a1328] text-slate-300 border border-[#1f2937]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <Panel title="Loading admin data">
          <EmptyState label="Loading..." />
        </Panel>
      ) : (
        <>
          {tab === 'traders' && (
            <div className="grid xl:grid-cols-[360px_1fr] gap-4">
              <div className="bg-[#050712] border border-[#111827] rounded-xl p-4 space-y-2">
                <h3 className="text-sm font-semibold text-white">{traderForm.id ? 'Edit Trader' : 'Add Trader'}</h3>
                <input value={traderForm.name} onChange={(e) => setTraderForm((p) => ({ ...p, name: e.target.value }))} placeholder="Trader name" className="w-full rounded-md bg-[#020617] border border-[#1f2937] px-3 py-2 text-xs" />
                <input value={traderForm.avatar_url} onChange={(e) => setTraderForm((p) => ({ ...p, avatar_url: e.target.value }))} placeholder="Avatar URL" className="w-full rounded-md bg-[#020617] border border-[#1f2937] px-3 py-2 text-xs" />
                <div className="grid grid-cols-2 gap-2">
                  <select value={traderForm.risk} onChange={(e) => setTraderForm((p) => ({ ...p, risk: e.target.value }))} className="rounded-md bg-[#020617] border border-[#1f2937] px-2 py-2 text-xs"><option>Low</option><option>Medium</option><option>High</option></select>
                  <input value={traderForm.style} onChange={(e) => setTraderForm((p) => ({ ...p, style: e.target.value }))} placeholder="Style e.g Mixed" className="rounded-md bg-[#020617] border border-[#1f2937] px-3 py-2 text-xs" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input type="number" value={traderForm.monthly_profit} onChange={(e) => setTraderForm((p) => ({ ...p, monthly_profit: Number(e.target.value) }))} placeholder="Monthly %" className="rounded-md bg-[#020617] border border-[#1f2937] px-2 py-2 text-xs" />
                  <input type="number" value={traderForm.yearly_profit} onChange={(e) => setTraderForm((p) => ({ ...p, yearly_profit: Number(e.target.value) }))} placeholder="Yearly %" className="rounded-md bg-[#020617] border border-[#1f2937] px-2 py-2 text-xs" />
                  <input type="number" value={traderForm.win_rate} onChange={(e) => setTraderForm((p) => ({ ...p, win_rate: Number(e.target.value) }))} placeholder="Win %" className="rounded-md bg-[#020617] border border-[#1f2937] px-2 py-2 text-xs" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input type="number" value={traderForm.experience_years} onChange={(e) => setTraderForm((p) => ({ ...p, experience_years: Number(e.target.value) }))} placeholder="Exp yrs" className="rounded-md bg-[#020617] border border-[#1f2937] px-2 py-2 text-xs" />
                  <input type="number" value={traderForm.fee_percent} onChange={(e) => setTraderForm((p) => ({ ...p, fee_percent: Number(e.target.value) }))} placeholder="Fee %" className="rounded-md bg-[#020617] border border-[#1f2937] px-2 py-2 text-xs" />
                  <input type="number" value={traderForm.copiers} onChange={(e) => setTraderForm((p) => ({ ...p, copiers: Number(e.target.value) }))} placeholder="Copiers" className="rounded-md bg-[#020617] border border-[#1f2937] px-2 py-2 text-xs" />
                </div>
                <input type="number" value={traderForm.min_capital} onChange={(e) => setTraderForm((p) => ({ ...p, min_capital: Number(e.target.value) }))} placeholder="Min capital USD" className="w-full rounded-md bg-[#020617] border border-[#1f2937] px-3 py-2 text-xs" />
                <textarea value={traderForm.bio} onChange={(e) => setTraderForm((p) => ({ ...p, bio: e.target.value }))} placeholder="Short bio" rows={3} className="w-full rounded-md bg-[#020617] border border-[#1f2937] px-3 py-2 text-xs" />
                <button type="button" onClick={saveTrader} className="w-full py-2 rounded-md bg-primary hover:bg-primary-dark text-xs font-semibold text-white">
                  {traderForm.id ? 'Update Trader' : 'Add Trader'}
                </button>
              </div>

              <div className="bg-[#050712] border border-[#111827] rounded-xl p-4">
                <h3 className="text-sm font-semibold text-white mb-3">Trader Inventory ({traders.length})</h3>
                <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
                  {traders.map((t) => (
                    <div key={t.id} className="p-3 rounded-lg border border-[#1f2937] bg-[#060d1f] flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm text-white font-medium">{t.name}</p>
                        <p className="text-xs text-slate-400">
                          +{Number(t.monthly_profit || 0)}% monthly • {t.risk || 'Low'} • {t.style || 'Mixed'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => editTrader(t)} className="px-3 py-1.5 rounded bg-[#1e293b] text-xs">Edit</button>
                        <button type="button" onClick={() => removeTrader(t.id)} className="px-3 py-1.5 rounded bg-red-500/20 text-red-300 text-xs">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'payments' && (
            <div className="bg-[#050712] border border-[#111827] rounded-xl p-4">
              <h3 className="text-sm font-semibold text-white mb-3">User Payment Requests</h3>
              <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
                {payments.length === 0 && <p className="text-xs text-slate-400">No payment requests yet.</p>}
                {payments.map((p) => (
                  <div key={p.id} className="p-3 rounded-lg border border-[#1f2937] bg-[#060d1f] flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-white">{p.user_email || 'Unknown user'}</p>
                      <p className="text-xs text-slate-400">
                        ${Number(p.amount_usd || 0).toLocaleString()} • {p.method || '-'} • {p.status}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => changePaymentStatus(p, 'approved')} className="px-3 py-1.5 rounded bg-emerald-500/20 text-emerald-300 text-xs">Approve</button>
                      <button type="button" onClick={() => changePaymentStatus(p, 'rejected')} className="px-3 py-1.5 rounded bg-red-500/20 text-red-300 text-xs">Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'accounts' && (
            <div className="grid xl:grid-cols-2 gap-4">
              <div className="bg-[#050712] border border-[#111827] rounded-xl p-4 space-y-3">
                <h3 className="text-sm font-semibold text-white">Update User Account</h3>
                <input value={accountForm.user_email} onChange={(e) => setAccountForm((p) => ({ ...p, user_email: e.target.value }))} placeholder="User email" className="w-full rounded-md bg-[#020617] border border-[#1f2937] px-3 py-2 text-xs" />
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" value={accountForm.balance} onChange={(e) => setAccountForm((p) => ({ ...p, balance: Number(e.target.value) }))} placeholder="Balance USD" className="rounded-md bg-[#020617] border border-[#1f2937] px-3 py-2 text-xs" />
                  <input type="number" value={accountForm.profit} onChange={(e) => setAccountForm((p) => ({ ...p, profit: Number(e.target.value) }))} placeholder="Profit USD" className="rounded-md bg-[#020617] border border-[#1f2937] px-3 py-2 text-xs" />
                </div>
                <select value={accountForm.status} onChange={(e) => setAccountForm((p) => ({ ...p, status: e.target.value }))} className="w-full rounded-md bg-[#020617] border border-[#1f2937] px-3 py-2 text-xs">
                  <option value="active">active</option>
                  <option value="suspended">suspended</option>
                  <option value="pending">pending</option>
                </select>
                <button type="button" onClick={saveAccount} className="w-full py-2 rounded-md bg-primary hover:bg-primary-dark text-xs font-semibold text-white">
                  Save Account
                </button>

                <h3 className="text-sm font-semibold text-white pt-2">Post Trade/Profit Update</h3>
                <input value={tradeForm.user_email} onChange={(e) => setTradeForm((p) => ({ ...p, user_email: e.target.value }))} placeholder="User email" className="w-full rounded-md bg-[#020617] border border-[#1f2937] px-3 py-2 text-xs" />
                <input value={tradeForm.trader_name} onChange={(e) => setTradeForm((p) => ({ ...p, trader_name: e.target.value }))} placeholder="Trader name" className="w-full rounded-md bg-[#020617] border border-[#1f2937] px-3 py-2 text-xs" />
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" value={tradeForm.pnl} onChange={(e) => setTradeForm((p) => ({ ...p, pnl: Number(e.target.value) }))} placeholder="PnL USD (+/-)" className="rounded-md bg-[#020617] border border-[#1f2937] px-3 py-2 text-xs" />
                  <select value={tradeForm.result} onChange={(e) => setTradeForm((p) => ({ ...p, result: e.target.value }))} className="rounded-md bg-[#020617] border border-[#1f2937] px-3 py-2 text-xs">
                    <option value="profit">profit</option>
                    <option value="loss">loss</option>
                  </select>
                </div>
                <textarea value={tradeForm.notes} onChange={(e) => setTradeForm((p) => ({ ...p, notes: e.target.value }))} placeholder="Trade notes" rows={2} className="w-full rounded-md bg-[#020617] border border-[#1f2937] px-3 py-2 text-xs" />
                <button type="button" onClick={saveTradeUpdate} className="w-full py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white">
                  Save Trade Update
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-[#050712] border border-[#111827] rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-white mb-2">User Accounts</h3>
                  <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                    {accounts.length === 0 && <p className="text-xs text-slate-400">No accounts yet.</p>}
                    {accounts.map((a) => (
                      <div key={a.id || a.user_email} className="p-2 rounded border border-[#1f2937] bg-[#060d1f]">
                        <p className="text-xs text-white">{a.user_email}</p>
                        <p className="text-[11px] text-slate-400">
                          Balance: ${Number(a.balance || 0).toLocaleString()} • Profit: ${Number(a.profit || 0).toLocaleString()} • {a.status}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#050712] border border-[#111827] rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-white mb-2">Recent Trade Updates</h3>
                  <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                    {trades.length === 0 && <p className="text-xs text-slate-400">No trade updates yet.</p>}
                    {trades.map((t) => (
                      <div key={t.id} className="p-2 rounded border border-[#1f2937] bg-[#060d1f]">
                        <p className="text-xs text-white">{t.user_email} • {t.trader_name}</p>
                        <p className="text-[11px] text-slate-400">
                          PnL: ${Number(t.pnl || 0).toLocaleString()} • {t.result}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'users' && (
            <div className="bg-[#050712] border border-[#111827] rounded-xl p-4">
              <h3 className="text-sm font-semibold text-white mb-2">Signed-up Users</h3>
              <p className="text-xs text-slate-400 mb-3">
              Users come from the `profiles` table (auto-created when a user signs in after running the SQL schema).
              </p>
              <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
                {users.length === 0 && (
                  <div className="p-3 rounded border border-[#1f2937] bg-[#060d1f]">
                    <p className="text-xs text-slate-400">
                      No users found yet. Run the updated SQL and create at least one signup.
                    </p>
                  </div>
                )}
                {users.map((u) => (
                  <div key={u.id || u.email} className="p-3 rounded border border-[#1f2937] bg-[#060d1f]">
                    <p className="text-sm text-white">{u.full_name || 'User'}</p>
                    <p className="text-xs text-slate-400">{u.email || 'No email'}</p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Role: {u.role || 'user'} • Joined: {u.created_at ? new Date(u.created_at).toLocaleString() : '-'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  )
}

function SummaryPill({ label, value }) {
  return (
    <div className="rounded-lg bg-[#0b1020] border border-[#1f2937] px-3 py-2">
      <p className="text-[11px] text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-white">{value}</p>
    </div>
  )
}

function TraderCard({ name, risk, assetClass, monthly, yearly, experience, fee, avatarUrl = '', minCapital = 3000, copiers = 0 }) {
  return (
    <div className="bg-[#050712] border border-[#111827] rounded-xl p-4 flex flex-col justify-between">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/60 overflow-hidden flex items-center justify-center text-xs font-semibold">
          {avatarUrl ? <img src={avatarUrl} alt={name} className="w-full h-full object-cover" /> : name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{name}</p>
          <p className="text-[11px] text-slate-400">
            {risk} • {assetClass}
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
        <p className="text-slate-400">Min. capital: ${Number(minCapital).toLocaleString()}</p>
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

function LiveMarketChart({ symbol, interval }) {
  const containerRef = useRef(null)
  const [chartError, setChartError] = useState(false)

  useEffect(() => {
    const intervalMap = {
      '1D': 'D',
      '1W': 'W',
      '1M': 'M',
      '1Y': '12M',
    }
    const tvInterval = intervalMap[interval] || 'D'
    const container = containerRef.current
    if (!container) return

    setChartError(false)
    container.innerHTML = ''

    // Official TradingView embed widget (no package install required).
    const widgetHost = document.createElement('div')
    widgetHost.className = 'tradingview-widget-container'
    widgetHost.style.height = '100%'
    widgetHost.style.width = '100%'

    const widgetNode = document.createElement('div')
    widgetNode.className = 'tradingview-widget-container__widget'
    widgetNode.style.height = '100%'
    widgetNode.style.width = '100%'
    widgetHost.appendChild(widgetNode)

    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
    script.async = true
    script.text = JSON.stringify({
      autosize: true,
      symbol,
      interval: tvInterval,
      timezone: 'Etc/UTC',
      theme: 'dark',
      style: '1',
      locale: 'en',
      hide_top_toolbar: true,
      hide_legend: false,
      allow_symbol_change: false,
      save_image: false,
      backgroundColor: '#050816',
      gridColor: 'rgba(148,163,184,0.08)',
      withdateranges: false,
    })
    widgetHost.appendChild(script)
    container.appendChild(widgetHost)

    const healthCheck = window.setTimeout(() => {
      const iframeExists = !!container.querySelector('iframe')
      if (!iframeExists) {
        setChartError(true)
      }
    }, 5000)

    return () => window.clearTimeout(healthCheck)
  }, [symbol, interval])

  return (
    <div className="relative h-64 rounded-lg border border-[#1f2937] overflow-hidden bg-[#050816]">
      <div id="tv-market-chart" ref={containerRef} className="h-full w-full" />
      {chartError && (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400 px-4 text-center bg-[#050816]">
          Unable to load TradingView in this browser session. Refresh the page, disable strict ad/script blockers, or
          open in a normal browser tab.
        </div>
      )}
    </div>
  )
}

function AssetChip({ children, active = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-[11px] ${
        active ? 'bg-[#111827] text-slate-100' : 'bg-transparent text-slate-400 hover:bg-[#111827]'
      }`}
    >
      {children}
    </button>
  )
}


