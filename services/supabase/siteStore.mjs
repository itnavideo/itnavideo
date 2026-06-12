import { createClient } from '@supabase/supabase-js';

let serverClient = null;

export function canWriteSupabaseFromServer() {
  return Boolean(getSupabaseUrl() && getSupabaseServiceKey());
}

export async function insertLeadFromServer(tableName, data) {
  if (!['waitlist', 'newsletter'].includes(tableName)) {
    throw new Error('Unsupported lead table.');
  }

  const email = String(data?.email || '').trim().toLowerCase();
  if (!email) throw new Error('Email is required.');

  const supabase = getSupabaseServerClient();
  const row = {
    email,
    source: String(data?.source || 'website').slice(0, 80),
  };

  const { error } = await supabase.from(tableName).insert(row);
  if (error && !isDuplicateError(error)) {
    throw new Error(`Supabase lead insert failed: ${error.message}`);
  }
}

export async function insertJobApplicationFromServer(data) {
  const supabase = getSupabaseServerClient();
  const { data: result, error } = await supabase
    .from('job_applications')
    .insert({
      name: String(data?.name || '').trim(),
      email: String(data?.email || '').trim().toLowerCase(),
      role_slug: String(data?.roleSlug || '').trim(),
      role_title: String(data?.roleTitle || '').trim(),
      linkedin_url: nullableString(data?.linkedinUrl),
      resume_url: nullableString(data?.resumeUrl),
      portfolio_url: nullableString(data?.portfolioUrl),
      note: nullableString(data?.note),
      source: nullableString(data?.source),
    })
    .select()
    .single();

  if (error) throw new Error(`Supabase application insert failed: ${error.message}`);
  return result;
}

export async function getAppSettingFromServer(key, fallbackValue = null) {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('app_settings')
    .select('value')
    .eq('key', key)
    .maybeSingle();

  if (error) {
    console.warn(`Supabase app setting read failed: ${error.message}`);
    return fallbackValue;
  }

  return data?.value ?? fallbackValue;
}

export async function setAppSettingFromServer(key, value, updatedBy = 'system') {
  const now = new Date().toISOString();
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('app_settings')
    .upsert({
      key,
      value,
      updated_by: updatedBy,
      updated_at: now,
    }, { onConflict: 'key' })
    .select()
    .single();

  if (error) throw new Error(`Supabase app setting write failed: ${error.message}`);
  return data;
}

export async function listRecentRenderHistoryFromServer(userId, limit = 12) {
  const cleanUserId = String(userId || '').trim();
  if (!cleanUserId) throw new Error('User id is required.');

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('render_history')
    .select('render_id,bucket_name,mode,design,title,output_file,output_size_in_bytes,costs,created_at,expires_at')
    .eq('user_id', cleanUserId)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(Math.min(Math.max(Number(limit) || 12, 1), 48));

  if (error) throw new Error(`Supabase render history read failed: ${error.message}`);
  return data || [];
}

export async function countRenderHistoryInWindowFromServer(userId, startAt, endAt) {
  const cleanUserId = String(userId || '').trim();
  if (!cleanUserId) throw new Error('User id is required.');

  const start = parseDate(startAt);
  const end = parseDate(endAt);
  if (!start || !end) return 0;

  const supabase = getSupabaseServerClient();
  const { count, error } = await supabase
    .from('render_history')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', cleanUserId)
    .gte('created_at', start.toISOString())
    .lte('created_at', end.toISOString());

  if (error) throw new Error(`Supabase render history count failed: ${error.message}`);
  return count || 0;
}

export async function upsertRenderHistoryFromServer(data) {
  const userId = String(data?.userId || '').trim();
  const renderId = String(data?.renderId || '').trim();
  const outputFile = String(data?.outputFile || '').trim();
  const rawMode = String(data?.mode || '').trim();
  const mode = rawMode === 'handwriting'
    ? 'notes'
    : rawMode === 'facecam'
      ? 'videoExplainer'
      : ['caption', 'captions', 'subtitle', 'videoCaption', 'videocaption'].includes(rawMode)
        ? 'videoCaption'
      : rawMode;

  if (!userId) throw new Error('User id is required.');
  if (!renderId) throw new Error('Render id is required.');
  if (!outputFile) throw new Error('Output file is required.');
  if (!['videoExplainer', 'notes', 'videoCaption', 'compare'].includes(mode)) throw new Error('Render mode is invalid.');

  const now = new Date();
  const createdAt = parseDate(data?.createdAt) || now;
  const expiresAt = parseDate(data?.expiresAt) || new Date(createdAt.getTime() + 48 * 60 * 60 * 1000);
  const supabase = getSupabaseServerClient();
  const row = {
    user_id: userId,
    render_id: renderId,
    bucket_name: nullableString(data?.bucketName),
    mode,
    design: nullableString(data?.design),
    title: String(data?.title || 'Itnavideo reel').trim().slice(0, 120),
    output_file: outputFile,
    output_size_in_bytes: toNullableInteger(data?.outputSizeInBytes),
    costs: data?.costs && typeof data.costs === 'object' ? data.costs : null,
    created_at: createdAt.toISOString(),
    expires_at: expiresAt.toISOString(),
  };

  const { data: result, error } = await supabase
    .from('render_history')
    .upsert(row, { onConflict: 'user_id,render_id' })
    .select()
    .single();

  if (error) throw new Error(`Supabase render history write failed: ${error.message}`);
  return result;
}

export async function deleteRenderHistoryFromServer(data) {
  const userId = String(data?.userId || '').trim();
  const renderId = String(data?.renderId || '').trim();

  if (!userId) throw new Error('User id is required.');
  if (!renderId) throw new Error('Render id is required.');

  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from('render_history')
    .delete()
    .eq('user_id', userId)
    .eq('render_id', renderId);

  if (error) throw new Error(`Supabase render history delete failed: ${error.message}`);
  return { userId, renderId };
}

function getSupabaseServerClient() {
  if (serverClient) return serverClient;

  const url = getSupabaseUrl();
  const key = getSupabaseServiceKey();
  if (!url || !key) {
    throw new Error('Supabase service credentials are not configured.');
  }

  serverClient = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return serverClient;
}

function getSupabaseUrl() {
  return cleanEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL);
}

function getSupabaseServiceKey() {
  return cleanEnvValue(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || process.env.SECRET_KEY);
}

function cleanEnvValue(value) {
  return String(value || '').trim().replace(/^['"]|['"]$/g, '');
}

function nullableString(value) {
  const text = String(value || '').trim();
  return text || null;
}

function toNullableInteger(value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) return null;
  return Math.round(number);
}

function parseDate(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value === 'number' && Number.isFinite(value)) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  if (typeof value === 'string' && value.trim()) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  return null;
}

function isDuplicateError(error) {
  return String(error?.code || '') === '23505';
}

