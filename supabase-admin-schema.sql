-- Interactive Prime Trade - Supabase DB Schema
-- Auth: Supabase Auth. This file is the original table setup.
-- Run in Supabase SQL editor. Script is fully re-runnable.

create extension if not exists "uuid-ossp";

-- =====================================================================
-- TABLES
-- =====================================================================

-- profiles: one row per signed-in user, synced by the app on login
create table if not exists public.profiles (
  clerk_user_id text primary key,
  email         text unique not null,
  full_name     text        default '',
  role             text        not null default 'user',
  has_onboarded  boolean     not null default false,
  onboarding_json text,
  kyc_status         text        not null default 'not_submitted',
  kyc_submitted_at  timestamptz,
  kyc_json           text,
  preferences_json  text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- traders: managed by admin, readable by all authenticated users
create table if not exists public.traders (
  id               uuid        primary key default uuid_generate_v4(),
  name             text        not null,
  avatar_url       text,
  risk             text        not null default 'Low',
  style            text        not null default 'Mixed',
  monthly_profit   numeric     not null default 0,
  yearly_profit    numeric     not null default 0,
  win_rate         numeric     not null default 0,
  experience_years integer     not null default 0,
  fee_percent      numeric     not null default 10,
  min_capital      numeric     not null default 10000,
  copiers          integer     not null default 0,
  status           text        not null default 'ACTIVE',
  bio              text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- payments: deposit and withdrawal requests submitted by users
create table if not exists public.payments (
  id             uuid        primary key default uuid_generate_v4(),
  user_clerk_id  text        not null,
  user_email     text        not null,
  amount_usd     numeric     not null default 0,
  amount_crypto  numeric     not null default 0,
  method         text,
  status         text        not null default 'pending',
  payment_type   text        not null default 'deposit',
  notes          text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- user_accounts: balance/profit per user, managed by admin
create table if not exists public.user_accounts (
  id             uuid        primary key default uuid_generate_v4(),
  user_clerk_id  text        not null unique,
  user_email     text        not null unique,
  balance        numeric     not null default 0,
  profit         numeric     not null default 0,
  status         text        not null default 'active',
  plan           text        not null default 'basic',
  plan_status    text        not null default 'active',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- trade_updates: individual trade outcomes recorded by admin
create table if not exists public.trade_updates (
  id             uuid        primary key default uuid_generate_v4(),
  user_clerk_id  text        not null,
  user_email     text        not null,
  trader_name    text        not null,
  pnl            numeric     not null default 0,
  result         text        not null default 'profit',
  notes          text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- deposit_wallets: admin-managed payment addresses and QR codes
create table if not exists public.deposit_wallets (
  id             uuid        primary key default uuid_generate_v4(),
  method         text        not null unique,
  network        text        default '',
  wallet_address text        not null default '',
  qr_code_url    text        default '',
  instructions   text        default '',
  confirmations  integer     not null default 2,
  is_active      boolean     not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- =====================================================================
-- MIGRATION: add user id columns to legacy tables if not already present
-- =====================================================================
alter table public.profiles      add column if not exists clerk_user_id text;
alter table public.profiles      add column if not exists has_onboarded boolean not null default false;
alter table public.profiles      add column if not exists onboarding_json text;
alter table public.profiles      add column if not exists kyc_status text not null default 'not_submitted';
alter table public.profiles      add column if not exists kyc_submitted_at timestamptz;
alter table public.profiles      add column if not exists kyc_json text;
alter table public.profiles      add column if not exists preferences_json text;
alter table public.payments      add column if not exists user_clerk_id text not null default '';
alter table public.payments      add column if not exists payment_type text not null default 'deposit';
alter table public.user_accounts add column if not exists user_clerk_id text;
alter table public.user_accounts add column if not exists plan text not null default 'basic';
alter table public.user_accounts add column if not exists plan_status text not null default 'active';
alter table public.trade_updates add column if not exists user_clerk_id text not null default '';

-- =====================================================================
-- INDEXES
-- =====================================================================
create index if not exists idx_payments_clerk_id    on public.payments (user_clerk_id);
create index if not exists idx_accounts_clerk_id    on public.user_accounts (user_clerk_id);
create index if not exists idx_trade_updates_clerk  on public.trade_updates (user_clerk_id);
create index if not exists idx_profiles_email       on public.profiles (email);

-- =====================================================================
-- TRIGGERS: keep updated_at current
-- =====================================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at      on public.profiles;
drop trigger if exists trg_traders_updated_at        on public.traders;
drop trigger if exists trg_payments_updated_at       on public.payments;
drop trigger if exists trg_user_accounts_updated_at  on public.user_accounts;
drop trigger if exists trg_trade_updates_updated_at  on public.trade_updates;

create trigger trg_profiles_updated_at      before update on public.profiles      for each row execute function public.set_updated_at();
create trigger trg_traders_updated_at        before update on public.traders        for each row execute function public.set_updated_at();
create trigger trg_payments_updated_at       before update on public.payments       for each row execute function public.set_updated_at();
create trigger trg_user_accounts_updated_at  before update on public.user_accounts  for each row execute function public.set_updated_at();
create trigger trg_trade_updates_updated_at  before update on public.trade_updates  for each row execute function public.set_updated_at();

-- =====================================================================
-- RLS: enable on all tables
-- =====================================================================
alter table public.profiles       enable row level security;
alter table public.traders         enable row level security;
alter table public.payments        enable row level security;
alter table public.user_accounts   enable row level security;
alter table public.trade_updates   enable row level security;

-- =====================================================================
-- JWT HELPERS (historical). Prefer supabase-auth-migration.sql on live DB.
-- =====================================================================

-- Returns the signed-in user id
create or replace function public.jwt_clerk_id()
returns text language sql stable as $$
  select coalesce(auth.jwt() ->> 'sub', '');
$$;

-- Returns the caller's email (lowercased)
create or replace function public.jwt_email()
returns text language sql stable as $$
  select lower(coalesce(auth.jwt() ->> 'email', ''));
$$;

-- Returns true if the caller is an admin
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select lower(coalesce(auth.jwt() ->> 'app_role', '')) = 'admin';
$$;

grant execute on function public.jwt_clerk_id() to authenticated;
grant execute on function public.jwt_email()    to authenticated;
grant execute on function public.is_admin()     to authenticated;

-- =====================================================================
-- POLICIES: drop old, recreate clean
-- =====================================================================

-- profiles
drop policy if exists "profiles_select"          on public.profiles;
drop policy if exists "profiles_insert"          on public.profiles;
drop policy if exists "profiles_update"          on public.profiles;
drop policy if exists "profiles_delete"          on public.profiles;
-- legacy names from previous schema iterations
drop policy if exists "profiles_select_own_or_admin"   on public.profiles;
drop policy if exists "profiles_update_own_or_admin"   on public.profiles;
drop policy if exists "profiles_insert_admin"          on public.profiles;
drop policy if exists "profiles_insert_self_or_admin"  on public.profiles;
drop policy if exists "profiles_delete_admin"          on public.profiles;
drop policy if exists "auth read profiles"             on public.profiles;
drop policy if exists "auth write profiles"            on public.profiles;

-- User can read/write own profile row; admin can do anything
create policy "profiles_select" on public.profiles
  for select to authenticated
  using (public.is_admin() or clerk_user_id = public.jwt_clerk_id());

create policy "profiles_insert" on public.profiles
  for insert to authenticated
  with check (public.is_admin() or clerk_user_id = public.jwt_clerk_id());

create policy "profiles_update" on public.profiles
  for update to authenticated
  using (public.is_admin() or clerk_user_id = public.jwt_clerk_id())
  with check (public.is_admin() or clerk_user_id = public.jwt_clerk_id());

create policy "profiles_delete" on public.profiles
  for delete to authenticated
  using (public.is_admin());

-- traders
drop policy if exists "traders_select_authenticated" on public.traders;
drop policy if exists "traders_write_admin"          on public.traders;
drop policy if exists "auth read traders"            on public.traders;
drop policy if exists "auth write traders"           on public.traders;

create policy "traders_select" on public.traders
  for select to authenticated using (true);

create policy "traders_write_admin" on public.traders
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- payments
drop policy if exists "payments_insert_own"           on public.payments;
drop policy if exists "payments_select_own_or_admin"  on public.payments;
drop policy if exists "payments_update_admin"         on public.payments;
drop policy if exists "payments_delete_admin"         on public.payments;
drop policy if exists "auth read payments"            on public.payments;
drop policy if exists "auth write payments"           on public.payments;

create policy "payments_insert" on public.payments
  for insert to authenticated
  with check (user_clerk_id = public.jwt_clerk_id());

create policy "payments_select" on public.payments
  for select to authenticated
  using (public.is_admin() or user_clerk_id = public.jwt_clerk_id());

create policy "payments_update_admin" on public.payments
  for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "payments_delete_admin" on public.payments
  for delete to authenticated
  using (public.is_admin());

-- user_accounts
drop policy if exists "accounts_select_own_or_admin" on public.user_accounts;
drop policy if exists "accounts_write_admin"         on public.user_accounts;
drop policy if exists "auth read user accounts"      on public.user_accounts;
drop policy if exists "auth write user accounts"     on public.user_accounts;

create policy "accounts_select" on public.user_accounts
  for select to authenticated
  using (public.is_admin() or user_clerk_id = public.jwt_clerk_id());

create policy "accounts_write_admin" on public.user_accounts
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- trade_updates
drop policy if exists "trade_updates_select_own_or_admin" on public.trade_updates;
drop policy if exists "trade_updates_write_admin"         on public.trade_updates;
drop policy if exists "auth read trade updates"           on public.trade_updates;
drop policy if exists "auth write trade updates"          on public.trade_updates;

create policy "trade_updates_select" on public.trade_updates
  for select to authenticated
  using (public.is_admin() or user_clerk_id = public.jwt_clerk_id());

create policy "trade_updates_write_admin" on public.trade_updates
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- =====================================================================
-- ADMIN ACCESS
-- =====================================================================
-- Grant admin in SQL:
--   update public.profiles set role = 'admin' where email = 'you@email.com';
--
-- Or set ADMIN_EMAILS in Vercel environment variables.
