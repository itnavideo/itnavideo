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

// GET — list all blog posts
export async function GET() {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ ok: true, posts: [] });
  }

  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ ok: true, posts: data || [] });
  } catch (e: any) {
    return NextResponse.json({ ok: true, posts: [], note: e.message || 'Table may not exist yet' });
  }
}

// POST — create a new blog post
export async function POST(request: Request) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { title, slug, excerpt, content, category } = body;

  if (!title || !slug || !content) {
    return NextResponse.json({ ok: false, error: 'Title, slug, and content are required.' }, { status: 400 });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: 'Supabase not configured. Use the "Copy Code" method instead.' }, { status: 503 });
  }

  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert({
        title,
        slug,
        excerpt: excerpt || '',
        content,
        category: category || 'general',
        published: true,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      // Table might not exist — give helpful error
      if (error.message?.includes('relation') || error.code === '42P01') {
        return NextResponse.json({
          ok: false,
          error: 'Blog posts table not found in Supabase. Create it first, or use "Copy Code" to add to lib/blogPosts.ts manually.',
          hint: 'CREATE TABLE blog_posts (id uuid DEFAULT gen_random_uuid() PRIMARY KEY, title text, slug text UNIQUE, excerpt text, content text, category text, published boolean DEFAULT true, created_at timestamptz DEFAULT now());',
        }, { status: 422 });
      }
      throw error;
    }

    return NextResponse.json({ ok: true, post: data });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message || 'Failed to save blog post' }, { status: 500 });
  }
}
