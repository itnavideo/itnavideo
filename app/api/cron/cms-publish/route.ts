import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function GET(request: Request) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: 'Supabase not configured' }, { status: 503 });
  }

  const now = new Date().toISOString();

  try {
    // 1. Publish due blog posts
    const { data: duePosts, error: postErr } = await supabase
      .from('blog_posts')
      .update({
        status: 'published',
        published_at: now,
        updated_at: now,
      })
      .eq('status', 'scheduled')
      .lte('scheduled_at', now)
      .select('id, title, slug');

    if (postErr) console.error('[CRON-CMS] Error publishing posts:', postErr);

    // 2. Publish due pages
    const { data: duePages, error: pageErr } = await supabase
      .from('pages')
      .update({
        status: 'published',
        published_at: now,
        updated_at: now,
      })
      .eq('status', 'scheduled')
      .lte('scheduled_at', now)
      .select('id, title, slug');

    if (pageErr) console.error('[CRON-CMS] Error publishing pages:', pageErr);

    return NextResponse.json({
      ok: true,
      timestamp: now,
      publishedPosts: duePosts || [],
      publishedPages: duePages || [],
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message || 'CMS Cron failed' }, { status: 500 });
  }
}

