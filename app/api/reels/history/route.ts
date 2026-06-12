import { NextRequest, NextResponse } from 'next/server';
import {
  deleteRenderHistoryFromServer,
  listRecentRenderHistoryFromServer,
  upsertRenderHistoryFromServer,
} from '@/services/supabase/siteStore';
import { recordRenderUsageFromServer } from '@/services/billing/renderAccess';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const RENDER_RETENTION_HOURS = 48;
const RENDER_RETENTION_MS = RENDER_RETENTION_HOURS * 60 * 60 * 1000;

export async function GET(request: NextRequest) {
  try {
    const userId = sanitizeString(request.nextUrl.searchParams.get('userId'));
    if (!userId) {
      return NextResponse.json({ ok: false, renders: [], error: 'userId is required' }, { status: 400 });
    }

    const renders = await listRecentRenderHistoryFromServer(userId, 24);
    const now = Date.now();

    return NextResponse.json({
      ok: true,
      renders: renders
        .map(toClientRender)
        .filter((item) => Date.parse(item.expiresAt || '') > now),
    });
  } catch (error) {
    console.error('Render history read failed:', error);

    if (isMissingRenderHistoryTable(error)) {
      return NextResponse.json({
        ok: true,
        renders: [],
        warning: 'Render history table is not configured yet. Browser local history will be used.',
      });
    }

    return NextResponse.json(
      { ok: false, renders: [], error: 'Could not load render history.' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown> = {};

  try {
    body = await request.json();

    const userId = sanitizeString(body.userId);
    const renderId = sanitizeString(body.renderId);

    if (!userId || !renderId) {
      return NextResponse.json({ ok: false, error: 'userId and renderId are required' }, { status: 400 });
    }

    const expiresAt =
      sanitizeString(body.expiresAt) ||
      new Date(Date.now() + RENDER_RETENTION_MS).toISOString();

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
      createdAt: sanitizeString(body.createdAt) || new Date().toISOString(),
      expiresAt,
    });

    let usageWarning = '';
    try {
      await recordRenderUsageFromServer({
        userId,
        renderId,
        createdAt: sanitizeString(body.createdAt) || new Date().toISOString(),
        mode: normalizeMode(body.mode),
        title: sanitizeString(body.title),
      });
    } catch (error) {
      usageWarning = error instanceof Error ? error.message : 'Could not record usage.';
      console.error('Render usage write failed:', error);
    }

    return NextResponse.json({
      ok: true,
      render: toClientRender(saved),
      usageWarning: usageWarning || undefined,
    });
  } catch (error) {
    console.error('Render history write failed:', error);

    if (isMissingRenderHistoryTable(error)) {
      return NextResponse.json({
        ok: true,
        render: fallbackClientRenderFromBody(body),
        warning: 'Render history table is not configured yet. Saved locally only.',
      });
    }

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

    if (isMissingRenderHistoryTable(error)) {
      return NextResponse.json({ ok: true, warning: 'Render history table is not configured yet.' });
    }

    return NextResponse.json(
      { ok: false, error: 'Could not delete render history.' },
      { status: 500 },
    );
  }
}

function fallbackClientRenderFromBody(body: Record<string, unknown>) {
  const renderId = sanitizeString(body.renderId);
  const now = new Date();
  const expiresAt =
    sanitizeString(body.expiresAt) ||
    new Date(Date.now() + RENDER_RETENTION_MS).toISOString();

  return {
    id: renderId,
    renderId,
    bucketName: nullableString(body.bucketName),
    mode: normalizeMode(body.mode),
    design: sanitizeString(body.design) || 'Auto from script',
    title: sanitizeString(body.title) || 'Itnavideo reel',
    outputFile: sanitizeString(body.outputFile),
    outputSizeInBytes: typeof body.outputSizeInBytes === 'number' ? body.outputSizeInBytes : null,
    costs: body.costs || null,
    createdAt: sanitizeString(body.createdAt) || now.toISOString(),
    expiresAt,
  };
}

function toClientRender(value: unknown) {
  const item = value as Record<string, unknown>;
  const expiresAt =
    String(item.expires_at || '') ||
    new Date(Date.now() + RENDER_RETENTION_MS).toISOString();

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
    expiresAt,
  };
}

function isMissingRenderHistoryTable(error: unknown) {
  const message = error instanceof Error ? error.message : String(error || '');
  return (
    message.includes('public.render_history') ||
    message.includes('schema cache') ||
    message.includes('Could not find the table') ||
    message.includes('render_history')
  );
}

function sanitizeString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeMode(value: unknown) {
  const mode = sanitizeString(value);
  if (mode === 'notes' || mode === 'handwriting') return 'notes';
  if (mode === 'videoCaption' || mode === 'videocaption' || mode === 'caption' || mode === 'captions' || mode === 'subtitle') return 'videoCaption';
  if (mode === 'compare' || mode === 'comparison' || mode === 'vs') return 'compare';
  if (mode === 'imageStory' || mode === 'imagestory' || mode === 'image' || mode === 'photo') return 'imageStory';
  return 'videoExplainer';
}

function nullableString(value: unknown) {
  const text = sanitizeString(value);
  return text || null;
}
