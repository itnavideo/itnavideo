import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

async function isAuthorized() {
  const cookieStore = await cookies();
  return cookieStore.get('admin_session')?.value === 'authenticated';
}

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

// GET — List all blog posts with optional status & query filters
export async function GET(request: Request) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const search = searchParams.get('search');

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ ok: true, posts: [] });
  }

  try {
    let query = supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ ok: true, posts: data || [] });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message || 'Database error', posts: [] }, { status: 500 });
  }
}

// POST — Create or Schedule a new blog post
export async function POST(request: Request) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      title,
      slug,
      excerpt,
      content,
      category,
      dashboardType,
      status = 'draft',
      scheduledAt,
      author,
      readTime,
      featuredImage,
      featuredImageAlt,
      youtubeId,
      keywords,
      seoTitle,
      metaDescription,
      focusKeyword,
      secondaryKeywords,
      canonicalUrl,
      ogTitle,
      ogDescription,
      ogImage,
    } = body;

    if (!title || !slug) {
      return NextResponse.json({ ok: false, error: 'Title and Slug are required.' }, { status: 400 });
    }

    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ ok: false, error: 'Supabase database credentials not configured.' }, { status: 503 });
    }

    const now = new Date().toISOString();
    let publishedAt = status === 'published' ? now : null;

    const payload = {
      title,
      slug,
      excerpt: excerpt || '',
      content: content || '',
      category: category || 'general',
      dashboard_type: dashboardType || 'auto-caption-reel',
      status: status || 'draft',
      published_at: publishedAt,
      scheduled_at: scheduledAt || null,
      created_at: now,
      updated_at: now,
      author: author || 'Itnavideo Team',
      read_time: readTime || '5 min read',
      featured_image: featuredImage || null,
      featured_image_alt: featuredImageAlt || '',
      youtube_id: youtubeId || null,
      keywords: keywords || [],
      seo_title: seoTitle || title,
      meta_description: metaDescription || excerpt || '',
      focus_keyword: focusKeyword || '',
      secondary_keywords: secondaryKeywords || [],
      canonical_url: canonicalUrl || null,
      og_title: ogTitle || seoTitle || title,
      og_description: ogDescription || metaDescription || excerpt || '',
      og_image: ogImage || featuredImage || null,
    };

    const { data, error } = await supabase
      .from('blog_posts')
      .insert(payload)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ ok: false, error: 'A blog post with this URL slug already exists.' }, { status: 409 });
      }
      throw error;
    }

    return NextResponse.json({ ok: true, post: data });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message || 'Failed to create blog post' }, { status: 500 });
  }
}

