import { getSupabaseAdmin } from '@/lib/supabase-server'

export async function POST(req) {
  try {
    const body = await req.json()
    const email = String(body.email || '').trim().toLowerCase()
    const password = String(body.password || '')
    const fullName = String(body.full_name || '').trim()

    if (!email || !password) {
      return Response.json({ error: 'Email and password are required' }, { status: 400 })
    }
    if (password.length < 8) {
      return Response.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const { data, error } = await getSupabaseAdmin().auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    })

    if (error) {
      const message = error.message || 'Sign up failed'
      const already = /already been registered|already exists|duplicate/i.test(message)
      return Response.json(
        { error: already ? 'An account with this email already exists. Sign in instead.' : message },
        { status: already ? 409 : 400 }
      )
    }

    const createdAt = data.user?.created_at || new Date().toISOString()
    if (data.user?.id) {
      try {
        await getSupabaseAdmin().from('profiles').insert({
          clerk_user_id: data.user.id,
          email,
          full_name: fullName,
          created_at: createdAt,
          updated_at: createdAt,
        })
      } catch {
        // The auth account is already created. Signup time still comes from auth.users.
      }
    }

    return Response.json({ ok: true, userId: data.user?.id, signed_up_at: createdAt })
  } catch (error) {
    return Response.json({ error: error.message || 'Sign up failed' }, { status: 500 })
  }
}
