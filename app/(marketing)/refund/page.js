export const metadata = {
  title: 'Refund Policy',
  description: 'Refund Policy for the Interactive Prime Trade trading platform.',
}

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-grid">
      <section className="pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
            Refund Policy
          </h1>
          <p className="mt-4 text-slate-400">Last updated: March 19, 2026</p>

          <div className="mt-12 space-y-10 text-slate-300 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Overview</h2>
              <p>
                Interactive Prime Trade is committed to transparent and fair refund procedures. This Refund Policy explains when refunds may be available, how to request them, and under what conditions we will process refund requests. Please read this policy carefully before making any purchase.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Subscription and Service Fees</h2>
              <p>
                Subscription fees for premium plans, AI Assistant access, or other recurring services are generally non-refundable after the billing period has commenced. If you cancel a subscription, you will retain access until the end of the current billing period. In exceptional circumstances such as a technical error on our side, we may offer a prorated refund or credit at our discretion. Contact us within 14 days of the issue.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. One-Time Purchases</h2>
              <p>
                For one-time purchases, refunds may be requested within 7 days if the product or service was not delivered as described or was materially defective. Refunds will not be granted for change of mind, failure to use the product, or dissatisfaction with trading results.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Trading Losses</h2>
              <p>
                Trading losses are not refundable. Copy trading and other trading activities are subject to market risk. Any losses incurred are your sole responsibility. We do not refund funds lost due to market movements or user decisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Duplicate or Unauthorized Charges</h2>
              <p>
                If you believe you have been charged in error, charged twice, or charged without authorization, contact us immediately. We will investigate and, if confirmed, process a full refund within 5 to 10 business days.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. How to Request a Refund</h2>
              <p>
                Contact our support team through the Contact page, provide your account email and transaction details, explain the reason for your request, and submit within the applicable timeframes. We will review and respond within 10 business days. Approved refunds are credited to the original payment method within 5 to 14 business days.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Contact</h2>
              <p>
                For refund inquiries or requests, contact us through the Contact page on our website or via our official support channels.
              </p>
            </section>
          </div>
        </div>
      </section>
    </div>
  )
}
