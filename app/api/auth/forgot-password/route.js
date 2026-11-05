import { getSupabaseAdmin } from '@/lib/supabase-server'
import { BRAND_DOMAIN, BRAND_NAME, siteUrl } from '@/lib/brand'

const SITE_URL = siteUrl()
const FROM = process.env.RESEND_FROM || `${BRAND_NAME} <noreply@${BRAND_DOMAIN}>`

function resetLink(tokenHash) {
  const url = new URL('/auth/reset-password', `${SITE_URL}/`)
  url.searchParams.set('token_hash', tokenHash)
  url.searchParams.set('type', 'recovery')
  return url.toString()
}

function emailHtml(link) {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:24px;background:#050816;font-family:Arial,sans-serif;color:#e2e8f0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;background:#070a1b;border:1px solid #1e293b;border-radius:12px;">
      <tr>
        <td style="padding:28px;">
          <p style="margin:0 0 8px;font-size:18px;color:#00aeef;font-weight:700;">Interactive Prime Trade</p>
          <h1 style="margin:0 0 16px;font-size:22px;color:#ffffff;">Reset your password</h1>
          <p style="margin:0 0 20px;font-size:15px;line-height:1.5;">We received a request to reset the password on your account. Use the button below. This link expires soon and only works once.</p>
          <p style="margin:0 0 24px;">
            <a href="${link}" style="display:inline-block;background:#00aeef;color:#ffffff;text-decoration:none;font-weight:700;padding:12px 20px;border-radius:8px;">Choose a new password</a>
          </p>
          <p style="margin:0 0 12px;font-size:13px;color:#94a3b8;line-height:1.5;">If the button does not work, copy this link into your browser:</p>
          <p style="margin:0 0 20px;font-size:13px;word-break:break-all;color:#7dd3fc;">${link}</p>
          <p style="margin:0;font-size:12px;color:#64748b;">If you did not ask for this, you can ignore the email. Your password will stay the same.</p>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

async function sendResendEmail(email, link) {
  const key = process.env.RESEND_API_KEY
  if (!key) return false
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM,
      to: [email],
      subject: 'Reset your Interactive Prime Trade password',
      html: emailHtml(link),
      text: `Reset your Interactive Prime Trade password:\n${link}\n\nIf you did not ask for this, ignore the email.`,
    }),
  })
  return res.ok
}

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}))
    const email = String(body.email || '').trim().toLowerCase()
    if (!email || !email.includes('@')) {
      return Response.json({ error: 'Enter the email on your account.' }, { status: 400 })
    }

    const { data, error } = await getSupabaseAdmin().auth.admin.generateLink({
      type: 'recovery',
      email,
      options: { redirectTo: `${SITE_URL}/auth/reset-password` },
    })
    if (error) {
      return Response.json({ ok: true, fallback: true })
    }

    const tokenHash = data?.properties?.hashed_token
    if (tokenHash) {
      const sent = await sendResendEmail(email, resetLink(tokenHash))
      if (sent) return Response.json({ ok: true })
    }

    return Response.json({ ok: true, fallback: true })
  } catch {
    return Response.json({ ok: true, fallback: true })
  }
}
