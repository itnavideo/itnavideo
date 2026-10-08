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

// GET — List all custom pages
export async function GET(request: Request) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ ok: true, pages: [] });
  }

  try {
    let query = supabase
      .from('pages')
      .select('*')
      .order('created_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ ok: true, pages: data || [] });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message || 'Database error', pages: [] }, { status: 500 });
  }
}

// POST — Create new custom page
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
      status = 'draft',
      scheduledAt,
      featuredImage,
      seoTitle,
      metaDescription,
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
      status: status || 'draft',
      published_at: publishedAt,
      scheduled_at: scheduledAt || null,
      created_at: now,
      updated_at: now,
      featured_image: featuredImage || null,
      seo_title: seoTitle || title,
      meta_description: metaDescription || excerpt || '',
      canonical_url: canonicalUrl || null,
      og_title: ogTitle || seoTitle || title,
      og_description: ogDescription || metaDescription || excerpt || '',
      og_image: ogImage || featuredImage || null,
    };

    const { data, error } = await supabase
      .from('pages')
      .insert(payload)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ ok: false, error: 'A page with this URL slug already exists.' }, { status: 409 });
      }
      throw error;
    }

    return NextResponse.json({ ok: true, page: data });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message || 'Failed to create page' }, { status: 500 });
  }
}

