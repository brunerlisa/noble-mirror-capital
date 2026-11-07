'use client'

import { useEffect, useRef, useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import {
  addTradeUpdate,
  deleteTrader,
  listAccounts,
  listPayments,
  listTrades,
  listTraders,
  listUsers,
  updateKycStatus,
  updatePaymentStatus,
  upsertAccount,
  upsertTrader,
} from '@/lib/tradingAdminApi'
import { formatDateTime } from '@/components/dashboard/userDisplay'

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

export default function AdminControlCenter() {
  const { isAdmin } = useAuth()
  const canAccessAdmin = isAdmin

  const [tab, setTab] = useState('traders')
  const [traders, setTraders] = useState([])
  const [payments, setPayments] = useState([])
  const [accounts, setAccounts] = useState([])
  const [trades, setTrades] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [notice, setNotice] = useState('')
  const [noticeError, setNoticeError] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [updatingKycId, setUpdatingKycId] = useState('')
  const avatarFileRef = useRef(null)

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

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingAvatar(true)
    setNotice('')
    setNoticeError(false)
    try {
      const fd = new FormData()
      fd.append('file', file)
      if (traderForm.id) fd.append('traderId', traderForm.id)
      const res = await fetch('/api/upload/trader', {
        method: 'POST',
        body: fd,
        credentials: 'include',
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      setTraderForm((p) => ({ ...p, avatar_url: data.url }))
      setNotice('Photo uploaded. Click Add/Update Trader to save the trader.')
      setNoticeError(false)
    } catch (err) {
      setNoticeError(true)
      setNotice(
        err?.message ||
          'Upload failed. Ensure the Supabase "traders" storage bucket exists and you are signed in as admin.',
      )
    } finally {
      setUploadingAvatar(false)
      e.target.value = ''
    }
  }

  const loadAdminData = async () => {
    setLoading(true)
    const [t, p, a, tr, u] = await Promise.all([listTraders(), listPayments(), listAccounts(), listTrades(), listUsers()])
    setTraders(t || [])
    setPayments((p || []).filter((row) => row.payment_type !== 'bonus'))
    setAccounts(a || [])
    setTrades(tr || [])
    setUsers(u || [])
    setLoading(false)
  }

  useEffect(() => {
    if (canAccessAdmin) loadAdminData()
  }, [canAccessAdmin])

  const saveTrader = async () => {
    if (!traderForm.name.trim()) return
    await upsertTrader(traderForm)
    setNotice('Trader saved successfully.')
    setNoticeError(false)
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
      copiers: Number(trader.copiers ?? 0),
      status: trader.status || 'ACTIVE',
      bio: trader.bio || '',
    })
    setTab('traders')
  }

  const removeTrader = async (id) => {
    await deleteTrader(id)
    setNotice('Trader removed.')
    setNoticeError(false)
    loadAdminData()
  }

  const changePaymentStatus = async (payment, status) => {
    await updatePaymentStatus(payment.id, status)
    setNotice(`Payment ${status}.`)
    setNoticeError(false)
    loadAdminData()
  }

  const updateKyc = async (u, nextStatus) => {
    const key = u?.clerk_user_id || u?.email || ''
    if (!key) return
    setUpdatingKycId(key)
    setNotice('')
    setNoticeError(false)
    try {
      await updateKycStatus({
        clerk_user_id: u?.clerk_user_id || '',
        email: u?.email || '',
        kyc_status: nextStatus,
      })
      setNotice(`KYC ${nextStatus} for ${u.email || 'user'}.`)
      await loadAdminData()
    } catch (e) {
      setNotice(e?.message || 'Could not update KYC.')
      setNoticeError(true)
    } finally {
      setUpdatingKycId('')
    }
  }

  const saveAccount = async () => {
    if (!accountForm.user_email.trim()) return
    await upsertAccount(accountForm)
    setNotice('Account updated.')
    setNoticeError(false)
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
    setNoticeError(false)
    setTradeForm({ user_email: '', trader_name: '', pnl: 0, result: 'profit', notes: '' })
    loadAdminData()
  }

  if (!canAccessAdmin) {
    return (
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">Admin Control Center</h2>
        <p className="text-sm text-slate-300">
          This area is restricted. Set your profile <code className="text-primary">role</code> to{' '}
          <code className="text-primary">admin</code> in the Supabase <code className="text-primary">profiles</code> table.
        </p>
      </section>
    )
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-white">Admin Control Center</h1>
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
      {notice && (
        <p className={`text-xs ${noticeError ? 'text-red-300' : 'text-emerald-300'}`}>{notice}</p>
      )}

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
                <div className="space-y-2">
                  <p className="text-xs text-slate-400">Trader photo</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      ref={avatarFileRef}
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => avatarFileRef.current?.click()}
                      disabled={uploadingAvatar}
                      className="px-3 py-2 rounded-md bg-[#1e293b] text-xs text-slate-200 hover:bg-[#334155] disabled:opacity-60"
                    >
                      {uploadingAvatar ? 'Uploading...' : 'Choose photo'}
                    </button>
                    {traderForm.avatar_url ? (
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-[#1f2937] bg-[#0b1020] shrink-0">
                        <img src={traderForm.avatar_url} alt="" className="w-full h-full object-cover" />
                      </div>
                    ) : null}
                  </div>
                  <p className="text-[11px] text-slate-500">JPEG, PNG, GIF, or WebP, max 2MB.</p>
                </div>
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
            <div className="grid xl:grid-cols-2 gap-4">
              <div className="bg-[#050712] border border-[#111827] rounded-xl p-4">
                <h3 className="text-sm font-semibold text-white mb-2">Signed-up Users</h3>
                <p className="text-xs text-slate-400 mb-3">
                  Users come from the profiles table (auto-created when a user signs in after running the SQL schema).
                </p>
                <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
                  {users.length === 0 && (
                    <div className="p-3 rounded border border-[#1f2937] bg-[#060d1f]">
                      <p className="text-xs text-slate-400">No users found yet. Run the updated SQL and create at least one signup.</p>
                    </div>
                  )}
                  {users.map((u) => (
                    <div key={u.id || u.email} className="p-3 rounded border border-[#1f2937] bg-[#060d1f]">
                      <p className="text-sm text-white">{u.full_name || 'User'}</p>
                      <p className="text-xs text-slate-400">{u.email || 'No email'}</p>
                      <p className="text-[11px] text-slate-300 mt-1">
                        Signed up: {formatDateTime(u.signed_up_at || u.created_at)}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Role: {u.role || 'user'} • KYC: {u.kyc_status || 'not_submitted'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-[#050712] border border-[#111827] rounded-xl p-4">
                <h3 className="text-sm font-semibold text-white mb-2">KYC Submissions</h3>
                <p className="text-xs text-slate-400 mb-3">Review documents and approve or reject identity checks.</p>
                <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
                  {users.filter((u) => u.kyc_status && u.kyc_status !== 'not_submitted').length === 0 && (
                    <p className="text-xs text-slate-400">No KYC submissions yet.</p>
                  )}
                  {users.filter((u) => u.kyc_status && u.kyc_status !== 'not_submitted').map((u) => {
                    let kyc = {}
                    try {
                      kyc = u.kyc_json ? JSON.parse(u.kyc_json) : {}
                    } catch {
                      kyc = {}
                    }
                    const key = u.clerk_user_id || u.email
                    const busy = updatingKycId === key
                    const status = String(u.kyc_status || '').toLowerCase()
                    return (
                      <div key={key} className="p-3 rounded border border-[#1f2937] bg-[#060d1f]">
                        <p className="text-sm text-white">{kyc.fullName || u.full_name || 'User'}</p>
                        <p className="text-xs text-slate-400">{u.email}</p>
                        <p className="text-[11px] text-slate-500 mt-1 capitalize">{status.replace('_', ' ')} • {kyc.documentType || 'No document type'}</p>
                        <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                          {kyc.idDocumentFrontUrl ? <a href={kyc.idDocumentFrontUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">Front</a> : null}
                          {kyc.idDocumentBackUrl ? <a href={kyc.idDocumentBackUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">Back</a> : null}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <button type="button" disabled={busy || status === 'approved'} onClick={() => updateKyc(u, 'approved')} className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 text-[11px] disabled:opacity-40">Approve</button>
                          <button type="button" disabled={busy || status === 'rejected'} onClick={() => updateKyc(u, 'rejected')} className="px-2 py-1 rounded bg-red-500/20 text-red-300 text-[11px] disabled:opacity-40">Reject</button>
                          <button type="button" disabled={busy || status === 'pending'} onClick={() => updateKyc(u, 'pending')} className="px-2 py-1 rounded bg-amber-500/20 text-amber-300 text-[11px] disabled:opacity-40">Mark pending</button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  )
}
