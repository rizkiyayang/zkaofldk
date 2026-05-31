create extension if not exists pgcrypto;

create table if not exists public.uas_players (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.uas_orders (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references public.uas_players(id) on delete set null,
  order_id text not null unique,
  name text not null,
  email text not null,
  amount integer not null check (amount >= 10000),
  channel text not null,
  payment_status text not null default 'created',
  fraud_status text,
  midtrans_transaction_id text,
  midtrans_payload jsonb,
  quiz_token text not null unique,
  quiz_started_at timestamptz,
  paid_at timestamptz,
  submitted_at timestamptz,
  receipt_sent_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.uas_attempts (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references public.uas_players(id) on delete set null,
  order_id text not null unique references public.uas_orders(order_id) on delete cascade,
  name text not null,
  answers jsonb not null,
  answer_detail jsonb not null,
  raw_score integer not null,
  score integer not null,
  rank text not null,
  duration_seconds integer not null,
  finished_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists uas_attempts_leaderboard_idx
  on public.uas_attempts (score desc, duration_seconds asc, finished_at desc);

create index if not exists uas_orders_quiz_token_idx
  on public.uas_orders (quiz_token);

create table if not exists public.uas_overlay_settings (
  id text primary key default 'main',
  leaderboard_mode text not null default 'monthly'
    check (leaderboard_mode in ('all_time', 'monthly', 'weekly', 'custom', 'interval_days')),
  leaderboard_limit integer not null default 5
    check (leaderboard_limit between 1 and 20),
  leaderboard_title text not null default 'UAS Valorant Highscore',
  custom_start_at timestamptz,
  reset_interval_days integer not null default 30
    check (reset_interval_days between 1 and 365),
  refresh_seconds integer not null default 7
    check (refresh_seconds between 3 and 60),
  alert_duration_seconds integer not null default 7
    check (alert_duration_seconds between 3 and 20),
  show_amount boolean not null default true,
  overlay_size text not null default 'large'
    check (overlay_size in ('compact', 'large')),
  sound_enabled boolean not null default true,
  sound_volume numeric not null default 0.65
    check (sound_volume >= 0 and sound_volume <= 1),
  tts_enabled boolean not null default false,
  tts_volume numeric not null default 0.9
    check (tts_volume >= 0 and tts_volume <= 1),
  tts_rate numeric not null default 1
    check (tts_rate >= 0.7 and tts_rate <= 1.3),
  tts_voice text not null default '',
  payment_template text not null default '{name} memulai ujian akhir season valorant',
  exam_template text not null default '{name} selesai ujian dan mendapat {rank}',
  highscore_template text not null default '{name} masuk highscore nomor {position}',
  radiant_template text not null default '{name} mendapat Radiant',
  updated_at timestamptz not null default now()
);

alter table public.uas_overlay_settings
  add column if not exists overlay_size text not null default 'large'
    check (overlay_size in ('compact', 'large')),
  add column if not exists sound_enabled boolean not null default true,
  add column if not exists sound_volume numeric not null default 0.65
    check (sound_volume >= 0 and sound_volume <= 1),
  add column if not exists tts_enabled boolean not null default false,
  add column if not exists tts_volume numeric not null default 0.9
    check (tts_volume >= 0 and tts_volume <= 1),
  add column if not exists tts_rate numeric not null default 1
    check (tts_rate >= 0.7 and tts_rate <= 1.3),
  add column if not exists tts_voice text not null default '',
  add column if not exists payment_template text not null default '{name} memulai ujian akhir season valorant',
  add column if not exists exam_template text not null default '{name} selesai ujian dan mendapat {rank}',
  add column if not exists highscore_template text not null default '{name} masuk highscore nomor {position}',
  add column if not exists radiant_template text not null default '{name} mendapat Radiant';

insert into public.uas_overlay_settings (id)
values ('main')
on conflict (id) do nothing;

create table if not exists public.uas_overlay_events (
  id uuid primary key default gen_random_uuid(),
  event_key text not null unique,
  event_type text not null
    check (event_type in ('payment_success', 'exam_finished', 'highscore', 'radiant')),
  order_id text,
  name text not null,
  amount integer,
  score integer,
  rank text,
  duration_seconds integer,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists uas_overlay_events_created_at_idx
  on public.uas_overlay_events (created_at desc);

alter table public.uas_players enable row level security;
alter table public.uas_orders enable row level security;
alter table public.uas_attempts enable row level security;
alter table public.uas_overlay_settings enable row level security;
alter table public.uas_overlay_events enable row level security;
