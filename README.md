# Interactive Prime Trade - Copy Trading Platform

Next.js app with **Supabase Auth** and Supabase database. Auth is enforced in `proxy.js` and API routes. Database writes use the service role.

## Env vars (Vercel + `.env.local`)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Optional: comma-separated emails that always get admin access
ADMIN_EMAILS=you@email.com
```

Get the URL, **anon** key, and **service_role** key from Supabase → Project Settings → API.

## Auth

Sign-in and sign-up use Supabase email/password.

1. In Supabase → Authentication → URL Configuration, set:
   - Site URL: `https://interactiveprimetrd.com`
   - Redirect URLs: `https://interactiveprimetrd.com/auth/callback` and `https://www.interactiveprimetrd.com/auth/callback`
2. Make yourself admin either with `ADMIN_EMAILS` or in the SQL editor:

```sql
update public.profiles set role = 'admin' where email = 'you@email.com';
```

3. Run `supabase-auth-migration.sql` once so Row Level Security uses Supabase Auth.

## Run

```bash
npm install
npm run dev
```
