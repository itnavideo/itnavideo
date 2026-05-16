create table if not exists public.projects (
  id text primary key,
  owner_id text not null,
  title text,
  status text not null default 'Queued',
  progress integer not null default 0 check (progress >= 0 and progress <= 100),
  style text,
  quality text,
  voice_url text,
  voiceover_url text,
  visual_url text,
  video_url text,
  render_url text,
  render_provider text,
  timeline_scenes integer default 0,
  captions integer default 0,
  duration_seconds numeric,
  user_assets jsonb,
  timeline jsonb,
  error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists projects_owner_created_idx on public.projects (owner_id, created_at desc);

create table if not exists public.ffmpeg_jobs (
  id text primary key,
  job_id text not null,
  user_id text not null,
  status text not null,
  progress integer not null default 0 check (progress >= 0 and progress <= 100),
  message text not null,
  video_url text,
  error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists ffmpeg_jobs_user_job_idx on public.ffmpeg_jobs (user_id, job_id);
create index if not exists ffmpeg_jobs_updated_idx on public.ffmpeg_jobs (updated_at);

create table if not exists public.blacklisted_assets (
  asset_key text primary key,
  asset_id text,
  url_hash text,
  url text,
  provider text,
  reason text not null,
  metadata jsonb,
  hit_count integer not null default 1,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blacklisted_assets_expires_idx on public.blacklisted_assets (expires_at);
create index if not exists blacklisted_assets_provider_idx on public.blacklisted_assets (provider);

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

create table if not exists public.newsletter (
  id bigint generated always as identity primary key,
  email text not null,
  source text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
