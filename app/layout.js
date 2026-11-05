import { Outfit, Plus_Jakarta_Sans } from 'next/font/google'
import { AuthProvider } from '@/components/AuthProvider'
import SiteTranslateEngine from '@/components/SiteTranslator'
import { BRAND_NAME, LOGO_SRC, siteUrl } from '@/lib/brand'
import './globals.css'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['600', '700'],
})

const googleVerification =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || 'na68QqLqQW7fBIsd8O_JQ1ooZwZURbpH6FdXhb6Uydk'
const canonicalSiteUrl = siteUrl()

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: BRAND_NAME,
  url: canonicalSiteUrl,
  logo: `${canonicalSiteUrl}${LOGO_SRC}`,
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
}

export const metadata = {
  metadataBase: new URL(canonicalSiteUrl),
  title: {
    default: `${BRAND_NAME} - Innovative Copy Trading`,
    template: `%s | ${BRAND_NAME}`,
  },
  description: 'A platform with endless possibilities. When experts trade, you trade.',
  applicationName: BRAND_NAME,
  keywords: [
    'copy trading',
    'ai trading platform',
    'social trading',
    BRAND_NAME,
    'forex copy trading',
    'crypto copy trading',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: BRAND_NAME,
    title: `${BRAND_NAME} - Innovative Copy Trading`,
    description: 'A platform with endless possibilities. When experts trade, you trade.',
    images: [
      {
        url: LOGO_SRC,
        width: 1024,
        height: 1024,
        alt: `${BRAND_NAME} logo`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${BRAND_NAME} - Innovative Copy Trading`,
    description: 'A platform with endless possibilities. When experts trade, you trade.',
    images: [LOGO_SRC],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: LOGO_SRC, type: 'image/png', sizes: '32x32' },
    ],
    shortcut: '/favicon.ico',
    apple: LOGO_SRC,
  },
  verification: {
    google: googleVerification,
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} ${jakarta.variable} overflow-x-clip`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body
        className="min-h-dvh bg-dark text-slate-100 font-sans antialiased overflow-x-clip"
        suppressHydrationWarning
      >
        <AuthProvider>
          <SiteTranslateEngine />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
