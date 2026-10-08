import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { getAppSettingFromServer, setAppSettingFromServer } from '@/services/supabase/siteStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const FREE_TIER_SETTING_KEY = 'free_tier_render_enabled';
const FREE_TIER_QUEUE_LIMIT = getPositiveNumber(process.env.FREE_TIER_QUEUE_LIMIT, 50);

export async function GET(request: NextRequest) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const status = await getFreeTierStatus();
  return NextResponse.json(status);
}

export async function POST(request: NextRequest) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const enabled = parseBooleanSetting(body?.enabled ?? body?.freeTierEnabled, true);
  const updatedBy = getUpdatedBy(request);

  await setAppSettingFromServer(FREE_TIER_SETTING_KEY, { enabled }, updatedBy);

  const status = await getFreeTierStatus();
  return NextResponse.json({
    ...status,
    message: enabled
      ? 'Free-tier rendering is open.'
      : 'Free-tier rendering is paused. Paid users can still render.',
  });
}

async function getFreeTierStatus() {
  const rawSetting = await getAppSettingFromServer<unknown>(
    FREE_TIER_SETTING_KEY,
    process.env.FREE_TIER_RENDER_ENABLED ?? true,
  );
  const enabled = parseBooleanSetting(rawSetting, true);
  const queue = { active: 0, pending: 0, maxParallel: 0, available: false };
  const queueSize = queue.active + queue.pending;
  const autoBlocked = queue.available && queueSize > FREE_TIER_QUEUE_LIMIT;

  return {
    key: FREE_TIER_SETTING_KEY,
    freeTierEnabled: enabled,
    queueLimit: FREE_TIER_QUEUE_LIMIT,
    autoBlocked,
    freeUsersCanRender: enabled && !autoBlocked,
    paidUsersCanRender: true,
    queue,
  };
}

async function isAuthorized(request: NextRequest) {
  const cookieStore = await cookies();
  if (cookieStore.get('admin_session')?.value === 'authenticated') return true;

  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '').trim();
  const adminSecret = process.env.ADMIN_API_KEY;
  return Boolean(token && adminSecret && token === adminSecret);
}

function getUpdatedBy(request: NextRequest) {
  return request.headers.get('x-admin-user') || 'admin';
}

function parseBooleanSetting(value: unknown, fallback: boolean) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value > 0;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['1', 'true', 'yes', 'on', 'enabled'].includes(normalized)) return true;
    if (['0', 'false', 'no', 'off', 'disabled'].includes(normalized)) return false;
  }
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const objectValue = value as Record<string, unknown>;
    if ('enabled' in objectValue) return parseBooleanSetting(objectValue.enabled, fallback);
    if ('freeTierEnabled' in objectValue) return parseBooleanSetting(objectValue.freeTierEnabled, fallback);
  }
  return fallback;
}

function getPositiveNumber(value: unknown, fallback: number) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : fallback;
}
