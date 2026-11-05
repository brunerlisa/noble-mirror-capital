# SQL Migrations for Interactive Prime Trade

Run these in your **Supabase SQL Editor** if you have an existing database.

## 1. Payments – support withdrawals

```sql
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS payment_type text NOT NULL DEFAULT 'deposit';
```

## 2. Profiles – onboarding status

```sql
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS has_onboarded boolean NOT NULL DEFAULT false;
```

## 3. Trader avatar storage bucket

In **Supabase Dashboard → Storage → New bucket**:

- Name: `traders`
- Public bucket: **ON**

Or run:

```sql
INSERT INTO storage.buckets (id, name, public) VALUES ('traders', 'traders', true)
ON CONFLICT (id) DO NOTHING;
```

After creating the bucket, add a policy for public read if needed (Storage → traders → Policies).
