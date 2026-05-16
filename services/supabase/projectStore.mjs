import { createClient } from '@supabase/supabase-js';

const PROJECT_COLUMNS = {
  id: 'id',
  ownerId: 'owner_id',
  title: 'title',
  status: 'status',
  progress: 'progress',
  style: 'style',
  quality: 'quality',
  voiceUrl: 'voice_url',
  voiceoverUrl: 'voiceover_url',
  visualUrl: 'visual_url',
  videoUrl: 'video_url',
  renderUrl: 'render_url',
  renderProvider: 'render_provider',
  timelineScenes: 'timeline_scenes',
  captions: 'captions',
  durationSeconds: 'duration_seconds',
  userAssets: 'user_assets',
  timeline: 'timeline',
  error: 'error',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  completedAt: 'completed_at',
};

const DEFAULT_RENDER_RETENTION_MS = 2 * 60 * 60 * 1000;

let serverClient = null;

export function canWriteSupabaseFromServer() {
  return Boolean(getSupabaseUrl() && getSupabaseServiceKey());
}

export async function listUserProjectsFromServer(userId) {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('owner_id', userId)
    .order('created_at', { ascending: false });

  if (isMissingTableError(error)) {
    console.warn(`Supabase projects table is missing. Returning empty project list until schema.sql is applied: ${error.message}`);
    return [];
  }

  if (error) throw new Error(`Supabase project list failed: ${error.message}`);
  return (data || []).map(fromProjectRow).filter((project) => !isExpiredRenderedProject(project));
}

export async function upsertUserProjectFromServer(userId, projectId, data = {}) {
  if (!userId || !projectId) {
    throw new Error('userId and projectId are required.');
  }

  const now = new Date().toISOString();
  const row = toProjectRow({
    ...data,
    id: projectId,
    ownerId: userId,
    updatedAt: data.updatedAt || now,
  });

  if (!row.created_at && data.createdAt) row.created_at = normalizeTimestamp(data.createdAt);
  if (!row.created_at && data.status === 'Queued') row.created_at = now;

  const supabase = getSupabaseServerClient();
  const { data: result, error } = await supabase
    .from('projects')
    .upsert(row, { onConflict: 'id' })
    .select()
    .single();

  if (isMissingTableError(error)) {
    throw new Error(`Supabase projects table is missing. Apply supabase/schema.sql before starting render jobs: ${error.message}`);
  }

  if (error) throw new Error(`Supabase project upsert failed: ${error.message}`);
  return fromProjectRow(result);
}

export async function deleteUserProjectFromServer(userId, projectId) {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId)
    .eq('owner_id', userId);

  if (isMissingTableError(error)) {
    console.warn(`Supabase projects table is missing. Treating delete as no-op until schema.sql is applied: ${error.message}`);
    return;
  }

  if (error) throw new Error(`Supabase project delete failed: ${error.message}`);
}

export async function getFfmpegJobFromServer(userId, jobId) {
  if (!userId || !jobId) return null;

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('ffmpeg_jobs')
    .select('*')
    .eq('id', getJobDocumentId(userId, jobId))
    .maybeSingle();

  if (isMissingTableError(error)) {
    throw new Error(`Supabase ffmpeg_jobs table is missing. Apply supabase/schema.sql before checking render status: ${error.message}`);
  }

  if (error) throw new Error(`Supabase FFmpeg job read failed: ${error.message}`);
  return data ? fromFfmpegJobRow(data) : null;
}

export async function upsertFfmpegJobFromServer(input) {
  const existing = await getFfmpegJobFromServer(input.userId, input.jobId).catch(() => null);
  const now = new Date().toISOString();
  const row = {
    id: getJobDocumentId(input.userId, input.jobId),
    job_id: input.jobId,
    user_id: input.userId,
    status: input.status,
    progress: clampProgress(input.progress),
    message: input.message,
    video_url: input.videoUrl || existing?.videoUrl || null,
    error: input.error || null,
    created_at: existing?.createdAt || now,
    updated_at: now,
  };

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('ffmpeg_jobs')
    .upsert(row, { onConflict: 'id' })
    .select()
    .single();

  if (isMissingTableError(error)) {
    throw new Error(`Supabase ffmpeg_jobs table is missing. Apply supabase/schema.sql before starting render jobs: ${error.message}`);
  }

  if (error) throw new Error(`Supabase FFmpeg job upsert failed: ${error.message}`);
  return fromFfmpegJobRow(data);
}

