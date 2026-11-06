export const MIN_DEPOSIT_USD = 50
export const MAX_DEPOSIT_USD = 1_000_000

export const DEPOSIT_METHODS = [
  {
    id: 'btc',
    name: 'Bitcoin',
    symbol: 'BTC',
    network: 'Bitcoin',
    badge: 'Bitcoin',
    confirmations: 2,
    kind: 'crypto',
  },
  {
    id: 'eth',
    name: 'Ethereum',
    symbol: 'ETH',
    network: 'Ethereum',
    badge: 'ERC20',
    confirmations: 12,
    kind: 'crypto',
  },
  {
    id: 'usdt',
    name: 'Tether',
    symbol: 'USDT',
    network: 'Tron (TRC20)',
    badge: 'TRC20',
    confirmations: 19,
    kind: 'crypto',
  },
  {
    id: 'usdc',
    name: 'USD Coin',
    symbol: 'USDC',
    network: 'Ethereum (ERC20)',
    badge: 'ERC20',
    confirmations: 12,
    kind: 'crypto',
  },
]

export function getDepositMethod(id) {
  return DEPOSIT_METHODS.find((method) => method.id === id) || DEPOSIT_METHODS[0]
}

export function getDepositMethodFromValue(value) {
  const key = String(value || '').trim().toLowerCase()
  const byId = DEPOSIT_METHODS.find((method) => method.id === key)
  if (byId) return byId
  const matchedId = Object.keys(METHOD_ALIASES).find((id) => METHOD_ALIASES[id].includes(key))
  return getDepositMethod(matchedId || 'btc')
}

const METHOD_ALIASES = {
  btc: ['btc', 'bitcoin', 'bitcoin btc'],
  eth: ['eth', 'ethereum', 'ethereum eth', 'eth arbitrum'],
  usdt: ['usdt', 'tether', 'usdt trc20', 'usdt erc20', 'usdt erc20'],
  usdc: ['usdc', 'usdc erc20', 'usd coin'],
}

export function findWalletForMethod(wallets, methodId) {
  const rows = wallets || []
  const aliases = METHOD_ALIASES[methodId] || [methodId]
  return (
    rows.find((row) => String(row.method || '').toLowerCase() === methodId) ||
    rows.find((row) => aliases.includes(String(row.method || '').toLowerCase())) ||
    null
  )
}

export function generatedQrUrl(address) {
  if (!address) return ''
  return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(address)}`
}

export function walletQrUrl(wallet) {
  const uploaded = String(wallet?.qr_code_url || '').trim()
  if (/^https?:\/\//i.test(uploaded)) return uploaded
  return generatedQrUrl(wallet?.wallet_address || uploaded)
}
