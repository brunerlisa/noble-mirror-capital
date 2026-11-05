'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'
import { LanguageSwitcher } from '@/components/SiteTranslator'
import { BRAND_NAME } from '@/lib/brand'

export default function AdminLayout({ children }) {
  const { user, isAdmin, loading, signingOut, signOut } = useAuth()
  const router = useRouter()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  useEffect(() => {
    if (loading || signingOut) return
    if (!user) {
      router.replace('/auth/sign-in')
      return
    }
    if (!isAdmin) {
      const t = setTimeout(() => router.replace('/dashboard'), 4000)
      return () => clearTimeout(t)
    }
  }, [user, isAdmin, loading, signingOut, router])

  if (loading || !user || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center">
        <div className="text-center max-w-sm px-4">
          {!loading && user && !isAdmin ? (
            <>
              <p className="text-amber-400 font-medium mb-2">Admin access required</p>
              <p className="text-slate-400 text-sm mb-4">
                This account is not an admin. Sign out and sign back in after the owner email is added, or ask an existing admin to grant access.
              </p>
              <p className="text-slate-500 text-xs">Redirecting to dashboard in a few seconds...</p>
              <Link href="/dashboard" className="mt-4 inline-block text-sm text-primary hover:underline">Go to Dashboard now</Link>
            </>
          ) : (
            <p className="text-slate-400">Loading...</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="h-dvh max-h-dvh bg-[#050816] text-slate-100 flex overflow-hidden">
      {mobileNavOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          aria-label="Close menu"
          onClick={() => setMobileNavOpen(false)}
        />
      ) : null}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-[min(16.5rem,88vw)] bg-[#050712] border-r border-[#111827] flex flex-col transform transition-transform duration-200 ${
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="h-14 px-5 flex items-center justify-between border-b border-[#111827]">
          <Link href="/admin" className="text-sm font-semibold tracking-wide">
            <span className="text-primary">{BRAND_NAME}</span>
          </Link>
          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">ADMIN</span>
        </div>
        <div className="hidden lg:block px-4 py-3 border-b border-[#111827]">
          <LanguageSwitcher />
        </div>
        <nav className="flex-1 py-4 text-sm space-y-0.5">
          <Link href="/admin" onClick={() => setMobileNavOpen(false)} className="block px-5 py-2.5 text-white bg-[#111827] border-r-2 border-primary">Dashboard</Link>
          <Link href="/admin/control" onClick={() => setMobileNavOpen(false)} className="block px-5 py-2.5 text-slate-300 hover:bg-[#0b1020] hover:text-white">Control Center</Link>
          <Link href="/admin/traders" onClick={() => setMobileNavOpen(false)} className="block px-5 py-2.5 text-slate-300 hover:bg-[#0b1020] hover:text-white">Traders</Link>
          <Link href="/admin/deposits" onClick={() => setMobileNavOpen(false)} className="block px-5 py-2.5 text-slate-300 hover:bg-[#0b1020] hover:text-white">Deposits</Link>
          <Link href="/admin/wallets" onClick={() => setMobileNavOpen(false)} className="block px-5 py-2.5 text-slate-300 hover:bg-[#0b1020] hover:text-white">Wallets</Link>
          <Link href="/admin/bonuses" onClick={() => setMobileNavOpen(false)} className="block px-5 py-2.5 text-slate-300 hover:bg-[#0b1020] hover:text-white">Bonuses</Link>
          <Link href="/admin/kyc" onClick={() => setMobileNavOpen(false)} className="block px-5 py-2.5 text-slate-300 hover:bg-[#0b1020] hover:text-white">KYC</Link>
          <Link href="/admin/accounts" onClick={() => setMobileNavOpen(false)} className="block px-5 py-2.5 text-slate-300 hover:bg-[#0b1020] hover:text-white">User Accounts</Link>
        </nav>
        <div className="border-t border-[#111827] py-3 text-sm space-y-0.5">
          <Link href="/dashboard" className="block px-5 py-2 text-slate-300 hover:bg-[#0b1020]">← User Dashboard</Link>
          <button
            className="w-full px-5 py-2 text-left text-slate-300 hover:bg-[#0b1020]"
            onClick={async () => {
              await signOut()
            }}
          >
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 min-h-0 overflow-y-auto overflow-x-clip overscroll-y-contain min-w-0">
        <div className="lg:hidden h-14 border-b border-[#111827] flex items-center px-4">
          <button
            type="button"
            className="p-2 -ml-1 rounded-lg text-slate-300 hover:bg-[#111827]"
            aria-label="Open menu"
            onClick={() => setMobileNavOpen(true)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="ml-2 text-sm font-semibold text-primary">Admin</span>
          <div className="ml-auto">
            <LanguageSwitcher />
          </div>
        </div>
        {children}
      </main>
    </div>
  )
}
