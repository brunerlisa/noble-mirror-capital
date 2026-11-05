import Link from 'next/link'
import HeroPhone from '@/components/HeroPhone'
import Avatar from '@/components/Avatar'
import StockTicker from '@/components/StockTicker'
import StartCopyingSection from '@/components/sections/StartCopyingSection'
import PhoneFeaturesSection from '@/components/sections/PhoneFeaturesSection'
import BenefitsSection from '@/components/sections/BenefitsSection'
import LeadersSection from '@/components/sections/LeadersSection'
import GlobalMarketsCards from '@/components/sections/GlobalMarketsCards'
import TradeMarketsSection from '@/components/sections/TradeMarketsSection'
import CryptoMarketsSection from '@/components/sections/CryptoMarketsSection'
import PricingPlansSection from '@/components/sections/PricingPlansSection'
import SimpleStepsSection from '@/components/sections/SimpleStepsSection'
import PlatformCapabilitiesSection from '@/components/sections/PlatformCapabilitiesSection'
import OtherFeaturesBentoSection from '@/components/sections/OtherFeaturesBentoSection'
import RegulationPartnersSection from '@/components/sections/RegulationPartnersSection'
import SmartsuppChat from '@/components/SmartsuppChat'
import {
  CalendarIcon,
  CheckSquareIcon,
  ChartLineIcon,
  ChatBubbleIcon,
  SignalIcon,
  CashbackIcon,
} from '@/components/icons/FeatureIcons'

const heroInvestors = [
  { seed: 'investor-a', src: 'https://i.pravatar.cc/96?img=47' },
  { seed: 'investor-b', src: 'https://i.pravatar.cc/96?img=12' },
  { seed: 'investor-c', src: 'https://i.pravatar.cc/96?img=45' },
]

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
    <div className="min-h-screen bg-grid min-w-0 max-w-full overflow-x-clip">
      <section className="relative flex flex-col min-h-0 lg:min-h-[90vh] pt-[4.75rem] lg:pt-28 pb-0 lg:pb-36 overflow-x-clip lg:overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="hero-ambient-glow absolute inset-0" />
        </div>

        <div className="relative z-[1] flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-10 w-full max-w-[1280px] xl:max-w-[1400px] mx-auto px-4 sm:px-6 xl:px-10 pt-6 lg:pt-0 pb-6 lg:pb-0 flex-1 min-w-0">
          <div className="min-w-0 lg:flex-1 lg:basis-[58%] w-full">
            <h1
              className="
              hero-display text-white text-left
              text-[2.15rem] leading-[1.08]
              sm:text-5xl sm:leading-[1.05]
              lg:text-[64px] xl:text-[72px] lg:leading-[1.02]
            "
            >
              <span className="block">Trade Smarter.</span>
              <span className="block text-primary">Grow Together.</span>
            </h1>

            <p className="mt-5 lg:mt-6 text-slate-300 text-[15px] sm:text-base lg:text-lg leading-relaxed max-w-[36rem]">
              Follow experienced traders. Copy their strategies. Take a smarter approach to the financial markets with Interactive Prime Trade.
            </p>

            <div className="mt-7 lg:mt-8">
              <Link
                href="/auth/sign-up"
                className="inline-flex items-center justify-center rounded-xl bg-[#F5C400] font-bold text-[#0b1220] shadow-[0_14px_32px_-10px_rgba(245,196,0,0.75)] transition-colors hover:bg-[#E6B400] w-full sm:w-auto min-h-[52px] px-8 py-3.5 text-base"
              >
                Start Copying
              </Link>

              <div className="mt-6 flex flex-wrap items-center gap-x-3.5 gap-y-2.5">
                <div className="flex items-center">
                  {heroInvestors.map((investor, index) => (
                    <span
                      key={investor.seed}
                      className={`relative ${index === 0 ? '' : '-ml-3'}`}
                      style={{ zIndex: index + 1 }}
                    >
                      <Avatar
                        seed={investor.seed}
                        name="Investor"
                        src={investor.src}
                        className="h-10 w-10 rounded-full object-cover ring-2 ring-[#050a14]"
                      />
                    </span>
                  ))}
                  <span className="relative z-10 -ml-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#1c2433] text-[11px] font-bold text-white ring-2 ring-[#050a14]">
                    +2k
                  </span>
                </div>
                <p className="text-sm sm:text-[15px] font-medium text-slate-400">
                  Trusted by over 20,000 investors
                </p>
              </div>
            </div>
          </div>

          <div className="relative min-w-0 w-full lg:flex-1 lg:basis-[42%] flex justify-center lg:justify-end xl:justify-center xl:pr-4">
            <div aria-hidden="true" className="hero-stage-glow pointer-events-none absolute inset-0 overflow-hidden" />
            <HeroPhone responsiveDensity />
          </div>
        </div>

        <StockTicker />
      </section>

      <section className="py-12 lg:py-20 border-y border-dark-border bg-dark-card/30">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-w-0">
          <div className="text-center mb-8 lg:mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Everything you need to copy trade</h2>
            <p className="mt-3 text-slate-400 text-[15px] lg:text-base max-w-2xl mx-auto">
              Calendar, signals, automation, and rewards — in one dark-fintech workspace.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 min-w-0">
            {featuresGrid.map(({ title, description, Icon }) => (
              <div
                key={title}
                className="p-5 lg:p-6 rounded-xl bg-dark-card border border-dark-border hover:border-primary/30 transition-colors text-left min-w-0"
              >
                <div className="w-12 h-12 rounded-lg border-2 border-primary flex items-center justify-center mb-4 text-primary shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 leading-tight">
                  {title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  {description}
                </p>
                <Link
                  href="/auth/sign-up"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-light transition-colors"
                >
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
      <PlatformCapabilitiesSection />
      <LeadersSection />
      <GlobalMarketsCards />
      <TradeMarketsSection />
      <CryptoMarketsSection />
      <PricingPlansSection />
      <OtherFeaturesBentoSection />
      <SimpleStepsSection />
      <RegulationPartnersSection />

      <section className="py-14 lg:py-20 border-t border-dark-border">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 min-w-0 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 lg:mb-4">Ready to copy the best?</h2>
          <p className="text-slate-400 text-[15px] lg:text-base mb-6 lg:mb-8">
            Join thousands of investors who trade smarter with Interactive Prime Trade.
          </p>
          <Link
            href="/auth/sign-up"
            className="inline-flex items-center justify-center w-full sm:w-auto min-h-12 px-8 py-3.5 text-base font-medium rounded-xl bg-primary hover:bg-primary-dark text-white transition-colors"
          >
            Get Started on the Platform
          </Link>
        </div>
      </section>
      <SmartsuppChat />
    </div>
  )
}
