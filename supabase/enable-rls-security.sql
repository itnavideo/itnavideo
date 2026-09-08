-- Run this once in Supabase Dashboard -> SQL Editor for the production project.
-- It fixes the Supabase Security Advisor warning:
-- "Table publicly accessible / rls_disabled_in_public".
--
-- This project accesses these tables from server-side API routes using the
-- service-role key, so no anon/authenticated direct table policies are needed.

alter table public.app_settings enable row level security;
alter table public.job_applications enable row level security;
alter table public.waitlist enable row level security;
alter table public.newsletter enable row level security;
alter table public.render_history enable row level security;
