'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { formatUsd } from '@/components/dashboard/userDisplay'
import {
  DEPOSIT_METHODS,
  MAX_DEPOSIT_USD,
  MIN_DEPOSIT_USD,
  findWalletForMethod,
  getDepositMethod,
  walletQrUrl,
} from '@/lib/depositMethods'
import { createPaymentRequest, listDepositWallets } from '@/lib/tradingAdminApi'
import { readPendingCopy, clearPendingCopy } from '@/lib/pendingCopy'
import SectionBack from '@/components/dashboard/SectionBack'

const CARD = 'rounded-2xl border border-dark-border bg-dark-card'
const STEPS = ['Amount', 'Method', 'Pay', 'Confirm']

export default function DepositSection({ onBack }) {
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [amount, setAmount] = useState('')
  const [methodId, setMethodId] = useState('')
  const [wallets, setWallets] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const [qrFailed, setQrFailed] = useState(false)
  const [copyIntent, setCopyIntent] = useState(null)

  useEffect(() => {
    setCopyIntent(readPendingCopy())
  }, [])

  useEffect(() => {
    let mounted = true
    listDepositWallets()
      .then((rows) => {
        if (mounted) setWallets(rows || [])
      })
      .catch(() => {
        if (mounted) setWallets([])
      })
    return () => {
      mounted = false
    }
  }, [])

  const method = methodId ? getDepositMethod(methodId) : null
  const wallet = useMemo(() => findWalletForMethod(wallets, methodId), [wallets, methodId])
  const parsedAmount = Number(amount)
  const amountValid = parsedAmount >= MIN_DEPOSIT_USD && parsedAmount <= MAX_DEPOSIT_USD
  const address = wallet?.wallet_address || ''
  const qrUrl = walletQrUrl(wallet)
  const confirmations = Number(wallet?.confirmations || method?.confirmations || 0)
  const instructions = displayInstructions(wallet?.instructions, method?.kind)

  function goAmount() {
    setError('')
    if (!String(amount).trim() || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError('Enter a deposit amount.')
      return
    }
    if (!amountValid) {
      setError(`Minimum deposit is ${formatUsd(MIN_DEPOSIT_USD)}. Maximum is ${formatUsd(MAX_DEPOSIT_USD)}.`)
      return
    }
    setStep(2)
  }

  function chooseMethod(id) {
    setError('')
    setMethodId(id)
    setQrFailed(false)
    setStep(3)
  }

  async function copyAddress() {
    if (!address) return
    try {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
      setError('Could not copy address.')
    }
  }

  async function confirmPayment() {
    if (!method || !amountValid) return
    if (method.kind === 'crypto' && !address) {
      setError('This payment method is not configured yet. Contact support or try another method.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await createPaymentRequest({
        user_email: user?.email || '',
        amount_usd: parsedAmount,
        amount_crypto: 0,
        method: `${method.name} (${method.symbol})`,
        status: 'pending',
        payment_type: 'deposit',
        notes: [
          `Network: ${wallet?.network || method.network}`,
          address ? `Address: ${address}` : '',
          `Amount entered: ${formatUsd(parsedAmount)}`,
          copyIntent?.name ? `Copy trader: ${copyIntent.name}` : '',
        ]
          .filter(Boolean)
          .join(' • '),
      })
      clearPendingCopy()
      setCopyIntent(null)
      setStep(4)
    } catch (e) {
      setError(e?.message || 'Could not submit deposit request.')
    } finally {
      setSubmitting(false)
    }
  }

  function reset() {
    setStep(1)
    setAmount('')
    setMethodId('')
    setError('')
    setCopied(false)
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">Deposit</h1>
      <Stepper step={step} />
      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      <SectionBack
        onClick={() => {
          setError('')
          if (step > 1 && step < 4) {
            setStep((prev) => prev - 1)
            return
          }
          onBack?.()
        }}
      />

      {step === 1 ? (
        <section className={`${CARD} p-5 sm:p-8 max-w-xl`}>
          <h2 className="text-xl font-semibold text-white">Enter Deposit Amount</h2>
          <p className="mt-1 text-sm text-slate-400">How much would you like to deposit?</p>
          <div className="relative mt-6">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">$</span>
            <input
              type="number"
              min={MIN_DEPOSIT_USD}
              max={MAX_DEPOSIT_USD}
              step="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder=""
              className="w-full h-14 rounded-xl bg-[#0b1220] border border-primary/50 pl-9 pr-4 text-2xl text-white outline-none focus:border-primary"
            />
          </div>
          <button
            type="button"
            onClick={goAmount}
            className="mt-6 w-full h-12 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold"
          >
            Continue
          </button>
        </section>
      ) : null}

      {step === 2 ? (
        <section className={`${CARD} p-5 sm:p-8`}>
          <h2 className="text-xl font-semibold text-white">Select Deposit Method</h2>
          <p className="mt-1 text-sm text-slate-400">Choose how you want to fund your account</p>
          <div className="mt-6 grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {DEPOSIT_METHODS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => chooseMethod(item.id)}
                className="text-left rounded-2xl border border-dark-border bg-[#0b1220] p-4 hover:border-primary/50 transition-colors"
              >
                <MethodIcon id={item.id} />
                <p className="mt-3 text-white font-semibold">{item.name}</p>
                <p className="text-sm text-slate-400">{item.symbol}</p>
                <span className="mt-3 inline-flex rounded-full border border-dark-border px-2.5 py-0.5 text-[11px] text-slate-300">
                  {item.badge}
                </span>
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {step === 3 && method ? (
        <section className={`${CARD} p-5 sm:p-8 max-w-2xl space-y-5`}>
          <div>
            <h2 className="text-xl font-semibold text-white">Complete Your Payment</h2>
            <p className="mt-1 text-sm text-slate-400">Send the exact amount to the address below.</p>
          </div>

          <div className="rounded-xl bg-[#0b1220] border border-dark-border p-4 grid sm:grid-cols-2 gap-3 text-sm">
            <SummaryRow label="Amount" value={formatUsd(parsedAmount)} />
            <SummaryRow label="Network" value={wallet?.network || method.network} />
            <SummaryRow label="Method" value={`${method.name} (${method.symbol})`} />
            {method.kind === 'crypto' ? (
              <SummaryRow label="Confirmations" value={`${confirmations} blocks`} />
            ) : null}
          </div>

          {method.kind === 'crypto' ? (
            <>
              {qrUrl && !qrFailed ? (
                <div className="flex justify-center">
                  <div className="rounded-2xl bg-white p-3">
                    <img
                      src={qrUrl}
                      alt={`${method.symbol} deposit QR code`}
                      className="w-52 h-52 object-contain"
                      onError={() => setQrFailed(true)}
                    />
                  </div>
                </div>
              ) : null}
              <div>
                <label className="block text-xs text-slate-400 mb-1">Wallet Address</label>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={address || 'Address not configured yet'}
                    className="flex-1 h-11 rounded-lg bg-[#0b1220] border border-dark-border px-3 text-sm text-white"
                  />
                  <button
                    type="button"
                    onClick={copyAddress}
                    disabled={!address}
                    className="h-11 px-3 rounded-lg border border-dark-border text-slate-200 hover:border-primary/50 disabled:opacity-40"
                    aria-label="Copy wallet address"
                  >
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-100 space-y-1">
                <p className="font-semibold text-amber-200">Important:</p>
                <p>Send exactly <span className="text-white font-semibold">{formatUsd(parsedAmount)}</span> to the address above</p>
                <p>
                  Only send <span className="text-white font-semibold">{method.symbol}</span> on the{' '}
                  <span className="text-white font-semibold">{wallet?.network || method.network}</span> network
                </p>
                <p>Minimum {confirmations} network confirmation(s) required</p>
                <p>Funds will be credited after admin confirmation</p>
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-primary/20 bg-primary/10 p-4 text-sm text-slate-200">
              <p className="font-semibold text-white mb-2">Manual Transfer Instructions:</p>
              <p>{instructions}</p>
              <p className="mt-3 text-slate-300">
                Amount to send: <span className="text-white font-semibold">{formatUsd(parsedAmount)}</span>
              </p>
            </div>
          )}

          <button
            type="button"
            disabled={submitting}
            onClick={confirmPayment}
            className="w-full h-12 rounded-xl bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-semibold"
          >
            {submitting ? 'Submitting...' : 'I Have Made the Payment'}
          </button>
        </section>
      ) : null}

      {step === 4 ? (
        <section className={`${CARD} p-5 sm:p-8 max-w-xl text-center`}>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white">Deposit submitted</h2>
          <p className="mt-2 text-sm text-slate-400">
            Your {formatUsd(parsedAmount)} {method?.symbol} deposit is pending review. Admin will credit your real account after confirmation.
          </p>
          <div className="mt-5 rounded-xl bg-[#0b1220] border border-dark-border p-4 text-left text-sm space-y-2">
            <SummaryRow label="Amount" value={formatUsd(parsedAmount)} />
            <SummaryRow label="Method" value={method ? `${method.name} (${method.symbol})` : '—'} />
            <SummaryRow label="Status" value="Pending" />
          </div>
          <button
            type="button"
            onClick={reset}
            className="mt-6 w-full h-12 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold"
          >
            Make another deposit
          </button>
        </section>
      ) : null}
    </div>
  )
}

function displayInstructions(raw, kind) {
  let text = String(raw || '')
    .replace(/^extra note:\s*/i, '')
    .replace(/\s*minimum deposit is \$?50\.?\s*/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (text) return text
  if (kind === 'manual') {
    return 'Please contact our support team for wire transfer instructions. You will receive bank details and a reference number via email.'
  }
  return ''
}

function Stepper({ step }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      {STEPS.map((label, index) => {
        const number = index + 1
        const done = step > number
        const active = step === number
        return (
          <div key={label} className="flex items-center gap-2 min-w-0">
            {index > 0 ? <span className={`h-px w-8 sm:w-12 ${step > index ? 'bg-primary' : 'bg-slate-700'}`} /> : null}
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                  done || active ? 'bg-primary text-white' : 'bg-[#152033] text-slate-400'
                }`}
              >
                {done ? '✓' : number}
              </span>
              <span className={`text-sm ${active || done ? 'text-white' : 'text-slate-500'}`}>{label}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function SummaryRow({ label, value }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-0.5 text-white font-medium">{value}</p>
    </div>
  )
}

function MethodIcon({ id }) {
  const colors = {
    btc: 'bg-orange-500/20 text-orange-300',
    eth: 'bg-indigo-500/20 text-indigo-300',
    usdt: 'bg-emerald-500/20 text-emerald-300',
    usdc: 'bg-sky-500/20 text-sky-300',
    manual: 'bg-slate-500/20 text-slate-200',
  }
  const labels = { btc: '₿', eth: 'Ξ', usdt: '₮', usdc: '$', manual: '⇄' }
  return (
    <span className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl text-xl font-semibold ${colors[id] || colors.manual}`}>
      {labels[id] || '•'}
    </span>
  )
}
