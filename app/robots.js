import { siteUrl } from '@/lib/brand'

const canonicalSiteUrl = siteUrl()

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/auth', '/auth/', '/dashboard', '/admin', '/api/'],
      },
    ],
    sitemap: `${canonicalSiteUrl}/sitemap.xml`,
    host: canonicalSiteUrl,
  }
}
