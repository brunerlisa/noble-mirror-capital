import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/platform', label: 'Platform' },
  { to: '/#leaders', label: 'Leaders' },
  { to: '/about', label: 'About' },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dark/95 backdrop-blur-md border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1 shrink-0">
            <span className="text-sm font-normal text-slate-400 hidden sm:inline">interactiveprimetrd.com</span>
            <span className="text-lg font-bold tracking-tight">
              <span className="text-primary">Interactive Prime Trade</span>
            </span>
          </Link>

          {/* Center nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(({ to, label }) => (
              <Link
                key={label}
                to={to}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === (to === '/#leaders' ? '/' : to.replace(/#.*/, '')) ? 'text-primary' : 'text-slate-300 hover:text-white'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right: Demo, Login, Sign up */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/platform"
              className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Demo
            </Link>
            <Link
              to="/auth"
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link
              to="/auth"
              className="px-4 py-2 text-sm font-medium rounded-lg bg-primary hover:bg-primary-dark text-white transition-colors"
            >
              Sign up
            </Link>
          </div>

          <button
            type="button"
            className="md:hidden p-2 text-slate-400 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
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

        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-dark-border">
            <nav className="flex flex-col gap-1">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={label}
                  to={to}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium ${
                    location.pathname === (to === '/#leaders' ? '/' : to.replace(/#.*/, '')) ? 'text-primary bg-primary/10' : 'text-slate-300'
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {label}
                </Link>
              ))}
              <div className="mt-3 pt-3 border-t border-dark-border flex gap-2 px-4">
                <Link
                  to="/platform"
                  className="flex-1 py-2.5 text-center text-slate-300 rounded-lg text-sm border border-dark-border"
                  onClick={() => setMobileOpen(false)}
                >
                  Demo
                </Link>
                <Link
                  to="/auth"
                  className="flex-1 py-2.5 text-center text-slate-300 rounded-lg text-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/auth"
                  className="flex-1 py-2.5 text-center bg-primary text-white rounded-lg text-sm font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign up
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
