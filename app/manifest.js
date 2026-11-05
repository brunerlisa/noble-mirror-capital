import { BRAND_NAME, LOGO_SRC } from '@/lib/brand'

export default function manifest() {
  return {
    name: BRAND_NAME,
    short_name: 'Prime Trade',
    description: 'Innovative copy trading platform.',
    start_url: '/',
    display: 'standalone',
    background_color: '#050a14',
    theme_color: '#050a14',
    icons: [
      {
        src: LOGO_SRC,
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: LOGO_SRC,
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
