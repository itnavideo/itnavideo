import {
  cleanupOldFfmpegJobsFromServer,
  getFfmpegJobFromServer,
  upsertFfmpegJobFromServer,
} from '../supabase/projectStore.mjs';

export function isFfmpegJobStoreConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || process.env.SECRET_KEY));
}

export async function getFfmpegJob(userId, jobId) {
  if (!userId || !jobId) return null;

  try {
    return await getFfmpegJobFromServer(userId, jobId);
  } catch (error) {
    console.error(`[JobStore] Failed to read job ${jobId}:`, error);
    return null;
  }
}

export async function upsertFfmpegJob(input) {
  try {
    return await upsertFfmpegJobFromServer(input);
  } catch (error) {
    console.error(`[JobStore] Upsert failed for ${input.jobId}:`, error);
    throw error;
  }
}

export async function cleanupOldJobs(maxAgeMs) {
  return cleanupOldFfmpegJobsFromServer(maxAgeMs);
}
