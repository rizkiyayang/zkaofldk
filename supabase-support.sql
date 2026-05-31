create extension if not exists pgcrypto;

create table if not exists public.support_orders (
  id uuid primary key default gen_random_uuid(),
  order_id text not null unique,
  donor_name text not null,
  donor_email text not null,
  amount integer not null check (amount >= 5000),
  message text not null default '',
  media_url text,
  media_type text check (media_type is null or media_type in ('youtube')),
  media_video_id text,
  media_duration_seconds integer,
  media_status text,
  payment_status text not null default 'created',
  payment_type text,
  payment_label text,
  fraud_status text,
  midtrans_transaction_id text,
  midtrans_payload jsonb,
  midtrans_fee integer not null default 0,
  net_amount integer not null default 0,
  fee_rule_snapshot jsonb not null default '{}'::jsonb,
  is_big_donation boolean not null default false,
  paid_at timestamptz,
  receipt_sent_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists support_orders_paid_at_idx
  on public.support_orders (paid_at desc)
  where paid_at is not null;

create index if not exists support_orders_donor_email_idx
  on public.support_orders (lower(donor_email))
  where paid_at is not null;

create table if not exists public.support_overlay_settings (
  id text primary key default 'main',
  minimum_amount integer not null default 5000 check (minimum_amount >= 5000),
  media_min_amount integer not null default 25000 check (media_min_amount >= 25000),
  big_donation_threshold integer not null default 50000 check (big_donation_threshold >= 5000),
  preset_amounts integer[] not null default array[5000, 10000, 20000, 100000],
  leaderboard_mode text not null default 'monthly'
    check (leaderboard_mode in ('all_time', 'monthly', 'weekly', 'custom', 'interval_days')),
  leaderboard_limit integer not null default 5
    check (leaderboard_limit between 1 and 20),
  leaderboard_title text not null default 'Top Supporter',
  leaderboard_show_amount boolean not null default true,
  leaderboard_show_rank boolean not null default true,
  leaderboard_transparent boolean not null default false,
  custom_start_at timestamptz,
  reset_interval_days integer not null default 30
    check (reset_interval_days between 1 and 365),
  milestone_title text not null default 'Target jajan hari ini',
  milestone_target_amount integer not null default 500000 check (milestone_target_amount >= 5000),
  milestone_start_at timestamptz,
  refresh_seconds integer not null default 5
    check (refresh_seconds between 2 and 60),
  alert_duration_seconds integer not null default 8
    check (alert_duration_seconds between 3 and 60),
  overlay_size text not null default 'large'
    check (overlay_size in ('compact', 'large')),
  show_amount boolean not null default true,
  sound_enabled boolean not null default true,
  sound_volume numeric not null default 0.65
    check (sound_volume >= 0 and sound_volume <= 1),
  media_base_amount integer not null default 25000 check (media_base_amount >= 25000),
  media_base_seconds integer not null default 30 check (media_base_seconds between 10 and 300),
  media_max_seconds integer not null default 300 check (media_max_seconds between 30 and 300),
  donation_title_template text not null default '{name}',
  donation_message_template text not null default '{message}',
  media_title_template text not null default '{name} berbagi video',
  media_message_template text not null default '{message}',
  updated_at timestamptz not null default now()
);

alter table public.support_overlay_settings
  add column if not exists minimum_amount integer not null default 5000,
  add column if not exists media_min_amount integer not null default 25000,
  add column if not exists big_donation_threshold integer not null default 50000,
  add column if not exists preset_amounts integer[] not null default array[5000, 10000, 20000, 100000],
  add column if not exists leaderboard_show_amount boolean not null default true,
  add column if not exists leaderboard_show_rank boolean not null default true,
  add column if not exists leaderboard_transparent boolean not null default false,
  add column if not exists milestone_title text not null default 'Target jajan hari ini',
  add column if not exists milestone_target_amount integer not null default 500000,
  add column if not exists milestone_start_at timestamptz,
  add column if not exists media_base_amount integer not null default 25000,
  add column if not exists media_base_seconds integer not null default 30,
  add column if not exists media_max_seconds integer not null default 300,
  add column if not exists donation_title_template text not null default '{name}',
  add column if not exists donation_message_template text not null default '{message}',
  add column if not exists media_title_template text not null default '{name} berbagi video',
  add column if not exists media_message_template text not null default '{message}';

insert into public.support_overlay_settings (id)
values ('main')
on conflict (id) do nothing;

create table if not exists public.support_overlay_events (
  id uuid primary key default gen_random_uuid(),
  event_key text not null unique,
  event_type text not null
    check (event_type in ('donation', 'big_donation', 'media_share', 'milestone', 'top_donor')),
  order_id text,
  name text not null,
  amount integer,
  message text not null default '',
  media_url text,
  media_type text,
  media_video_id text,
  media_duration_seconds integer,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists support_overlay_events_created_at_idx
  on public.support_overlay_events (created_at desc);

create table if not exists public.support_withdrawals (
  id uuid primary key default gen_random_uuid(),
  amount integer not null check (amount > 0),
  note text not null default '',
  withdrawn_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists support_withdrawals_withdrawn_at_idx
  on public.support_withdrawals (withdrawn_at desc);

alter table public.support_orders enable row level security;
alter table public.support_overlay_settings enable row level security;
alter table public.support_overlay_events enable row level security;
alter table public.support_withdrawals enable row level security;
