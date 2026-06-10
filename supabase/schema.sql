create table if not exists public.app_settings (
  key text primary key,
  value jsonb not null,
  updated_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.job_applications (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null,
  role_slug text not null,
  role_title text not null,
  linkedin_url text,
  resume_url text,
  portfolio_url text,
  note text,
  source text,
  status text not null default 'received',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists job_applications_email_idx on public.job_applications (email);
create index if not exists job_applications_role_created_idx on public.job_applications (role_slug, created_at desc);

create table if not exists public.waitlist (
  id bigint generated always as identity primary key,
  email text not null,
  source text,
  created_at timestamptz not null default now()
);
create unique index if not exists waitlist_email_unique_idx on public.waitlist (lower(email));

create table if not exists public.newsletter (
  id bigint generated always as identity primary key,
  email text not null,
  source text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create unique index if not exists newsletter_email_unique_idx on public.newsletter (lower(email));

create table if not exists public.render_history (
  id bigint generated always as identity primary key,
  user_id text not null,
  render_id text not null,
  bucket_name text,
  mode text not null check (mode in ('videoExplainer', 'notes', 'facecam', 'handwriting')),
  design text,
  title text not null,
  output_file text not null,
  output_size_in_bytes bigint,
  costs jsonb,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '48 hours')
);
create unique index if not exists render_history_user_render_unique_idx on public.render_history (user_id, render_id);
create index if not exists render_history_user_expires_idx on public.render_history (user_id, expires_at desc);

-- Security hardening:
-- All app database writes/reads go through server-side Supabase service-role
-- helpers in services/supabase/projectStore.mjs. Keep these public-schema
-- tables protected from direct anon/authenticated browser access.
alter table public.app_settings enable row level security;
alter table public.job_applications enable row level security;
alter table public.waitlist enable row level security;
alter table public.newsletter enable row level security;
alter table public.render_history enable row level security;
