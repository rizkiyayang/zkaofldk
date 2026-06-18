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
  amount integer not null check (amount >= 0),
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

-- Migrasi untuk project lama: izinkan order gratis bernilai 0.
alter table public.uas_orders
  drop constraint if exists uas_orders_amount_check;

alter table public.uas_orders
  add constraint uas_orders_amount_check check (amount >= 0);

create index if not exists uas_attempts_leaderboard_idx
  on public.uas_attempts (score desc, duration_seconds asc, finished_at desc);

create index if not exists uas_orders_quiz_token_idx
  on public.uas_orders (quiz_token);

alter table public.uas_players enable row level security;
alter table public.uas_orders enable row level security;
alter table public.uas_attempts enable row level security;
