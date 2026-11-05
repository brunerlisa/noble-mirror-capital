-- =============================================================================
-- Interactive Prime Trade - SQL Migrations
-- =============================================================================
-- Run this in your Supabase project: SQL Editor > New query > paste & run
-- Safe to run multiple times (uses "if not exists" / "add column if not exists")
-- =============================================================================

-- 1. Add has_onboarded to profiles (so returning users skip onboarding)
alter table public.profiles add column if not exists has_onboarded boolean not null default false;

-- 1b. Store full onboarding answers (incl. investment amount)
alter table public.profiles add column if not exists onboarding_json text;

-- 2. Add payment_type to payments (for Withdrawal section)
alter table public.payments add column if not exists payment_type text not null default 'deposit';

-- 2b. KYC fields on profiles
alter table public.profiles add column if not exists kyc_status text not null default 'not_submitted';
alter table public.profiles add column if not exists kyc_submitted_at timestamptz;
alter table public.profiles add column if not exists kyc_json text;
alter table public.profiles add column if not exists preferences_json text;

-- 2c. Create Storage bucket for KYC document uploads
--    Do this manually in Supabase Dashboard:
--    Storage > New bucket > Name: "kyc" > Public bucket: ON > Create

-- 3. Create Storage bucket for trader avatar uploads
--    Do this manually in Supabase Dashboard:
--    Storage > New bucket > Name: "traders" > Public bucket: ON > Create

-- 4. Deposit wallet addresses and QR codes managed by admin
--    Full recreate script: supabase-deposit-wallets.sql
create table if not exists public.deposit_wallets (
  id             uuid        primary key default gen_random_uuid(),
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

alter table public.deposit_wallets add column if not exists confirmations integer not null default 2;
alter table public.deposit_wallets add column if not exists qr_code_url text default '';
alter table public.deposit_wallets add column if not exists instructions text default '';
alter table public.deposit_wallets add column if not exists is_active boolean not null default true;

-- 4b. Create Storage bucket for deposit QR images
--    Storage > New bucket > Name: "wallets" > Public bucket: ON > Create

-- 5. Account plan for Upgrade Plan (Bronze / Silver / Gold)
alter table public.user_accounts add column if not exists plan text not null default 'basic';
alter table public.user_accounts add column if not exists plan_status text not null default 'active';
