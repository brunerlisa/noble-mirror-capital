/** Trust strip: regulated copy + partner wordmarks from legacy landing layout. */

function LogoTradingCentral({ className }) {
  return (
    <svg className={className} viewBox="0 0 200 52" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <ellipse cx="28" cy="26" rx="24" ry="24" stroke="rgba(226,232,240,0.85)" strokeWidth="2.2" />
      <text x="28" y="24" fill="#e2e8f0" fontSize="6.5" fontWeight="700" fontFamily="system-ui,sans-serif" textAnchor="middle" letterSpacing="0.06em">
        TRADING
      </text>
      <text x="28" y="34" fill="#e2e8f0" fontSize="6.5" fontWeight="700" fontFamily="system-ui,sans-serif" textAnchor="middle" letterSpacing="0.12em">
        CENTRAL
      </text>
    </svg>
  )
}

/** Standalone “1” in circle — shown between Trading Central and oneZero wordmark. */
function LogoNumberOneBadge({ className }) {
  return (
    <svg className={className} viewBox="0 0 48 52" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="24" cy="26" r="19" stroke="rgba(226,232,240,0.9)" strokeWidth="2.2" />
      <text x="24.5" y="33" fill="#f1f5f9" fontSize="21" fontWeight="600" fontFamily="Georgia, serif" textAnchor="middle">
        1
      </text>
    </svg>
  )
}

function LogoOneZeroWord({ className }) {
  return (
    <svg className={className} viewBox="0 0 130 52" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <text
        x="65"
        y="33"
        fill="#f1f5f9"
        fontSize="23"
        fontWeight="600"
        fontFamily="system-ui,sans-serif"
        textAnchor="middle"
        letterSpacing="-0.02em"
      >
        oneZero
      </text>
    </svg>
  )
}

function LogoId3({ className }) {
  return (
    <svg className={className} viewBox="0 0 200 52" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <text
        x="100"
        y="34"
        fontSize="26"
        fill="#f1f5f9"
        fontWeight="700"
        fontFamily="system-ui,sans-serif"
        textAnchor="middle"
        letterSpacing="0.04em"
      >
        ID3
        <tspan fill="#cbd5e1" fontWeight="600">
          GLOBAL
        </tspan>
      </text>
    </svg>
  )
}

export default function RegulationPartnersSection() {
  return (
    <section className="relative border-t border-dark-border bg-dark py-12 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 text-center">
          <div>
            <h3 className="text-white font-bold text-lg sm:text-xl lg:text-2xl mb-4 tracking-tight">We&apos;re Regulated</h3>
            <p className="text-slate-400 text-sm lg:text-[0.95rem] leading-relaxed max-w-md mx-auto">
              Interactive Prime Trade operates in accordance with the financial regulations and compliance standards outlined
              by the SLIBC (Reg. No. 2023-00068) and FSCA (Reg. No. 47490).
            </p>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg sm:text-xl lg:text-2xl mb-4 tracking-tight">You&apos;re Protected</h3>
            <p className="text-slate-400 text-sm lg:text-[0.95rem] leading-relaxed max-w-md mx-auto">
              Client funds are held in a segregated account with AA-Rated Global Bank and trading accounts have negative balance
              protection. Regular audits and indemnity insurance.
            </p>
          </div>
        </div>

        <div className="mt-14 lg:mt-20 pt-12 lg:pt-14 border-t border-dark-border/80">
          <p className="text-primary text-[10px] sm:text-xs lg:text-sm font-semibold tracking-[0.28em] uppercase text-center mb-8 lg:mb-10">
            OUR PARTNERS
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-8 sm:gap-x-10 lg:gap-x-14 opacity-95">
            <LogoTradingCentral className="h-[40px] w-[180px] sm:h-[46px]" />
            <LogoNumberOneBadge className="h-[40px] w-12 sm:h-[46px] sm:w-14" />
            <LogoOneZeroWord className="h-[40px] w-[120px] sm:h-[46px] sm:w-[130px]" />
            <LogoId3 className="h-[42px] w-[200px] sm:h-[48px]" />
          </div>
        </div>
      </div>
    </section>
  )
}
