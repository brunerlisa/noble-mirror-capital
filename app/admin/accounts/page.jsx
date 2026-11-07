'use client'

import { useState, useEffect } from 'react'
import { Field, ADMIN_INPUT } from '@/components/admin/Field'
import { listAccounts, listUsers, listPayments, upsertAccount, updatePaymentStatus, deletePlatformUser } from '@/lib/tradingAdminApi'
import { useAuth } from '@/components/AuthProvider'
import { UPGRADE_PLANS, getUpgradePlan, planDisplayName } from '@/lib/pricingPlans'
import { formatDateTime } from '@/components/dashboard/userDisplay'

const emptyForm = {
  user_email: '',
  user_clerk_id: '',
  balance: 0,
  addAmount: 0,
  profit: 0,
  status: 'active',
  plan: 'basic',
}

export default function AdminAccountsPage() {
  const { user: currentUser } = useAuth()
  const [accounts, setAccounts] = useState([])
  const [users, setUsers] = useState([])
  const [upgrades, setUpgrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [notice, setNotice] = useState('')
  const [noticeError, setNoticeError] = useState(false)
  const [deletingKey, setDeletingKey] = useState('')
  const [form, setForm] = useState(emptyForm)

  const load = async () => {
    const [a, u, p] = await Promise.all([listAccounts(), listUsers(), listPayments()])
    setAccounts(a || [])
    setUsers(u || [])
    setUpgrades((p || []).filter((row) => row.payment_type === 'plan_upgrade'))
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const handleAddFunds = async () => {
    const email = (form.user_email || '').trim().toLowerCase()
    if (!email) return
    setNotice('')
    setNoticeError(false)
    try {
      const existing = accounts.find((ac) => (ac.user_email || '').toLowerCase() === email)
      const currentBalance = Number(existing?.balance || 0)
      const addAmount = Number(form.addAmount || 0)
      await upsertAccount({
        ...existing,
        user_email: email,
        user_clerk_id: form.user_clerk_id || existing?.user_clerk_id || '',
        balance: currentBalance + addAmount,
        profit: Number(existing?.profit || 0),
        status: form.status || existing?.status || 'active',
        plan: form.plan || existing?.plan || 'basic',
        plan_status: 'active',
      })
      setNotice(`Added $${addAmount.toLocaleString()} to ${email}. New balance: $${(currentBalance + addAmount).toLocaleString()}.`)
      setForm((p) => ({ ...p, addAmount: 0 }))
      load()
    } catch (e) {
      setNoticeError(true)
      setNotice(e?.message || 'Failed to add funds.')
    }
  }

  const handleSetBalance = async () => {
    const email = (form.user_email || '').trim().toLowerCase()
    if (!email) return
    setNotice('')
    setNoticeError(false)
    try {
      const existing = accounts.find((ac) => (ac.user_email || '').toLowerCase() === email)
      await upsertAccount({
        ...existing,
        user_email: email,
        user_clerk_id: form.user_clerk_id || existing?.user_clerk_id || '',
        balance: Number(form.balance || 0),
        profit: Number(form.profit || 0),
        status: form.status || existing?.status || 'active',
        plan: form.plan || existing?.plan || 'basic',
        plan_status: 'active',
      })
      setNotice(`Account updated for ${email}. Balance set to $${Number(form.balance || 0).toLocaleString()}. Plan: ${form.plan || 'basic'}.`)
      load()
    } catch (e) {
      setNoticeError(true)
      setNotice(e?.message || 'Failed to update account.')
    }
  }

  const sameEmail = (left, right) => (left || '').trim().toLowerCase() === (right || '').trim().toLowerCase()

  const canDeletePerson = (email, clerkId, role) => {
    if (String(role || '').toLowerCase() === 'admin') return false
    if (currentUser?.email && sameEmail(email, currentUser.email)) return false
    if (currentUser?.id && clerkId && clerkId === currentUser.id) return false
    return Boolean((email || '').trim() || (clerkId || '').trim())
  }

  const removeUser = async (person) => {
    const email = (person.email || person.user_email || '').trim()
    const clerkId = person.clerk_user_id || person.user_clerk_id || ''
    const label = email || 'this user'
    if (!window.confirm(`Delete ${label} from the platform? This removes their login, balance, and records.`)) return
    setNotice('')
    setNoticeError(false)
    setDeletingKey(clerkId || email)
    try {
      await deletePlatformUser({ clerk_user_id: clerkId, email })
      if (sameEmail(form.user_email, email)) setForm(emptyForm)
      setNotice(`${label} was deleted.`)
      await load()
    } catch (e) {
      setNoticeError(true)
      setNotice(e?.message || 'Could not delete that user.')
    } finally {
      setDeletingKey('')
    }
  }

  const signupTimeFor = (email) => {
    const match = users.find((row) => (row.email || '').toLowerCase() === (email || '').toLowerCase())
    return match?.signed_up_at || match?.created_at || ''
  }

  const selectUser = (u) => {
    const ac = accounts.find((a) => (a.user_email || '').toLowerCase() === (u.email || '').toLowerCase())
    let prefs = {}
    try {
      prefs = JSON.parse(u.preferences_json || '{}') || {}
    } catch {
      prefs = {}
    }
    setForm({
      user_email: u.email || '',
      user_clerk_id: u.clerk_user_id || ac?.user_clerk_id || '',
      balance: Number(ac?.balance || 0),
      addAmount: 0,
      profit: Number(ac?.profit || 0),
      status: ac?.status || 'active',
      plan: ac?.plan || prefs.plan || 'basic',
    })
  }

  return (
    <div className="p-6">
      <header className="h-14 border-b border-[#111827] flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-white">User Accounts</h1>
      </header>

      {notice && (
        <div className={`mb-4 px-4 py-2 rounded-lg text-sm border ${noticeError ? 'bg-red-500/10 text-red-300 border-red-500/20' : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'}`}>
          {notice}
        </div>
      )}

      <div className="grid xl:grid-cols-[360px_1fr] gap-6">
        <div className="bg-[#050712] border border-[#111827] rounded-xl p-4 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Edit user account</h3>
            <p className="mt-1 text-[11px] text-slate-500">Click a user on the right to fill this form, then change the values below.</p>
          </div>
          <Field label="User email" hint="Required. This is the account you are editing.">
            <input
              value={form.user_email}
              onChange={(e) => setForm((p) => ({ ...p, user_email: e.target.value }))}
              placeholder="name@email.com"
              className={ADMIN_INPUT}
            />
          </Field>
          <Field label="User ID" hint="Filled automatically when you click a registered user. Leave blank if unsure.">
            <input
              value={form.user_clerk_id}
              onChange={(e) => setForm((p) => ({ ...p, user_clerk_id: e.target.value }))}
              placeholder="Optional"
              className={ADMIN_INPUT}
            />
          </Field>
          <Field label="Amount to add ($)" hint="Used only by Add Funds. This amount is added on top of the current balance.">
            <input
              type="number"
              value={form.addAmount}
              onChange={(e) => setForm((p) => ({ ...p, addAmount: Number(e.target.value) }))}
              placeholder="0"
              className={ADMIN_INPUT}
            />
          </Field>
          <Field label="Account balance ($)" hint="Used only by Set Balance. This replaces the current balance.">
            <input
              type="number"
              value={form.balance}
              onChange={(e) => setForm((p) => ({ ...p, balance: Number(e.target.value) }))}
              placeholder="0"
              className={ADMIN_INPUT}
            />
          </Field>
          <Field label="Profit ($)" hint="Shown on the user dashboard as profit.">
            <input
              type="number"
              value={form.profit}
              onChange={(e) => setForm((p) => ({ ...p, profit: Number(e.target.value) }))}
              placeholder="0"
              className={ADMIN_INPUT}
            />
          </Field>
          <Field label="Account status">
            <select
              value={form.status}
              onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
              className={ADMIN_INPUT}
            >
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
            </select>
          </Field>
          <Field label="Upgrade plan">
            <select
              value={form.plan}
              onChange={(e) => setForm((p) => ({ ...p, plan: e.target.value }))}
              className={ADMIN_INPUT}
            >
              <option value="basic">Basic</option>
              {UPGRADE_PLANS.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name}
                </option>
              ))}
            </select>
          </Field>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAddFunds}
              className="flex-1 py-2 rounded-md bg-primary hover:bg-primary-dark text-sm font-semibold text-white"
            >
              Add Funds
            </button>
            <button
              type="button"
              onClick={handleSetBalance}
              className="flex-1 py-2 rounded-md bg-[#1e293b] hover:bg-[#334155] text-sm font-semibold text-slate-200"
            >
              Save account
            </button>
          </div>
          <p className="text-[11px] text-slate-500">
            Add Funds increases the balance. Save account writes the balance, profit, status, and plan exactly as shown.
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-[#050712] border border-[#111827] rounded-xl p-4">
            <h3 className="text-sm font-semibold text-white mb-3">User Accounts ({accounts.length})</h3>
            {loading ? (
              <p className="text-sm text-slate-400">Loading...</p>
            ) : accounts.length === 0 ? (
              <p className="text-sm text-slate-400">No accounts yet. Users will get accounts when deposits are approved.</p>
            ) : (
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                {accounts.map((a) => {
                  const registered = users.find((row) => sameEmail(row.email, a.user_email))
                  const person = {
                    email: a.user_email,
                    clerk_user_id: registered?.clerk_user_id || a.user_clerk_id || '',
                  }
                  const deleteKey = person.clerk_user_id || person.email
                  const showDelete = canDeletePerson(person.email, person.clerk_user_id, registered?.role)
                  return (
                  <div
                    key={a.id || a.user_email}
                    onClick={() => setForm({
                      user_email: a.user_email || '',
                      user_clerk_id: a.user_clerk_id || '',
                      balance: Number(a.balance || 0),
                      addAmount: 0,
                      profit: Number(a.profit || 0),
                      status: a.status || 'active',
                      plan: a.plan || 'basic',
                    })}
                    className="p-3 rounded-lg border border-[#1f2937] bg-[#060d1f] cursor-pointer hover:border-primary/40"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm text-white">{a.user_email}</p>
                        <p className="mt-1 text-[11px] text-slate-500">
                          Signed up: {formatDateTime(signupTimeFor(a.user_email))}
                        </p>
                      </div>
                      {showDelete ? (
                        <button
                          type="button"
                          disabled={deletingKey === deleteKey}
                          onClick={(event) => {
                            event.stopPropagation()
                            removeUser(person)
                          }}
                          className="shrink-0 px-2.5 py-1 rounded-md bg-red-500/15 text-red-300 text-[11px] font-semibold hover:bg-red-500/25 disabled:opacity-40"
                        >
                          {deletingKey === deleteKey ? 'Deleting...' : 'Delete'}
                        </button>
                      ) : null}
                    </div>
                    <div className="mt-1 grid grid-cols-3 gap-2 text-[11px] text-slate-400">
                      <p>Balance: ${Number(a.balance || 0).toLocaleString()}</p>
                      <p>Plan: {planDisplayName(a.plan, a.plan_status)}</p>
                      <p>Status: {a.status}</p>
                    </div>
                  </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className="bg-[#050712] border border-[#111827] rounded-xl p-4">
            <h3 className="text-sm font-semibold text-white mb-3">Registered Users ({users.length})</h3>
            {users.length === 0 ? (
              <p className="text-sm text-slate-400">No users yet.</p>
            ) : (
              <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                {users.map((u) => {
                  const deleteKey = u.clerk_user_id || u.email
                  return (
                  <div
                    key={deleteKey}
                    className="flex items-start gap-2 p-2 rounded-lg border border-[#1f2937] bg-[#060d1f]"
                  >
                    <button
                      type="button"
                      onClick={() => selectUser(u)}
                      className="flex-1 text-left hover:text-white"
                    >
                      <p className="text-sm text-slate-200">
                        {u.full_name || u.email} {u.role === 'admin' && <span className="text-amber-400 text-xs">(admin)</span>}
                      </p>
                      {u.full_name ? <p className="text-xs text-slate-400">{u.email}</p> : null}
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Signed up: {formatDateTime(u.signed_up_at || u.created_at)}
                      </p>
                    </button>
                    {canDeletePerson(u.email, u.clerk_user_id, u.role) ? (
                      <button
                        type="button"
                        disabled={deletingKey === deleteKey}
                        onClick={() => removeUser(u)}
                        className="shrink-0 px-2.5 py-1 rounded-md bg-red-500/15 text-red-300 text-[11px] font-semibold hover:bg-red-500/25 disabled:opacity-40"
                      >
                        {deletingKey === deleteKey ? 'Deleting...' : 'Delete'}
                      </button>
                    ) : null}
                  </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className="bg-[#050712] border border-[#111827] rounded-xl p-4">
            <h3 className="text-sm font-semibold text-white mb-3">Plan upgrade requests</h3>
            {upgrades.filter((row) => String(row.status).toLowerCase() === 'pending').length === 0 ? (
              <p className="text-sm text-slate-400">No pending plan requests.</p>
            ) : (
              <div className="space-y-2">
                {upgrades
                  .filter((row) => String(row.status).toLowerCase() === 'pending')
                  .map((row) => (
                    <div key={row.id} className="p-3 rounded-lg border border-[#1f2937] bg-[#060d1f]">
                      <p className="text-sm text-white">{row.user_email}</p>
                      <p className="text-xs text-slate-400 mb-2">
                        Requested {getUpgradePlan(row.method)?.name || row.method} · min ${Number(row.amount_usd || 0).toLocaleString()}
                      </p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={async () => {
                            setNotice('')
                            setNoticeError(false)
                            try {
                              await updatePaymentStatus(row.id, 'approved')
                              setNotice(`Activated ${getUpgradePlan(row.method)?.name || row.method} for ${row.user_email}.`)
                              load()
                            } catch (e) {
                              setNoticeError(true)
                              setNotice(e?.message || 'Could not approve plan.')
                            }
                          }}
                          className="px-3 py-1.5 rounded-md bg-primary text-white text-xs font-semibold"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            setNotice('')
                            setNoticeError(false)
                            try {
                              await updatePaymentStatus(row.id, 'rejected')
                              setNotice('Plan request rejected.')
                              load()
                            } catch (e) {
                              setNoticeError(true)
                              setNotice(e?.message || 'Could not reject plan.')
                            }
                          }}
                          className="px-3 py-1.5 rounded-md bg-[#1e293b] text-slate-200 text-xs font-semibold"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
