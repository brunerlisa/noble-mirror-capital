'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { BRAND_NAME, LOGO_SRC } from '@/lib/brand'

const products = [
  { to: '/platform', label: 'Trading Platform' },
  { to: '#', label: 'AI Assistant' },
  { to: '#', label: 'Data Analytics' },
]

const company = [
  { to: '/about', label: 'About Us' },
  { to: '#', label: 'Careers' },
  { to: '/about', label: 'Contact' },
]

const legal = [
  { to: '/faq', label: 'FAQ' },
  { to: '/terms', label: 'Terms of Service' },
  { to: '/refund', label: 'Refund Policy' },
  { to: '/privacy', label: 'Privacy Policy' },
]

export default function Footer() {
  const [email, setEmail] = useState('')

  return (
    <footer className="bg-dark-card border-t border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Image
                src={LOGO_SRC}
                alt={BRAND_NAME}
                width={48}
                height={48}
                className="rounded-full shrink-0"
              />
              <p className="text-lg font-bold tracking-tight leading-tight">
                <span className="text-primary">{BRAND_NAME}</span>
              </p>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              The most advanced AI-powered trading platform for both beginners and professionals.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Products</h4>
            <ul className="space-y-2">
              {products.map(({ to, label }) => (
                <li key={label}>
                  <Link href={to} className="text-slate-400 hover:text-primary text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="space-y-2">
              {company.map(({ to, label }) => (
                <li key={label}>
                  <Link href={to} className="text-slate-400 hover:text-primary text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Legal</h4>
            <ul className="space-y-2">
              {legal.map(({ to, label }) => (
                <li key={label}>
                  <Link href={to} className="text-slate-400 hover:text-primary text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Subscribe</h4>
            <p className="text-slate-400 text-sm mb-4">Stay updated with the latest trading insights and platform news.</p>
            <form
              className="flex flex-col sm:flex-row gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                setEmail('')
              }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="flex-1 min-h-12 px-4 py-3 rounded-lg bg-dark border border-dark-border text-white placeholder-slate-500 text-base focus:outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="min-h-12 px-4 py-3 rounded-lg bg-primary hover:bg-primary-dark text-white text-sm font-medium transition-colors shrink-0"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <p className="mt-12 pt-8 border-t border-dark-border text-center text-sm text-slate-500 leading-relaxed px-2">
          © {new Date().getFullYear()} {BRAND_NAME}. Innovative Finance Technologies. &nbsp;|&nbsp;
          <Link href="/faq" className="text-slate-400 hover:text-primary">
            FAQ
          </Link>{' '}
          ·{' '}
          <Link href="/terms" className="text-slate-400 hover:text-primary">
            Terms
          </Link>{' '}
          ·{' '}
          <Link href="/refund" className="text-slate-400 hover:text-primary">
            Refund
          </Link>{' '}
          ·{' '}
          <Link href="/privacy" className="text-slate-400 hover:text-primary">
            Privacy
          </Link>
        </p>
      </div>
    </footer>
  )
}
