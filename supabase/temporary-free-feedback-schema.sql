-- ==============================================================================
-- ITNAVIDEO: TEMPORARY FREE ACCESS & FEEDBACK SYSTEM MIGRATION
-- Adds:
-- 1. public.video_downloads (Daily download tracking with IST reset)
-- 2. public.video_feedback (Structured contextual video and platform feedback)
-- ==============================================================================

-- 1. Daily Video Downloads Ledger
CREATE TABLE IF NOT EXISTS public.video_downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  video_id text NOT NULL,
  video_type text NOT NULL,
  download_date_ist text NOT NULL, -- Format: YYYY-MM-DD in Asia/Kolkata
  output_url text,
  file_name text,
  status text NOT NULL DEFAULT 'completed',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Compound Unique Index: Allows users to re-download the same video on the same day without consuming a second download!
CREATE UNIQUE INDEX IF NOT EXISTS idx_video_downloads_user_video_date 
  ON public.video_downloads (user_id, video_id, download_date_ist);

CREATE INDEX IF NOT EXISTS idx_video_downloads_user_date 
  ON public.video_downloads (user_id, download_date_ist);

-- 2. Structured User Feedback System
CREATE TABLE IF NOT EXISTS public.video_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  user_email text,
  feedback_type text NOT NULL CHECK (feedback_type IN ('video_contextual', 'general_platform')),
  video_id text,
  video_type text,
  aspect_ratio text, -- '16:9' or '9:16'
  duration_seconds integer,
  template_style text,
  generation_settings jsonb DEFAULT '{}'::jsonb,
  rating text NOT NULL CHECK (rating IN ('excellent', 'good', 'average', 'poor')),
  rating_score integer NOT NULL, -- 4: Excellent, 3: Good, 2: Average, 1: Poor
  improvement_tags text[] DEFAULT '{}',
  comment text,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'in_progress', 'resolved', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_video_feedback_type_rating ON public.video_feedback (video_type, rating);
CREATE INDEX IF NOT EXISTS idx_video_feedback_created_at ON public.video_feedback (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_video_feedback_status ON public.video_feedback (status);

-- 3. Row Level Security (Mandatory per AGENTS.md Rule 8)
ALTER TABLE public.video_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_feedback ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own download logs
DROP POLICY IF EXISTS "Users can view own downloads" ON public.video_downloads;
CREATE POLICY "Users can view own downloads" ON public.video_downloads
  FOR SELECT USING (auth.uid()::text = user_id);

-- Allow authenticated and guest users to submit feedback
DROP POLICY IF EXISTS "Anyone can submit feedback" ON public.video_feedback;
CREATE POLICY "Anyone can submit feedback" ON public.video_feedback
  FOR INSERT WITH CHECK (true);

-- Allow users to view their own feedback
DROP POLICY IF EXISTS "Users can view own feedback" ON public.video_feedback;
CREATE POLICY "Users can view own feedback" ON public.video_feedback
  FOR SELECT USING (auth.uid()::text = user_id);

-- Note: All admin queries and download claim increments execute server-side
-- via SUPABASE_SERVICE_ROLE_KEY which automatically bypasses RLS safely.
