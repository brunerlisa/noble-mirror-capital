'use client'

import { useEffect, useRef, useState } from 'react'
import { DEPOSIT_METHODS, findWalletForMethod, getDepositMethod, getDepositMethodFromValue } from '@/lib/depositMethods'
import { listDepositWallets, upsertDepositWallet } from '@/lib/tradingAdminApi'

const emptyForm = {
  method: 'btc',
  network: getDepositMethod('btc').network,
  wallet_address: '',
  qr_code_url: '',
  instructions: '',
  confirmations: getDepositMethod('btc').confirmations,
  is_active: true,
}

export default function AdminWalletsPage() {
  const [wallets, setWallets] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const fileRef = useRef(null)

  async function load() {
    const rows = await listDepositWallets()
    setWallets(rows || [])
  }

  useEffect(() => {
    let mounted = true
    async function run() {
      try {
        await load()
      } catch (e) {
        if (mounted) setError(e?.message || 'Could not load wallets.')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    run()
    return () => {
      mounted = false
    }
  }, [])

  function selectMethod(method) {
    const catalog = getDepositMethod(method)
    const existing = findWalletForMethod(wallets, method)
    setForm({
      method,
      network: existing?.network || catalog.network,
      wallet_address: existing?.wallet_address || '',
      qr_code_url: existing?.qr_code_url || '',
      instructions: existing?.instructions || '',
      confirmations: Number(existing?.confirmations ?? catalog.confirmations),
      is_active: existing ? existing.is_active !== false : true,
    })
  }

  async function uploadQr(event) {
    const file = event.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    setNotice('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('method', form.method)
      const res = await fetch('/api/upload/wallet-qr', {
        method: 'POST',
        body: fd,
        credentials: 'include',
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      setForm((prev) => ({ ...prev, qr_code_url: data.url }))
      setNotice('QR image uploaded. Save the wallet to publish it to users.')
    } catch (e) {
      setError(e?.message || 'Could not upload QR image.')
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  async function save(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setNotice('')
    try {
      await upsertDepositWallet(form)
      setNotice(`Wallet saved for ${getDepositMethod(form.method).name}. Users will see this address and QR.`)
      await load()
    } catch (e) {
      setError(e?.message || 'Could not save wallet.')
    } finally {
      setSaving(false)
    }
  }

  const catalog = getDepositMethod(form.method)

  return (
    <div className="p-6">
      <header className="h-14 border-b border-[#111827] flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-white">Deposit Wallets</h1>
      </header>

      {notice ? (
        <div className="mb-4 px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-300 text-sm border border-emerald-500/20">
          {notice}
        </div>
      ) : null}
      {error ? (
        <div className="mb-4 px-4 py-2 rounded-lg bg-red-500/10 text-red-300 text-sm border border-red-500/20">
          {error}
        </div>
      ) : null}

      <div className="grid xl:grid-cols-[380px_1fr] gap-6">
        <form onSubmit={save} className="bg-[#050712] border border-[#111827] rounded-xl p-4 space-y-3">
          <h2 className="text-sm font-semibold text-white">Set address and QR</h2>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Method</label>
            <select
              value={form.method}
              onChange={(e) => selectMethod(e.target.value)}
              className="w-full h-10 rounded-md bg-[#020617] border border-[#1f2937] px-3 text-sm text-white"
            >
              {DEPOSIT_METHODS.map((method) => (
                <option key={method.id} value={method.id}>
                  {method.name} ({method.symbol})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Network</label>
            <input
              value={form.network}
              onChange={(e) => setForm((prev) => ({ ...prev, network: e.target.value }))}
              className="w-full h-10 rounded-md bg-[#020617] border border-[#1f2937] px-3 text-sm text-white"
            />
          </div>
          {catalog.kind === 'crypto' ? (
            <>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Wallet address</label>
                <input
                  required
                  value={form.wallet_address}
                  onChange={(e) => setForm((prev) => ({ ...prev, wallet_address: e.target.value }))}
                  placeholder="Paste the receiving address"
                  className="w-full h-10 rounded-md bg-[#020617] border border-[#1f2937] px-3 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Confirmations</label>
                <input
                  type="number"
                  min="0"
                  value={form.confirmations}
                  onChange={(e) => setForm((prev) => ({ ...prev, confirmations: e.target.value }))}
                  className="w-full h-10 rounded-md bg-[#020617] border border-[#1f2937] px-3 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">QR code image</label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={uploadQr}
                  className="w-full text-xs text-slate-300"
                />
                <input
                  value={form.qr_code_url}
                  onChange={(e) => setForm((prev) => ({ ...prev, qr_code_url: e.target.value }))}
                  placeholder="Or paste a QR image URL"
                  className="mt-2 w-full h-10 rounded-md bg-[#020617] border border-[#1f2937] px-3 text-sm text-white"
                />
                {form.qr_code_url ? (
                  <img src={form.qr_code_url} alt="QR preview" className="mt-3 w-32 h-32 object-contain rounded bg-white p-1" />
                ) : (
                  <p className="mt-2 text-xs text-slate-500">
                    {uploading ? 'Uploading...' : 'Upload your QR. This is the image users see on the Pay step.'}
                  </p>
                )}
              </div>
            </>
          ) : null}
          <div>
            <label className="block text-xs text-slate-400 mb-1">Instructions</label>
            <textarea
              rows={3}
              value={form.instructions}
              onChange={(e) => setForm((prev) => ({ ...prev, instructions: e.target.value }))}
              placeholder={catalog.kind === 'manual' ? 'Bank / wire instructions shown to the user' : 'Optional extra note'}
              className="w-full rounded-md bg-[#020617] border border-[#1f2937] px-3 py-2 text-sm text-white"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm((prev) => ({ ...prev, is_active: e.target.checked }))}
            />
            Active
          </label>
          <button
            type="submit"
            disabled={saving}
            className="w-full h-10 rounded-md bg-primary hover:bg-primary-dark disabled:opacity-60 text-sm font-semibold text-white"
          >
            {saving ? 'Saving...' : 'Save wallet'}
          </button>
        </form>

        <div className="bg-[#050712] border border-[#111827] rounded-xl p-4">
          <h2 className="text-sm font-semibold text-white mb-3">Configured wallets</h2>
          {loading ? (
            <p className="text-sm text-slate-500">Loading...</p>
          ) : wallets.length === 0 ? (
            <p className="text-sm text-slate-500">No wallets saved yet. Add BTC, ETH, USDT, or USDC.</p>
          ) : (
            <div className="space-y-3">
              {wallets.map((row) => {
                const item = getDepositMethodFromValue(row.method)
                return (
                  <button
                    key={row.id || row.method}
                    type="button"
                    onClick={() => selectMethod(item.id)}
                    className="w-full text-left p-3 rounded-lg border border-[#1f2937] bg-[#060d1f] hover:border-primary/40"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm text-white">{item.name} ({item.symbol})</p>
                        <p className="text-xs text-slate-400">{row.network || item.network}</p>
                        <p className="mt-1 text-xs text-slate-300 break-all">{row.wallet_address || 'No address'}</p>
                      </div>
                      {/^https?:\/\//i.test(String(row.qr_code_url || '')) ? (
                        <img src={row.qr_code_url} alt="" className="w-14 h-14 object-contain rounded bg-white p-1" />
                      ) : null}
                    </div>
                    <p className="mt-2 text-[11px] text-slate-500">{row.is_active === false ? 'Inactive' : 'Active'} • click to edit</p>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
