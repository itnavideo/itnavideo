import { NextRequest, NextResponse } from 'next/server';
import { insertLeadFromServer } from '@/services/supabase/siteStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = sanitizeEmail(body.email);
    const kind = sanitizeString(body.kind);

    if (!email) {
      return NextResponse.json({ error: 'email is required' }, { status: 400 });
    }

    if (kind === 'newsletter') {
      await insertLeadFromServer('newsletter', {
        email,
        source: sanitizeString(body.source) || 'footer_newsletter',
        active: true,
      });
    } else {
      await insertLeadFromServer('waitlist', {
        email,
        source: sanitizeString(body.source) || 'web_main',
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Lead insert failed:', error);
    return NextResponse.json(
      { error: 'Lead insert failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}

function sanitizeEmail(value: unknown) {
  const email = sanitizeString(value).toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : '';
}

function sanitizeString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}
