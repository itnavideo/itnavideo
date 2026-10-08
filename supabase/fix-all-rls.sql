-- ==============================================================================
-- ITNAVIDEO: COMPLETE SUPABASE ROW LEVEL SECURITY (RLS) FIX
-- Fixes: Supabase Security Advisor "rls_disabled_in_public / Table publicly accessible"
-- Project: itnavideo's Project (vcqkjrcewfwtlepnyjfc)
-- ==============================================================================
--
-- Instructions:
-- 1. Open Supabase Dashboard -> https://supabase.com/dashboard/project/vcqkjrcewfwtlepnyjfc
-- 2. Click "SQL Editor" in the left sidebar.
-- 3. Click "New Query", paste ALL the SQL below, and click "Run".
-- ==============================================================================

-- 1. Enable RLS on ALL existing and future public tables automatically
DO $$ 
DECLARE 
    r RECORD;
BEGIN 
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') 
    LOOP 
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', r.tablename);
    END LOOP; 
END $$;

-- 2. Explicitly Enable RLS on known Itnavideo tables (for clarity and safety)
ALTER TABLE IF EXISTS public.app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.render_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.newsletter ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.cms_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.pages ENABLE ROW LEVEL SECURITY;

-- 3. CMS & Blog Tables: Allow Public Read (SELECT) so blog posts load on the site
DROP POLICY IF EXISTS "Public can view published blog posts" ON public.blog_posts;
CREATE POLICY "Public can view published blog posts" 
ON public.blog_posts 
FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Public can view cms media" ON public.cms_media;
CREATE POLICY "Public can view cms media" 
ON public.cms_media 
FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Public can view pages" ON public.pages;
CREATE POLICY "Public can view pages" 
ON public.pages 
FOR SELECT 
USING (true);

-- 4. User Interaction Tables: Allow anon submissions (INSERT only)
DROP POLICY IF EXISTS "Anyone can submit waitlist" ON public.waitlist;
CREATE POLICY "Anyone can submit waitlist" 
ON public.waitlist 
FOR INSERT 
WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can submit newsletter" ON public.newsletter;
CREATE POLICY "Anyone can submit newsletter" 
ON public.newsletter 
FOR INSERT 
WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can submit job applications" ON public.job_applications;
CREATE POLICY "Anyone can submit job applications" 
ON public.job_applications 
FOR INSERT 
WITH CHECK (true);

-- 5. Private / Admin Tables (app_settings, render_history)
-- No anon policies needed. Server-side API routes use the SUPABASE_SERVICE_ROLE_KEY
-- which automatically bypasses RLS safely and securely.
