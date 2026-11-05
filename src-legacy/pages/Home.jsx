import { Link } from 'react-router-dom'
import RotatingWord from '../components/RotatingWord'
import HeroPhone from '../components/HeroPhone'
import StockTicker from '../components/StockTicker'
import StartCopyingSection from '../components/sections/StartCopyingSection'
import PhoneFeaturesSection from '../components/sections/PhoneFeaturesSection'
import BenefitsSection from '../components/sections/BenefitsSection'
import LeadersSection from '../components/sections/LeadersSection'
import GlobalMarketsCards from '../components/sections/GlobalMarketsCards'
import TradeMarketsSection from '../components/sections/TradeMarketsSection'
import SimpleStepsSection from '../components/sections/SimpleStepsSection'
import {
  CalendarIcon,
  CheckSquareIcon,
  ChartLineIcon,
  ChatBubbleIcon,
  SignalIcon,
  CashbackIcon,
} from '../components/icons/FeatureIcons'

const featuresGrid = [
  { title: 'Premium Economic Calendar', description: 'Start trading news like the pros with our pro economic calendar', Icon: CalendarIcon },
  { title: 'Technical Views', description: 'Access live trading setups based on pattern recognition and expert analysis.', Icon: CheckSquareIcon },
  { title: 'Alpha EA', description: 'Unlock live trading ideas with three EAs for your MT4 and MT5 platform.', Icon: ChartLineIcon },
  { title: 'AI Market Buzz', description: 'Gain live market-moving insights of over 35,000 tradable assets.', Icon: ChatBubbleIcon },
  { title: 'Trade Signals', description: 'Access daily trading ideas and technical setups in real-time.', Icon: SignalIcon },
  { title: 'Cashback Bonus', description: 'Get a 50% Cashback Bonus that converts to cash when you trade.', Icon: CashbackIcon },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-grid">
      {/* Hero */}
      <section className="relative pt-28 pb-32 md:pt-36 md:pb-36 overflow-hidden min-h-[90vh] flex flex-col">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="w-full px-3 sm:px-6 lg:px-8 xl:px-10 relative flex-1 flex flex-col lg:flex-row lg:items-center lg:gap-10">
          {/* Left: headline, stats, copy, CTA */}
          <div className="flex-1 lg:basis-[58%] max-w-none">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[76px] xl:text-[82px] font-bold tracking-[-0.025em] text-white leading-[0.92]">
              <span className="block md:whitespace-nowrap">Innovative Copy</span>
              <span className="block md:whitespace-nowrap">Trading Platform</span>
              <span className="block md:whitespace-nowrap">
                for <RotatingWord />
              </span>
            </h1>
            {/* Stats with icons */}
            <div className="mt-6 flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary" aria-hidden>
                  <PeopleIcon className="w-4 h-4" />
                </span>
                <span className="text-white font-semibold text-base md:text-lg">1,007,000+ Active Users</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500/20 text-amber-400" aria-hidden>
                  <StarIcon className="w-4 h-4" />
                </span>
                <span className="text-white font-semibold text-base md:text-lg">4.5 Google Rating</span>
              </div>
            </div>

            <p className="mt-6 text-slate-300 text-lg leading-relaxed max-w-[680px]">
              A Platform With Endless Possibilities. When Experts trade, you trade. If they profit, you profit too. Open your account in minutes!
            </p>

            <div className="mt-7">
              <Link
                to="/auth"
                className="inline-flex items-center justify-center px-6 py-3.5 text-lg font-semibold rounded-lg bg-primary hover:bg-primary-dark text-white transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Right: live portfolio card */}
          <div className="flex-1 lg:basis-[42%] flex justify-center lg:justify-center xl:pr-4 mt-10 lg:mt-0">
            <HeroPhone />
          </div>
        </div>

        {/* Scrolling stock ticker at bottom */}
        <StockTicker />
      </section>

      {/* 6-card Features (Premium Economic Calendar, etc.) */}
      <section className="py-20 border-t border-dark-border bg-dark-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuresGrid.map(({ title, description, Icon }) => (
              <div key={title} className="p-6 rounded-xl bg-dark-card border border-dark-border hover:border-primary/30 transition-colors text-left">
                <div className="w-12 h-12 rounded-lg border-2 border-primary flex items-center justify-center mb-4 text-primary">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">{description}</p>
                <Link to="/auth" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-light transition-colors">
                  Find out more →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <StartCopyingSection />
      <PhoneFeaturesSection />
      <BenefitsSection />
      <LeadersSection />
      <GlobalMarketsCards />
      <TradeMarketsSection />
      <SimpleStepsSection />

      {/* CTA */}
      <section className="py-20 border-t border-dark-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to copy the best?
          </h2>
          <p className="text-slate-400 mb-8">
            Join thousands of investors who trade smarter with Interactive Prime Trade.
          </p>
          <Link
            to="/auth"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-lg bg-primary hover:bg-primary-dark text-white transition-colors"
          >
            Get Started on the Platform
          </Link>
        </div>
      </section>
    </div>
  )
}

function PeopleIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
    </svg>
  )
}

function StarIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  )
}
