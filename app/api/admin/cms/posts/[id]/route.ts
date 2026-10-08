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

// GET — Fetch single post by ID or Slug
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: 'Supabase not configured' }, { status: 503 });
  }

  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    let query = supabase.from('blog_posts').select('*');

    if (isUuid) {
      query = query.eq('id', id);
    } else {
      query = query.eq('slug', id);
    }

    const { data, error } = await query.single();
    if (error) throw error;

    return NextResponse.json({ ok: true, post: data });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message || 'Post not found' }, { status: 404 });
  }
}

// PUT — Update existing blog post
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: 'Supabase not configured' }, { status: 503 });
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
      status,
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

    const now = new Date().toISOString();

    const updates: Record<string, any> = {
      updated_at: now,
    };

    if (title !== undefined) updates.title = title;
    if (slug !== undefined) updates.slug = slug;
    if (excerpt !== undefined) updates.excerpt = excerpt;
    if (content !== undefined) updates.content = content;
    if (category !== undefined) updates.category = category;
    if (dashboardType !== undefined) updates.dashboard_type = dashboardType;
    if (status !== undefined) {
      updates.status = status;
      if (status === 'published' && !scheduledAt) {
        updates.published_at = now;
      }
    }
    if (scheduledAt !== undefined) updates.scheduled_at = scheduledAt;
    if (author !== undefined) updates.author = author;
    if (readTime !== undefined) updates.read_time = readTime;
    if (featuredImage !== undefined) updates.featured_image = featuredImage;
    if (featuredImageAlt !== undefined) updates.featured_image_alt = featuredImageAlt;
    if (youtubeId !== undefined) updates.youtube_id = youtubeId;
    if (keywords !== undefined) updates.keywords = keywords;
    if (seoTitle !== undefined) updates.seo_title = seoTitle;
    if (metaDescription !== undefined) updates.meta_description = metaDescription;
    if (focusKeyword !== undefined) updates.focus_keyword = focusKeyword;
    if (secondaryKeywords !== undefined) updates.secondary_keywords = secondaryKeywords;
    if (canonicalUrl !== undefined) updates.canonical_url = canonicalUrl;
    if (ogTitle !== undefined) updates.og_title = ogTitle;
    if (ogDescription !== undefined) updates.og_description = ogDescription;
    if (ogImage !== undefined) updates.og_image = ogImage;

    const { data, error } = await supabase
      .from('blog_posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ ok: true, post: data });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message || 'Failed to update post' }, { status: 500 });
  }
}

// DELETE — Remove blog post
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: 'Supabase not configured' }, { status: 503 });
  }

  try {
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (error) throw error;

    return NextResponse.json({ ok: true, deletedId: id });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message || 'Failed to delete post' }, { status: 500 });
  }
}

