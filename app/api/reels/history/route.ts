import { NextRequest, NextResponse } from 'next/server';
import {
  deleteRenderHistoryFromServer,
  listRecentRenderHistoryFromServer,
  upsertRenderHistoryFromServer,
} from '@/services/supabase/siteStore';
import { recordRenderUsageFromServer } from '@/services/billing/renderAccess';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const userId = sanitizeString(request.nextUrl.searchParams.get('userId'));
    if (!userId) {
      return NextResponse.json({ ok: false, renders: [], error: 'userId is required' }, { status: 400 });
    }

    const renders = await listRecentRenderHistoryFromServer(userId, 12);
    return NextResponse.json({ ok: true, renders: renders.map(toClientRender) });
  } catch (error) {
    console.error('Render history read failed:', error);
    return NextResponse.json(
      { ok: false, renders: [], error: 'Could not load render history.' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userId = sanitizeString(body.userId);
    const renderId = sanitizeString(body.renderId);
    const saved = await upsertRenderHistoryFromServer({
      userId,
      renderId,
      bucketName: sanitizeString(body.bucketName),
      mode: normalizeMode(body.mode),
      design: sanitizeString(body.design),
      title: sanitizeString(body.title),
      outputFile: sanitizeString(body.outputFile),
      outputSizeInBytes: body.outputSizeInBytes,
      costs: body.costs,
      createdAt: body.createdAt,
      expiresAt: body.expiresAt,
    });
    let usageWarning = '';
    try {
      await recordRenderUsageFromServer({
        userId,
        renderId,
        createdAt: body.createdAt,
        mode: normalizeMode(body.mode),
        title: sanitizeString(body.title),
      });
    } catch (error) {
      usageWarning = error instanceof Error ? error.message : 'Could not record usage.';
      console.error('Render usage write failed:', error);
    }

    return NextResponse.json({ ok: true, render: toClientRender(saved), usageWarning: usageWarning || undefined });
  } catch (error) {
    console.error('Render history write failed:', error);
    return NextResponse.json(
      { ok: false, error: 'Could not save render history.' },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const userId = sanitizeString(body.userId || request.nextUrl.searchParams.get('userId'));
    const renderId = sanitizeString(body.renderId || request.nextUrl.searchParams.get('renderId'));

    if (!userId || !renderId) {
      return NextResponse.json({ ok: false, error: 'userId and renderId are required' }, { status: 400 });
    }

    await deleteRenderHistoryFromServer({ userId, renderId });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Render history delete failed:', error);
    return NextResponse.json(
      { ok: false, error: 'Could not delete render history.' },
      { status: 500 },
    );
  }
}

function toClientRender(value: unknown) {
  const item = value as Record<string, unknown>;
  return {
    id: String(item.render_id || ''),
    renderId: String(item.render_id || ''),
    bucketName: nullableString(item.bucket_name),
    mode: normalizeMode(item.mode),
    design: String(item.design || 'Auto from script'),
    title: String(item.title || 'Itnavideo reel'),
    outputFile: String(item.output_file || ''),
    outputSizeInBytes: typeof item.output_size_in_bytes === 'number' ? item.output_size_in_bytes : null,
    costs: item.costs || null,
    createdAt: String(item.created_at || ''),
    expiresAt: String(item.expires_at || ''),
  };
}

function sanitizeString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeMode(value: unknown) {
  const mode = sanitizeString(value);
  if (mode === 'notes' || mode === 'handwriting') return 'notes';
  if (mode === 'videoCaption' || mode === 'videocaption' || mode === 'caption' || mode === 'captions' || mode === 'subtitle') return 'videoCaption';
  return 'videoExplainer';
}

function nullableString(value: unknown) {
  const text = sanitizeString(value);
  return text || null;
}
