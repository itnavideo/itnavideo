-- =================================────────────────===========================
-- ITNAVIDEO CMS DATABASE MIGRATION SCRIPT
-- Run this script in your Supabase SQL Editor
-- =================================────────────────===========================

-- 1. BLOG POSTS TABLE
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT, -- Rich HTML / Tiptap JSON content
  category TEXT DEFAULT 'general',
  dashboard_type TEXT DEFAULT 'auto-caption-reel',
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'scheduled', 'published', 'archived')),
  published_at TIMESTAMPTZ DEFAULT NOW(),
  scheduled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  author TEXT DEFAULT 'Itnavideo Team',
  read_time TEXT DEFAULT '5 min read',
  featured_image TEXT,
  featured_image_alt TEXT,
  youtube_id TEXT,
  keywords TEXT[],
  
  -- SEO & Open Graph Metadata
  seo_title TEXT,
  meta_description TEXT,
  focus_keyword TEXT,
  secondary_keywords TEXT[],
  canonical_url TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  schema_metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes for Blog Posts
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_scheduled_at ON public.blog_posts(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON public.blog_posts(published_at DESC);

-- 2. CUSTOM PAGES TABLE
CREATE TABLE IF NOT EXISTS public.pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT, -- Rich HTML / Tiptap JSON content
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  scheduled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  featured_image TEXT,
  
  -- SEO Metadata
  seo_title TEXT,
  meta_description TEXT,
  canonical_url TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT
);

-- Indexes for Custom Pages
CREATE INDEX IF NOT EXISTS idx_pages_slug ON public.pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_status ON public.pages(status);

-- 3. CMS MEDIA LIBRARY TABLE
CREATE TABLE IF NOT EXISTS public.cms_media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  url TEXT NOT NULL,
  alt_text TEXT DEFAULT '',
  caption TEXT DEFAULT '',
  mime_type TEXT DEFAULT 'image/png',
  size_bytes BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for Media Search
CREATE INDEX IF NOT EXISTS idx_cms_media_created ON public.cms_media(created_at DESC);

-- 4. CMS CATEGORIES & TAGS
CREATE TABLE IF NOT EXISTS public.cms_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Default Categories if empty
INSERT INTO public.cms_categories (name, slug, description)
VALUES 
  ('Auto Caption Reel', 'auto-caption-reel', 'Reels with word-level 3D kinetic subtitles'),
  ('Typography Video', 'typography-video', '3D motion typography & subtitle overlays'),
  ('Faceless Long Video', 'faceless-long-video', 'Automated faceless narrative video guides'),
  ('Compare Explainer', 'compare-explainer', 'Split-screen comparison & versus explainers'),
  ('Whiteboard Video', 'whiteboard-video', 'Hand-drawn whiteboard sketch reels'),
  ('General AI Video', 'general', 'AI video creation tips, strategy & tutorials')
ON CONFLICT (slug) DO NOTHING;

