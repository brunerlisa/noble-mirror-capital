'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { BRAND_NAME, LOGO_SRC } from '@/lib/brand'
import { LanguageSwitcher } from '@/components/SiteTranslator'
import PasswordInput from '@/components/PasswordInput'
import { readAuthParams } from '@/lib/authRecovery'

const inputClass =
  'w-full min-h-12 rounded-md bg-[#0f172a] border border-slate-700 px-3 py-3 text-base text-white placeholder:text-slate-500 focus:outline-none focus:border-primary'
const buttonClass =
  'w-full min-h-12 py-3 rounded-md bg-primary hover:bg-primary-dark text-base font-semibold disabled:opacity-70'

export default function ResetPasswordForm() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)
  const [needsConfirm, setNeedsConfirm] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    if (!supabase) {
      setError('Supabase is not configured.')
      setChecking(false)
      return
    }

    const params = readAuthParams()
    if (params.error) {
      setError('This reset link is invalid or has expired. Request a new one.')
      setChecking(false)
      return
    }

    let mounted = true
    async function checkSession() {
      const { data } = await supabase.auth.getSession()
      if (!mounted) return
      if (data.session) {
        setReady(true)
        setNeedsConfirm(false)
        setChecking(false)
        return
      }
      if (params.tokenHash || params.code) {
        setNeedsConfirm(true)
        setChecking(false)
        return
      }
      setError('This reset link is invalid or has expired. Request a new one.')
      setChecking(false)
    }

    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
        setReady(true)
        setNeedsConfirm(false)
        setError('')
        setChecking(false)
      }
    })

    const wait = setTimeout(checkSession, 250)

    return () => {
      mounted = false
      clearTimeout(wait)
      sub?.subscription.unsubscribe()
    }
  }, [])

  async function confirmResetLink() {
    const supabase = createClient()
    const params = readAuthParams()
    if (!supabase) {
      setError('Could not open this reset link.')
      return
    }
    setLoading(true)
    setError('')
    try {
      if (params.tokenHash) {
        const { error: verifyError } = await supabase.auth.verifyOtp({
          type: 'recovery',
          token_hash: params.tokenHash,
        })
        if (verifyError) throw verifyError
      } else if (params.code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(params.code)
        if (exchangeError) throw exchangeError
      } else {
        throw new Error('This reset link is invalid or has expired. Request a new one.')
      }
      setReady(true)
      setNeedsConfirm(false)
      window.history.replaceState(null, '', '/auth/reset-password')
    } catch (e) {
      setError(e?.message || 'This reset link is invalid or has expired. Request a new one.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    if (password.length < 8) {
      setError('Use at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    const supabase = createClient()
    if (!supabase) {
      setError('Supabase is not configured.')
      return
    }

    setLoading(true)
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) throw updateError
      window.location.assign('/dashboard')
    } catch (err) {
      setError(err?.message || 'Could not update password.')
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-[#050816] text-white flex items-center justify-center px-4 py-8">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 rounded-2xl">
        <div className="hidden md:flex flex-col justify-center px-10 bg-gradient-to-b from-[#050816] to-[#02010a] rounded-2xl border border-slate-900">
          <div className="mb-4 flex items-center gap-3">
            <Image src={LOGO_SRC} alt="" width={52} height={52} className="h-12 w-12 shrink-0 rounded-full" />
            <h1 className="text-2xl xl:text-3xl font-semibold tracking-tight leading-tight text-[#00aeef]">{BRAND_NAME}</h1>
          </div>
          <p className="text-base text-slate-300 max-w-md leading-relaxed">
            Choose a new password, then continue to your dashboard.
          </p>
        </div>

        <div className="w-full flex items-center justify-center">
          <div className="w-full max-w-md bg-[#070a1b] border border-slate-800 rounded-xl p-6 sm:p-8 shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-1">Create a new password</h2>
            <p className="text-sm text-slate-400 mb-6">This replaces the password you no longer have.</p>

            {checking ? <p className="text-sm text-slate-400">Checking your reset link…</p> : null}

            {needsConfirm && !ready ? (
              <div className="space-y-4">
                <p className="text-sm text-slate-300">
                  Tap continue to open this password reset. This keeps email scanners from using the link before you do.
                </p>
                {error ? <p className="text-sm text-red-400">{error}</p> : null}
                <button type="button" disabled={loading} onClick={confirmResetLink} className={buttonClass}>
                  {loading ? 'Opening…' : 'Continue to reset password'}
                </button>
              </div>
            ) : null}

            {ready ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-200 mb-1.5">New password</label>
                  <PasswordInput
                    className={inputClass}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-200 mb-1.5">Confirm password</label>
                  <PasswordInput
                    className={inputClass}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Repeat new password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />
                </div>

                {error ? <p className="text-sm text-red-400">{error}</p> : null}

                <button type="submit" disabled={loading} className={buttonClass}>
                  {loading ? 'Saving…' : 'Save new password'}
                </button>
              </form>
            ) : null}

            {!checking && !ready && !needsConfirm ? (
              <div className="space-y-4">
                {error ? <p className="text-sm text-red-400">{error}</p> : null}
              </div>
            ) : null}

            <p className="mt-5 text-sm text-slate-400">
              <Link href="/auth/forgot-password" className="text-primary hover:text-primary-light">
                Request a new reset link
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
