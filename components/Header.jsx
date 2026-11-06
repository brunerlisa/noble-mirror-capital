'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { LanguageSwitcher } from '@/components/SiteTranslator'
import { BRAND_NAME, LOGO_SRC } from '@/lib/brand'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/faq', label: 'FAQ' },
  { to: '/about', label: 'About' },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const { user, isAdmin } = useAuth()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dark/95 md:backdrop-blur-md border-b border-dark-border min-w-0 max-w-full overflow-x-clip pt-[env(safe-area-inset-top)]">
      <div aria-hidden="true" className="pointer-events-none absolute left-0 top-0 h-full w-56 overflow-hidden">
        <div className="absolute -left-6 top-1/2 h-16 w-44 -translate-y-1/2 rounded-full bg-primary/30 blur-2xl" />
      </div>
      <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 min-w-0">
        <div className="flex items-center justify-between h-14 md:h-16 gap-1.5 sm:gap-2 min-w-0">
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
            <Image
              src={LOGO_SRC}
              alt={BRAND_NAME}
              width={44}
              height={44}
              className="rounded-full shrink-0 w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11"
              priority
            />
            <span className="min-w-0 font-bold tracking-tight leading-none text-primary text-sm whitespace-nowrap sm:text-base md:text-lg">
              {BRAND_NAME}
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map(({ to, label }) => (
              <Link
                key={label}
                href={to}
                className={`text-sm font-medium transition-colors ${
                  pathname === (to === '/#leaders' ? '/' : to.replace(/#.*/, '')) ? 'text-primary' : 'text-slate-300 hover:text-white'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            {user ? (
              <>
                <Link href="/dashboard" className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
                  Dashboard
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="px-4 py-2 text-sm font-medium rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30 transition-colors"
                  >
                    Admin
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link href="/auth/sign-in" className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
                  Login
                </Link>
                <Link
                  href="/auth/sign-up"
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-primary hover:bg-primary-dark text-white transition-colors"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          <div className="flex md:hidden items-center shrink-0">
            <button
              type="button"
              className="shrink-0 p-2 -mr-0.5 text-slate-300 hover:text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-dark-border pb-[max(1rem,env(safe-area-inset-bottom))]">
            <nav className="flex flex-col gap-1">
              <div className="px-4 pb-3">
                <LanguageSwitcher className="w-full" />
              </div>
              {navLinks.map(({ to, label }) => (
                <Link
                  key={label}
                  href={to}
                  className={`px-4 py-3 rounded-lg text-base font-medium ${
                    pathname === (to === '/#leaders' ? '/' : to.replace(/#.*/, '')) ? 'text-primary bg-primary/10' : 'text-slate-300'
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {label}
                </Link>
              ))}
              <div className="mt-3 pt-3 border-t border-dark-border flex flex-col gap-2">
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="w-full py-3 text-center text-slate-200 rounded-lg text-base bg-dark-card border border-dark-border"
                      onClick={() => setMobileOpen(false)}
                    >
                      Dashboard
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="w-full py-3 text-center bg-amber-500/20 text-amber-400 rounded-lg text-base font-medium"
                        onClick={() => setMobileOpen(false)}
                      >
                        Admin
                      </Link>
                    )}
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/sign-in"
                      className="w-full py-3 text-center text-slate-200 rounded-lg text-base bg-dark-card border border-dark-border"
                      onClick={() => setMobileOpen(false)}
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/auth/sign-up"
                      className="w-full py-3 text-center bg-primary text-white rounded-lg text-base font-medium"
                      onClick={() => setMobileOpen(false)}
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
