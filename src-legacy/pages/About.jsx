import { Link } from 'react-router-dom'

const values = [
  { title: 'Transparency', text: 'We believe in clear performance data and honest risk disclosure so you can make informed decisions.' },
  { title: 'Simplicity', text: 'Copy trading should be accessible. No complex setup—connect, choose, and follow.' },
  { title: 'Long-term focus', text: 'We prioritize sustainable strategies and risk management over short-term hype.' },
]

export default function About() {
  return (
    <div className="min-h-screen bg-grid">
      <section className="pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
              About <span className="gradient-text">Interactive Prime Trade</span>
            </h1>
            <p className="mt-6 text-lg text-slate-400">
              Interactive Prime Trade is an innovative copy trading platform built for investors who want to benefit from professional trading without the complexity.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 border-t border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white mb-8">Our mission</h2>
          <p className="text-slate-400 max-w-3xl leading-relaxed">
            We combine advanced technology with access to experienced traders so you can replicate proven strategies with full transparency. Our goal is to make copy trading simple, secure, and aligned with your risk tolerance.
          </p>
        </div>
      </section>

      <section className="py-16 border-t border-dark-border bg-dark-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white mb-10">What we stand for</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map(({ title, text }) => (
              <div key={title} className="p-6 rounded-xl bg-dark border border-dark-border">
                <h3 className="text-lg font-semibold text-primary mb-3">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-dark-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-400 mb-6">
            Ready to start copying expert traders?
          </p>
          <Link
            to="/platform"
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg bg-primary hover:bg-primary-dark text-white transition-colors"
          >
            Go to Platform
          </Link>
        </div>
      </section>
    </div>
  )
}
