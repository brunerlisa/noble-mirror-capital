'use client'

import { useState } from 'react'

const faqs = [
  {
    id: 1,
    question: 'What is Interactive Prime Trade?',
    answer: 'Interactive Prime Trade is an AI-powered copy trading platform that lets you follow and replicate the strategies of experienced traders. Whether you\'re a beginner or a professional, you can connect to signal providers, copy their trades automatically, and benefit from their expertise without needing to trade yourself.',
  },
  {
    id: 2,
    question: 'How does copy trading work?',
    answer: 'Copy trading works by linking your account to one or more signal providers. When they open or close a trade, the same trade is mirrored in your account proportionally to your chosen allocation. You can choose which providers to follow, how much capital to allocate, and how to manage risk.',
  },
  {
    id: 3,
    question: 'Is copy trading safe?',
    answer: 'Copy trading involves market risk like any trading activity. Past performance does not guarantee future results. We provide transparency through live portfolios and performance data so you can make informed decisions. We recommend only investing what you can afford to lose and diversifying across multiple providers.',
  },
  {
    id: 4,
    question: 'What is the AI Assistant?',
    answer: 'The AI Assistant helps you analyze traders, compare performance metrics, and get insights on market conditions. It can suggest providers based on your risk profile and goals, and help you understand strategy characteristics before you decide to copy.',
  },
  {
    id: 5,
    question: 'How do I become a signal provider?',
    answer: 'To become a signal provider, you need an active trading account and a track record that meets our criteria. You can apply through the platform once you\'ve built sufficient performance history. Approved providers can earn fees from followers who copy their strategies.',
  },
  {
    id: 6,
    question: 'What fees does Interactive Prime Trade charge?',
    answer: 'We offer different tiers depending on your needs. Basic access may be free with limited features; premium plans include additional tools, analytics, and support. Signal providers may charge their own performance or subscription fees. All fees are disclosed before you sign up or subscribe.',
  },
  {
    id: 7,
    question: 'Can I copy multiple traders at once?',
    answer: 'Yes. You can follow and copy multiple signal providers simultaneously. Diversifying across different strategies and risk levels can help manage overall portfolio risk. Our platform lets you set individual allocations per provider and monitor all copied trades in one dashboard.',
  },
  {
    id: 8,
    question: 'What languages are supported?',
    answer: 'Interactive Prime Trade supports 12 languages across the platform, including English, Spanish, French, German, Portuguese, Italian, and others. You can switch languages in your account settings.',
  },
  {
    id: 9,
    question: 'How do I withdraw my funds?',
    answer: 'Withdrawals are processed through your account dashboard. You’ll need to complete identity verification if you haven’t already. Processing times depend on your payment method and region, typically 1–5 business days. Some fees may apply—check our fee schedule for details.',
  },
  {
    id: 10,
    question: 'Who can I contact for support?',
    answer: 'You can reach our support team through the Contact page on our website or via the in-platform help center. We offer email support and, for premium users, priority assistance. Include your account email and a clear description of your issue for the fastest response.',
  },
]

export default function FAQPage() {
  const [openId, setOpenId] = useState(null)

  return (
    <div className="min-h-screen bg-grid">
      <section className="pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-slate-400">
            Find answers to common questions about Interactive Prime Trade and copy trading.
          </p>

          <div className="mt-12 space-y-4">
            {faqs.map(({ id, question, answer }) => (
              <div
                key={id}
                className="rounded-xl bg-dark-card border border-dark-border overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenId(openId === id ? null : id)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left text-white font-medium hover:bg-dark/50 transition-colors"
                >
                  {question}
                  <span className="text-primary shrink-0 ml-4">
                    {openId === id ? '−' : '+'}
                  </span>
                </button>
                {openId === id && (
                  <div className="px-6 pb-4 pt-0">
                    <p className="text-slate-400 text-sm leading-relaxed">{answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
