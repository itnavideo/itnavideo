import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import {
  deleteExpiredProjectRecordsFromServer,
  listExpiredRenderedProjectsFromServer,
} from '@/services/supabase/projectStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const RENDER_RETENTION_MS = 2 * 60 * 60 * 1000;

export async function GET(request: NextRequest) {
  return runCleanup(request);
}

export async function POST(request: NextRequest) {
  return runCleanup(request);
}

async function runCleanup(request: NextRequest) {
  try {
    const authResponse = authorizeCleanup(request);
    if (authResponse) return authResponse;

    const limit = clampNumber(Number(request.nextUrl.searchParams.get('limit') || 50), 1, 100);
    const expiredProjects = await listExpiredRenderedProjectsFromServer(RENDER_RETENTION_MS, limit);
    const cloudinaryResults = await deleteCloudinaryRenders(expiredProjects);
    const deletedIds = expiredProjects
      .filter((project) => cloudinaryResults.deletedProjectIds.has(project.id))
      .map((project) => project.id);
    const dbResults = await deleteExpiredProjectRecordsFromServer(deletedIds);

    return NextResponse.json({
      success: true,
      scanned: expiredProjects.length,
      cloudinaryDeleted: cloudinaryResults.deleted,
      cloudinarySkipped: cloudinaryResults.skipped,
      cloudinaryFailed: cloudinaryResults.failed,
      ...dbResults,
    });
  } catch (error: any) {
    console.error('Expired render cleanup failed:', error);
    return NextResponse.json(
      { success: false, error: 'Expired render cleanup failed', details: error.message || 'Unknown error' },
      { status: 500 },
    );
  }
}

function authorizeCleanup(request: NextRequest) {
  const secret = process.env.CRON_SECRET || process.env.RENDER_WORKER_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'Cleanup secret is not configured.' }, { status: 503 });
  }

  const header = request.headers.get('authorization') || '';
  const querySecret = request.nextUrl.searchParams.get('secret') || '';
  if (header === `Bearer ${secret}` || querySecret === secret) return null;

  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

async function deleteCloudinaryRenders(projects: Array<{ id: string; videoUrl?: string; renderUrl?: string }>) {
  const deletedProjectIds = new Set<string>();
  let deleted = 0;
  let failed = 0;
  let skipped = 0;

  for (const project of projects) {
    const publicId = getCloudinaryPublicId(project.videoUrl || project.renderUrl || '');
    if (!publicId) {
      skipped += 1;
      continue;
    }

    const result = await destroyCloudinaryVideo(publicId).catch((error) => {
      console.warn(`Cloudinary destroy failed for ${publicId}:`, error);
      return null;
    });

    if (result?.result === 'ok' || result?.result === 'not found') {
      deletedProjectIds.add(project.id);
      deleted += result.result === 'ok' ? 1 : 0;
      continue;
    }

    failed += 1;
  }

  return { deletedProjectIds, deleted, failed, skipped };
}

async function destroyCloudinaryVideo(publicId: string) {
  const config = getCloudinaryConfig();
  if (!config) throw new Error('Cloudinary environment variables are missing.');

  const timestamp = Math.round(Date.now() / 1000);
  const signature = signCloudinaryParams({ public_id: publicId, timestamp }, config.apiSecret);
  const formData = new FormData();
  formData.append('api_key', config.apiKey);
  formData.append('timestamp', String(timestamp));
  formData.append('public_id', publicId);
  formData.append('signature', signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${config.cloudName}/video/destroy`, {
    method: 'POST',
    body: formData,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error?.message || `Cloudinary destroy failed: ${response.status}`);
  }
  return data as { result?: string };
}

function getCloudinaryPublicId(url: string) {
  if (!url) return '';

  try {
    const pathname = new URL(url).pathname;
    const marker = '/upload/';
    const markerIndex = pathname.indexOf(marker);
    if (markerIndex < 0) return '';

    const afterUpload = pathname.slice(markerIndex + marker.length);
    const withoutVersion = afterUpload.replace(/^v\d+\//, '');
    return withoutVersion.replace(/\.[a-z0-9]+$/i, '');
  } catch {
    return '';
  }
}

function getCloudinaryConfig() {
  const cloudName = cleanEnv(process.env.CLOUDINARY_CLOUD_NAME);
  const apiKey = cleanEnv(process.env.CLOUDINARY_API_KEY);
  const apiSecret = cleanEnv(process.env.CLOUDINARY_API_SECRET);
  if (!cloudName || !apiKey || !apiSecret) return null;
  return { cloudName, apiKey, apiSecret };
}

function signCloudinaryParams(params: Record<string, string | number>, apiSecret: string) {
  const payload = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&');
  return crypto.createHash('sha1').update(payload + apiSecret).digest('hex');
}

function cleanEnv(value: unknown) {
  return String(value || '').trim().replace(/^['"]|['"]$/g, '');
}

function clampNumber(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, Math.round(value)));
}
