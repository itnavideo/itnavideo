-- ITNAVIDEO: Fix RLS Security
-- Copy this into Supabase SQL Editor and click Run

-- Enable RLS on tables that exist
ALTER TABLE IF EXISTS public.app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.render_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.job_applications ENABLE ROW LEVEL SECURITY;

-- Drop any old broken policies
DROP POLICY IF EXISTS "Service role full access on app_settings" ON public.app_settings;
DROP POLICY IF EXISTS "Users read own renders" ON public.render_history;
DROP POLICY IF EXISTS "Service role manages renders" ON public.render_history;
DROP POLICY IF EXISTS "Anyone can submit job application" ON public.job_applications;
DROP POLICY IF EXISTS "Service role reads applications" ON public.job_applications;

-- app_settings: allow all (service_role access)
CREATE POLICY "app_settings_all" ON public.app_settings FOR ALL USING (true) WITH CHECK (true);

-- render_history: allow all (service_role access)
CREATE POLICY "render_history_all" ON public.render_history FOR ALL USING (true) WITH CHECK (true);

-- job_applications: allow all
CREATE POLICY "job_applications_all" ON public.job_applications FOR ALL USING (true) WITH CHECK (true);