export async function cleanupOldFfmpegJobsFromServer(maxAgeMs) {
  const cutoff = new Date(Date.now() - Math.max(0, Number(maxAgeMs) || 0)).toISOString();
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('ffmpeg_jobs')
    .delete()
    .lt('updated_at', cutoff)
    .select('id');

  if (isMissingTableError(error)) {
    console.warn(`Supabase ffmpeg_jobs table is missing. Skipping cleanup until schema.sql is applied: ${error.message}`);
    return { deleted: 0 };
  }

  if (error) throw new Error(`Supabase FFmpeg job cleanup failed: ${error.message}`);
  return { deleted: data?.length || 0 };
}

export async function listExpiredRenderedProjectsFromServer(maxAgeMs = DEFAULT_RENDER_RETENTION_MS, limit = 50) {
  const cutoff = new Date(Date.now() - Math.max(0, Number(maxAgeMs) || DEFAULT_RENDER_RETENTION_MS)).toISOString();
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('projects')
    .select('id, owner_id, title, video_url, render_url, created_at, completed_at')
    .not('completed_at', 'is', null)
    .lt('completed_at', cutoff)
    .limit(Math.max(1, Math.min(200, Number(limit) || 50)));

  if (isMissingTableError(error)) {
    console.warn(`Supabase projects table is missing. Skipping expired render lookup: ${error.message}`);
    return [];
  }

  if (error) throw new Error(`Supabase expired project lookup failed: ${error.message}`);
  return (data || []).map(fromProjectRow);
}

export async function deleteExpiredProjectRecordsFromServer(projectIds = []) {
  const ids = [...new Set((projectIds || []).map((id) => String(id || '').trim()).filter(Boolean))];
  if (!ids.length) return { projectsDeleted: 0, jobsDeleted: 0 };

  const supabase = getSupabaseServerClient();
  const jobs = await supabase
    .from('ffmpeg_jobs')
    .delete()
    .in('job_id', ids)
    .select('id');

  if (jobs.error && !isMissingTableError(jobs.error)) {
    throw new Error(`Supabase expired job cleanup failed: ${jobs.error.message}`);
  }

  const projects = await supabase
    .from('projects')
    .delete()
    .in('id', ids)
    .select('id');

  if (projects.error && !isMissingTableError(projects.error)) {
    throw new Error(`Supabase expired project cleanup failed: ${projects.error.message}`);
  }

  return {
    projectsDeleted: projects.data?.length || 0,
    jobsDeleted: jobs.data?.length || 0,
  };
}

export async function insertLeadFromServer(tableName, data) {
  const allowedTables = new Set(['waitlist', 'newsletter']);
  if (!allowedTables.has(tableName)) throw new Error('Unsupported lead table.');

  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from(tableName).insert({
    ...data,
    created_at: new Date().toISOString(),
  });

  if (error) throw new Error(`Supabase ${tableName} insert failed: ${error.message}`);
}

