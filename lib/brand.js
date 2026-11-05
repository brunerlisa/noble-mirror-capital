export const BRAND_NAME = 'Interactive Prime Trade'
export const BRAND_DOMAIN = 'interactiveprimetrd.com'
export const LOGO_SRC = '/interactiveprimetrade.png'
export const DEFAULT_SITE_URL = `https://${BRAND_DOMAIN}`

export function siteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL
  return configured.replace(/\/$/, '')
}
