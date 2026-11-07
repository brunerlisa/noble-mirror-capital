'use client'

/** API client for trading/admin data. Calls Next.js API routes. Auth session sent via cookies. */

const API = '/api'

async function request(method, path, body) {
  const opts = { method, credentials: 'include', headers: { 'Content-Type': 'application/json' } }
  if (body !== undefined) opts.body = JSON.stringify(body)
  const res = await fetch(`${API}${path}`, opts)
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || res.statusText || 'Request failed')
  }
  return res.json()
}

export async function listTraders() {
  return request('GET', '/traders')
}

export async function seedDemoTraders() {
  return request('POST', '/traders', { action: 'seed' })
}

export async function upsertTrader(trader) {
  const id = String(trader?.id || '').trim()
  if (id) return request('PUT', `/traders/${id}`, { ...trader, id })
  return request('POST', '/traders', trader)
}

export async function deleteTrader(traderId) {
  await request('DELETE', `/traders/${traderId}`)
  return true
}

export async function listPayments() {
  return request('GET', '/payments')
}

export async function createPaymentRequest(payment) {
  return request('POST', '/payments', payment)
}

export async function listDepositWallets() {
  return request('GET', '/deposit-wallets')
}

export async function upsertDepositWallet(wallet) {
  return request('POST', '/deposit-wallets', wallet)
}

export async function createWithdrawalRequest(withdrawal) {
  return request('POST', '/payments', { ...withdrawal, payment_type: 'withdrawal' })
}

export async function updatePaymentStatus(paymentId, status) {
  return request('PATCH', `/payments/${paymentId}`, { status })
}

export async function assignBonus(bonus) {
  return request('POST', '/payments', { payment_type: 'bonus', ...bonus })
}

export async function claimBonus(bonusId) {
  return request('PATCH', `/payments/${bonusId}`, { action: 'claim' })
}

export async function listAccounts() {
  return request('GET', '/accounts')
}

export async function upsertAccount(account) {
  return request('POST', '/accounts', account)
}

export async function listTrades() {
  return request('GET', '/trade-updates')
}

export async function addTradeUpdate(trade) {
  return request('POST', '/trade-updates', trade)
}

export async function placeUserTrade(trade) {
  return request('POST', '/trade-updates', { kind: 'user_trade', ...trade })
}

export async function cancelUserTrade(tradeId) {
  return request('PATCH', `/trade-updates/${tradeId}`, { action: 'cancel' })
}

export async function startCopyTrader(trader) {
  return request('POST', '/trade-updates', { kind: 'copy_subscription', ...trader })
}

export async function stopCopyTrader(copyId) {
  return request('PATCH', `/trade-updates/${copyId}`, { action: 'stop' })
}

export async function listUsers() {
  return request('GET', '/profiles')
}

export async function syncProfile(profile) {
  return request('POST', '/profiles', profile)
}

export async function getMyProfile() {
  return request('GET', '/profiles?me=1')
}

export async function getMyPlan() {
  return request('GET', '/plan')
}

export async function selectPlan(plan, extra = {}) {
  return request('POST', '/plan', { plan, ...extra })
}

/** @param {File} file @param {'front' | 'back'} side */
export async function uploadKycDocument(file, side) {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('side', side)
  const res = await fetch(`${API}/upload/kyc`, {
    method: 'POST',
    body: fd,
    credentials: 'include',
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || res.statusText || 'Upload failed')
  }
  return res.json()
}

export async function updateKycStatus(payload) {
  return request('PATCH', '/profiles', payload)
}

export async function deletePlatformUser(user) {
  return request('DELETE', '/profiles', {
    clerk_user_id: user?.clerk_user_id || user?.user_clerk_id || '',
    email: user?.email || user?.user_email || '',
  })
}
