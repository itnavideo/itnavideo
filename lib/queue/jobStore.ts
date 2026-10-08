import { createClient } from '@supabase/supabase-js';

export interface ReelJobState {
  jobId: string;
  userId: string;
  mode: string;
  templateName: string;
  stage: 'queued' | 'extracting_audio' | 'transcribing' | 'directing_scenes' | 'dispatching_lambda' | 'rendering' | 'completed' | 'failed';
  stageMessage: string;
  progressPercent: number; // 0 to 100
  renderId?: string;
  bucketName?: string;
  outputUrl?: string;
  error?: string;
  payload?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error('Supabase URL or Key missing in environment.');
  }
  return createClient(url, key);
}

// In-memory fallback if Supabase credentials are unavailable
const memoryFallback = new Map<string, ReelJobState>();

export async function createJob(job: ReelJobState): Promise<void> {
  try {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from('reel_jobs').insert({
      job_id: job.jobId,
      user_id: job.userId,
      mode: job.mode,
      template_name: job.templateName,
      stage: job.stage,
      stage_message: job.stageMessage,
      progress_percent: job.progressPercent,
      payload: job.payload || {},
      created_at: job.createdAt || new Date().toISOString(),
      updated_at: job.updatedAt || new Date().toISOString(),
    });

    if (error) throw error;
  } catch (err) {
    console.warn('[JOB_STORE] Supabase write failed, using memory store fallback:', err);
    memoryFallback.set(job.jobId, job);
  }
}

export async function updateJobStage(
  jobId: string,
  update: Partial<ReelJobState>
): Promise<void> {
  try {
    const supabase = getSupabaseServerClient();
    const rowUpdate: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (update.stage !== undefined) rowUpdate.stage = update.stage;
    if (update.stageMessage !== undefined) rowUpdate.stage_message = update.stageMessage;
    if (update.progressPercent !== undefined) rowUpdate.progress_percent = update.progressPercent;
    if (update.renderId !== undefined) rowUpdate.render_id = update.renderId;
    if (update.bucketName !== undefined) rowUpdate.bucket_name = update.bucketName;
    if (update.outputUrl !== undefined) rowUpdate.output_url = update.outputUrl;
    if (update.error !== undefined) rowUpdate.error_message = update.error;

    const { error } = await supabase
      .from('reel_jobs')
      .update(rowUpdate)
      .eq('job_id', jobId);

    if (error) throw error;
  } catch (err) {
    console.warn('[JOB_STORE] Supabase update failed, updating memory store fallback:', err);
    const existing = memoryFallback.get(jobId);
    if (existing) {
      memoryFallback.set(jobId, { ...existing, ...update, updatedAt: new Date().toISOString() });
    }
  }
}

export async function getJob(jobId: string): Promise<ReelJobState | null> {
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from('reel_jobs')
      .select('*')
      .eq('job_id', jobId)
      .single();

    if (error || !data) throw error || new Error('Job not found');

    return {
      jobId: data.job_id,
      userId: data.user_id,
      mode: data.mode,
      templateName: data.template_name,
      stage: data.stage,
      stageMessage: data.stage_message,
      progressPercent: data.progress_percent,
      renderId: data.render_id,
      bucketName: data.bucket_name,
      outputUrl: data.output_url,
      error: data.error_message,
      payload: data.payload,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch {
    return memoryFallback.get(jobId) || null;
  }
}
