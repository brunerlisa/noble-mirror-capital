import { siteUrl } from '@/lib/brand'

const canonicalSiteUrl = siteUrl()

export default function sitemap() {
  const pages = ['', '/about', '/platform', '/faq', '/privacy', '/terms', '/refund']
  const lastModified = new Date()

  return pages.map((page) => ({
    url: `${canonicalSiteUrl}${page || '/'}`,
    lastModified,
    changeFrequency: page === '' ? 'daily' : 'weekly',
    priority: page === '' ? 1 : 0.8,
  }))
}
