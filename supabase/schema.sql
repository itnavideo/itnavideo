create table if not exists public.projects (
  id text primary key,
  owner_id uuid not null,
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
  user_id uuid not null,
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
