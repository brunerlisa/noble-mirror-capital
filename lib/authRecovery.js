import { siteUrl } from '@/lib/brand'

export const RESET_PATH = '/auth/reset-password'
const AUTH_URL_BASE = siteUrl()

export function safePath(value, fallback = RESET_PATH) {
  const next = String(value || '')
  return next.startsWith('/') && !next.startsWith('//') ? next : fallback
}

export function readAuthParams(href = typeof window === 'undefined' ? '' : window.location.href) {
  if (!href) {
    return { code: '', tokenHash: '', type: '', next: '', error: '', accessToken: '' }
  }
  const url = new URL(href, AUTH_URL_BASE)
  const hash = new URLSearchParams(url.hash.replace(/^#/, ''))
  return {
    code: url.searchParams.get('code') || hash.get('code') || '',
    tokenHash: url.searchParams.get('token_hash') || hash.get('token_hash') || '',
    type: url.searchParams.get('type') || hash.get('type') || '',
    next: url.searchParams.get('next') || hash.get('next') || '',
    error: url.searchParams.get('error') || hash.get('error') || hash.get('error_description') || '',
    accessToken: hash.get('access_token') || '',
  }
}

export function isRecoveryParams(params) {
  if (params?.error) return false
  return (
    params?.type === 'recovery' ||
    Boolean(params?.tokenHash) ||
    Boolean(params?.accessToken && params?.type === 'recovery')
  )
}

export function resetPasswordHref(href = typeof window === 'undefined' ? '' : window.location.href) {
  if (!href) return RESET_PATH
  const url = new URL(href, AUTH_URL_BASE)
  url.searchParams.delete('next')
  return `${RESET_PATH}${url.search}${url.hash}`
}
