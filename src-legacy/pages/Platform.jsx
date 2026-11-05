import { Link } from 'react-router-dom'

const platformFeatures = [
  { title: 'One-click copy', description: 'Select a strategy or trader and start copying with a single click.' },
  { title: 'MT4 / MT5 ready', description: 'Compatible with MetaTrader 4 and MetaTrader 5 for seamless integration.' },
  { title: 'Risk controls', description: 'Set your own risk level, lot size, and stop-loss preferences.' },
  { title: 'Live performance', description: 'See real-time equity, drawdown, and trade history.' },
]

export default function Platform() {
  return (
    <div className="min-h-screen bg-grid">
      <section className="pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
              The <span className="gradient-text">Platform</span>
            </h1>
            <p className="mt-6 text-lg text-slate-400">
              A professional copy trading environment with full transparency, risk controls, and broker integration.
            </p>
            <div className="mt-10">
              <Link
                to="/auth"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg bg-primary hover:bg-primary-dark text-white transition-colors"
              >
                Connect & start copying
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            Platform features
          </h2>
          <p className="text-slate-400 text-center max-w-2xl mx-auto mb-16">
            Everything you need to copy trade with confidence.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {platformFeatures.map(({ title, description }) => (
              <div
                key={title}
                className="p-6 rounded-xl bg-dark-card border border-dark-border hover:border-primary/30 transition-colors"
              >
                <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                <p className="text-slate-400 text-sm">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-dark-border bg-dark-card/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Get started in minutes
          </h2>
          <p className="text-slate-400 mb-8">
            Register with a supported broker, verify your account, connect to Interactive Prime Trade, and choose who to copy.
          </p>
          <Link
            to="/about"
            className="text-primary hover:text-primary-light font-medium"
          >
            Learn more about us →
          </Link>
        </div>
      </section>
    </div>
  )
}
