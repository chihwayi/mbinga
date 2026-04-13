-- ============================================================
-- MBINGA Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ─── Products ────────────────────────────────────────────────
create table if not exists products (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  slug         text unique not null,
  tagline      text not null default '',
  description  text not null default '',
  story        text not null default '',
  category     text not null default 'Signature',
  price        numeric(10,2) not null,
  stock        integer not null default 0,
  notes        jsonb not null default '[]'::jsonb,
  ingredients  jsonb not null default '[]'::jsonb,
  image        text not null default '',
  accent_color text not null default '#D4AF37',
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- ─── Orders ──────────────────────────────────────────────────
create table if not exists orders (
  id                   uuid primary key default gen_random_uuid(),
  custom_payment_id    text unique,
  customer_name        text not null,
  customer_email       text,
  customer_phone       text not null,
  delivery_address     text,
  items                jsonb not null default '[]'::jsonb,
  subtotal             numeric(10,2) not null default 0,
  delivery_cost        numeric(10,2) not null default 0,
  total_amount         numeric(10,2) not null,
  currency             text not null default 'USD',
  status               text not null default 'pending',
  bobpay_uuid          text,
  bobpay_short_ref     text,
  bobpay_payment_id    integer,
  paid_amount          numeric(10,2),
  payment_method       text,
  from_bank            text,
  is_test              boolean not null default false,
  webhook_payload      jsonb,
  webhook_received_at  timestamptz,
  created_at           timestamptz default now(),
  updated_at           timestamptz default now()
);

-- ─── Hero Slides (admin-managed homepage slides) ─────────────
create table if not exists hero_slides (
  id           uuid primary key default gen_random_uuid(),
  title        text not null default '',
  subtitle     text not null default '',
  image_url    text not null,
  cta_text     text not null default 'Explore Collection',
  cta_link     text not null default '/#collection',
  order_index  integer not null default 0,
  is_active    boolean not null default true,
  created_at   timestamptz default now()
);

-- ─── Webhook Logs ─────────────────────────────────────────────
create table if not exists webhook_logs (
  id               uuid primary key default gen_random_uuid(),
  source           text not null default 'bobpay',
  event_id         text,
  order_id         uuid references orders(id) on delete set null,
  status           text,
  payload          jsonb,
  ip_address       text,
  signature_valid  boolean,
  processed        boolean not null default false,
  error            text,
  created_at       timestamptz default now()
);

-- ─── Settings ─────────────────────────────────────────────────
create table if not exists settings (
  key        text primary key,
  value      text not null,
  updated_at timestamptz default now()
);

-- Default settings
insert into settings (key, value) values
  ('delivery_cost', '5.00'),
  ('whatsapp_number', '263770000000'),
  ('site_name', 'MBINGA'),
  ('currency', 'USD')
on conflict (key) do nothing;

-- ─── Auto-update updated_at ───────────────────────────────────
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger products_updated_at
  before update on products
  for each row execute function update_updated_at();

create trigger orders_updated_at
  before update on orders
  for each row execute function update_updated_at();

-- ─── Disable RLS for now (enable when adding user auth) ───────
alter table products    disable row level security;
alter table orders      disable row level security;
alter table hero_slides disable row level security;
alter table webhook_logs disable row level security;
alter table settings    disable row level security;