export async function insertJobApplicationFromServer(data) {
  const supabase = getSupabaseServerClient();
  const { data: result, error } = await supabase
    .from('job_applications')
    .insert({
      name: data.name,
      email: data.email,
      role_slug: data.roleSlug,
      role_title: data.roleTitle,
      linkedin_url: data.linkedinUrl || null,
      resume_url: data.resumeUrl || null,
      portfolio_url: data.portfolioUrl || null,
      note: data.note || null,
      source: data.source || 'careers_page',
      status: 'received',
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (isMissingTableError(error)) {
    throw new Error(`Supabase job_applications table is missing. Apply supabase/schema.sql before collecting applications: ${error.message}`);
  }

  if (error) throw new Error(`Supabase job application insert failed: ${error.message}`);
  return result;
}

export async function getAppSettingFromServer(key, fallbackValue = null) {
  if (!key) return fallbackValue;

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('app_settings')
    .select('value')
    .eq('key', key)
    .maybeSingle();

  if (isMissingTableError(error)) {
    console.warn(`Supabase app_settings table is missing. Using fallback for ${key}: ${error.message}`);
    return fallbackValue;
  }

  if (error) throw new Error(`Supabase app setting read failed: ${error.message}`);
  return data?.value ?? fallbackValue;
}

export async function setAppSettingFromServer(key, value, updatedBy = 'system') {
  if (!key) throw new Error('Setting key is required.');

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('app_settings')
    .upsert({
      key,
      value,
      updated_by: updatedBy,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'key' })
    .select()
    .single();

  if (isMissingTableError(error)) {
    throw new Error(`Supabase app_settings table is missing. Apply supabase/schema.sql before using admin toggles: ${error.message}`);
  }

  if (error) throw new Error(`Supabase app setting write failed: ${error.message}`);
  return data;
}

function getSupabaseServerClient() {
  if (serverClient) return serverClient;

  const supabaseUrl = getSupabaseUrl();
  const serviceKey = getSupabaseServiceKey();
  if (!supabaseUrl || !serviceKey) {
    throw new Error('Supabase server environment variables are missing. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SECRET_KEY.');
  }

  serverClient = createClient(supabaseUrl, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return serverClient;
}

function toProjectRow(data) {
  const row = {};

  for (const [from, to] of Object.entries(PROJECT_COLUMNS)) {
    if (data[from] === undefined) continue;
    row[to] = isTimestampColumn(to) ? normalizeTimestamp(data[from]) : data[from];
  }

  if (data.owner_id && !row.owner_id) row.owner_id = data.owner_id;
  if (data.video_url && !row.video_url) row.video_url = data.video_url;
  return row;
}

function fromProjectRow(row = {}) {
  return {
    id: row.id,
    ownerId: row.owner_id,
    title: row.title,
    status: row.status,
    progress: row.progress,
    style: row.style,
    quality: row.quality,
    voiceUrl: row.voice_url,
    voiceoverUrl: row.voiceover_url,
    visualUrl: row.visual_url,
    videoUrl: row.video_url,
    renderUrl: row.render_url,
    renderProvider: row.render_provider,
    timelineScenes: row.timeline_scenes,
    captions: row.captions,
    durationSeconds: row.duration_seconds,
    userAssets: row.user_assets,
    timeline: row.timeline,
    error: row.error,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    completedAt: row.completed_at,
    expiresAt: getRenderExpiresAt(row),
  };
}

function fromFfmpegJobRow(row = {}) {
  return {
    jobId: row.job_id,
    userId: row.user_id,
    status: row.status,
    progress: row.progress,
    message: row.message,
    videoUrl: row.video_url || undefined,
    error: row.error || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function getJobDocumentId(userId, jobId) {
  return `${userId}_${jobId}`;
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

function isMissingTableError(error) {
  if (!error) return false;
  const message = String(error.message || '').toLowerCase();
  const code = String(error.code || '');

  return code === '42P01'
    || message.includes('could not find the table')
    || message.includes('schema cache')
    || message.includes('relation') && message.includes('does not exist');
}

function normalizeTimestamp(value) {
  if (!value) return null;
  if (typeof value === 'string') return value;
  if (value instanceof Date) return value.toISOString();
  if (typeof value?.toDate === 'function') return value.toDate().toISOString();
  return String(value);
}

function isTimestampColumn(column) {
  return column === 'created_at' || column === 'updated_at' || column === 'completed_at';
}

function clampProgress(progress) {
  return Math.max(0, Math.min(100, Math.round(Number(progress) || 0)));
}

function getRenderExpiresAt(row = {}, maxAgeMs = DEFAULT_RENDER_RETENTION_MS) {
  if (!row.video_url && !row.render_url) return undefined;
  const base = row.completed_at || row.created_at;
  const baseMs = Date.parse(base || '');
  if (!Number.isFinite(baseMs)) return undefined;
  return new Date(baseMs + maxAgeMs).toISOString();
}

function isExpiredRenderedProject(project) {
  if (!project?.videoUrl && !project?.renderUrl) return false;
  const expiresAtMs = Date.parse(project.expiresAt || '');
  return Number.isFinite(expiresAtMs) && expiresAtMs <= Date.now();
}
