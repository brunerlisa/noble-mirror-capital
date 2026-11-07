import { requireAuth, requireAdmin } from '@/lib/auth'
import { getSupabaseAdmin, supabaseAdmin } from '@/lib/supabase-server'
import { parseAdminEmails } from '@/lib/supabase/env'

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase()
}

async function authUserCreatedAt(userId) {
  if (!userId) return null
  try {
    const { data, error } = await getSupabaseAdmin().auth.admin.getUserById(userId)
    if (error) return null
    return data?.user?.created_at || null
  } catch {
    return null
  }
}

async function listAuthUsers() {
  const admin = getSupabaseAdmin()
  const users = []
  const perPage = 200
  for (let page = 1; page <= 20; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage })
    if (error) throw error
    const batch = data?.users || []
    users.push(...batch)
    if (batch.length < perPage) break
  }
  return users
}

function withSignupTime(profile, authUser) {
  const signedUpAt = authUser?.created_at || profile?.created_at || null
  return {
    ...profile,
    signed_up_at: signedUpAt,
    created_at: profile?.created_at || signedUpAt,
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const me = searchParams.get('me') === '1' || searchParams.get('me') === 'true'
  if (me) {
    try {
      const user = await requireAuth()
      const { data, error } = await supabaseAdmin.from('profiles').select('*').eq('clerk_user_id', user.userId).single()
      if (error && error.code !== 'PGRST116') return Response.json({ error: error.message }, { status: 500 })
      const signedUpAt = (await authUserCreatedAt(user.userId)) || data?.created_at || null
      return Response.json({
        ...(data || {}),
        role: user.isAdmin ? 'admin' : (data?.role || 'user'),
        email: data?.email || user.email,
        full_name: data?.full_name || user.fullName,
        created_at: data?.created_at || signedUpAt,
        signed_up_at: signedUpAt,
      })
    } catch (e) {
      if (e.status === 401) return Response.json({ error: 'Unauthorized' }, { status: 401 })
      throw e
    }
  }
  try {
    await requireAdmin()
  } catch (e) {
    if (e.status === 401) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    if (e.status === 403) return Response.json({ error: 'Forbidden' }, { status: 403 })
    throw e
  }
  const { data, error } = await supabaseAdmin.from('profiles').select('*').order('created_at', { ascending: false })
  if (error) return Response.json({ error: error.message }, { status: 500 })

  let authUsers = []
  try {
    authUsers = await listAuthUsers()
  } catch {
    authUsers = []
  }

  const byId = new Map(authUsers.map((row) => [row.id, row]))
  const byEmail = new Map()
  for (const row of authUsers) {
    const email = normalizeEmail(row.email)
    if (email) byEmail.set(email, row)
  }
  const profiles = (data || []).map((profile) =>
    withSignupTime(profile, byId.get(profile.clerk_user_id) || byEmail.get(normalizeEmail(profile.email)))
  )

  const seenIds = new Set(profiles.map((row) => row.clerk_user_id).filter(Boolean))
  const seenEmails = new Set(profiles.map((row) => normalizeEmail(row.email)).filter(Boolean))
  for (const authUser of authUsers) {
    const email = normalizeEmail(authUser.email)
    if (seenIds.has(authUser.id) || (email && seenEmails.has(email))) continue
    profiles.push(
      withSignupTime(
        {
          clerk_user_id: authUser.id,
          email: authUser.email || '',
          full_name: authUser.user_metadata?.full_name || '',
          role: 'user',
          kyc_status: 'not_submitted',
          created_at: authUser.created_at,
        },
        authUser
      )
    )
  }

  profiles.sort((a, b) => new Date(b.signed_up_at || 0) - new Date(a.signed_up_at || 0))
  return Response.json(profiles)
}

export async function POST(req) {
  try {
    const user = await requireAuth()
    const body = await req.json()
    const email = (body.email || user.email || '').toString().trim().toLowerCase()
    const payload = {
      clerk_user_id: user.userId,
      email,
      full_name: body.full_name || user.fullName || '',
      updated_at: new Date().toISOString(),
    }
    if (user.isAdmin || parseAdminEmails().includes(email)) {
      payload.role = 'admin'
    }
    if (body.preferences_json != null && typeof body.preferences_json === 'string') {
      payload.preferences_json = body.preferences_json
    }
    const { data: existing } = await supabaseAdmin
      .from('profiles')
      .select('kyc_status, created_at')
      .eq('clerk_user_id', user.userId)
      .maybeSingle()

    if (body.kyc_json != null && typeof body.kyc_json === 'string') {
      const current = String(existing?.kyc_status || '').toLowerCase()
      if (['pending', 'approved', 'verified'].includes(current) && !user.isAdmin) {
        return Response.json({ error: 'KYC is already submitted or approved' }, { status: 400 })
      }
      payload.kyc_json = body.kyc_json
      payload.kyc_status = 'pending'
      payload.kyc_submitted_at = body.kyc_submitted_at || new Date().toISOString()
    }

    const signedUpAt = await authUserCreatedAt(user.userId)
    const existingAt = existing?.created_at ? new Date(existing.created_at).getTime() : NaN
    const signupMs = signedUpAt ? new Date(signedUpAt).getTime() : NaN
    if (!existing?.created_at) {
      payload.created_at = signedUpAt || new Date().toISOString()
    } else if (Number.isFinite(signupMs) && (!Number.isFinite(existingAt) || signupMs + 1000 < existingAt)) {
      payload.created_at = signedUpAt
    }

    const { data, error } = await supabaseAdmin.from('profiles').upsert(payload, { onConflict: 'clerk_user_id' }).select().single()
    if (error) return Response.json({ error: error.message }, { status: 500 })
    return Response.json({ ...data, signed_up_at: signedUpAt || data?.created_at || null })
  } catch (e) {
    if (e.status === 401) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    throw e
  }
}

export async function PATCH(req) {
  try {
    await requireAdmin()
  } catch (e) {
    if (e.status === 401) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    if (e.status === 403) return Response.json({ error: 'Forbidden' }, { status: 403 })
    throw e
  }

  try {
    const body = await req.json()
    const status = String(body?.kyc_status || '').toLowerCase()
    const allowed = new Set(['not_submitted', 'pending', 'approved', 'verified', 'rejected'])
    if (!allowed.has(status)) {
      return Response.json({ error: 'Invalid KYC status' }, { status: 400 })
    }

    const clerkId = String(body.clerk_user_id || '').trim()
    const email = String(body.email || '').trim().toLowerCase()
    if (!clerkId && !email) {
      return Response.json({ error: 'User id or email is required' }, { status: 400 })
    }

    let query = supabaseAdmin
      .from('profiles')
      .update({ kyc_status: status, updated_at: new Date().toISOString() })
    query = clerkId ? query.eq('clerk_user_id', clerkId) : query.ilike('email', email)

    const { data, error } = await query.select().maybeSingle()
    if (error) return Response.json({ error: error.message }, { status: 500 })
    if (!data) return Response.json({ error: 'Profile not found' }, { status: 404 })
    return Response.json(data)
  } catch (e) {
    if (e.status === 401) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    if (e.status === 403) return Response.json({ error: 'Forbidden' }, { status: 403 })
    throw e
  }
}
