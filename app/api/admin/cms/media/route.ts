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

// GET — List Media Library Assets
export async function GET() {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ ok: true, media: [] });
  }

  try {
    const { data, error } = await supabase
      .from('cms_media')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ ok: true, media: data || [] });
  } catch (e: any) {
    return NextResponse.json({ ok: true, media: [], note: e.message }, { status: 200 });
  }
}

// POST — Add or Register New Media Asset
export async function POST(request: Request) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { filename, url, altText, caption, mimeType, sizeBytes } = body;

    if (!url) {
      return NextResponse.json({ ok: false, error: 'Media URL is required.' }, { status: 400 });
    }

    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ ok: false, error: 'Supabase not configured' }, { status: 503 });
    }

    const payload = {
      filename: filename || url.split('/').pop() || 'media_asset',
      url,
      alt_text: altText || '',
      caption: caption || '',
      mime_type: mimeType || 'image/png',
      size_bytes: sizeBytes || 0,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('cms_media')
      .insert(payload)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ ok: true, media: data });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message || 'Failed to save media asset' }, { status: 500 });
  }
}

