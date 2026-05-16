export type FfmpegJobStatus = 'queued' | 'uploading' | 'processing' | 'rendering' | 'ready' | 'error';

export type FfmpegJobRecord = {
  jobId: string;
  userId: string;
  status: FfmpegJobStatus; // Current status of the job
  progress: number; // Percentage progress (0-100)
  message: string; // User-friendly message about current status
  videoUrl?: string;
  error?: string;
  createdAt: string;
  updatedAt: string;
};

import {
  cleanupOldJobs as cleanupOldJobsFromStore,
  getFfmpegJob as getFfmpegJobFromStore,
  isFfmpegJobStoreConfigured,
  upsertFfmpegJob as upsertFfmpegJobInStore,
} from './ffmpegJobStore.mjs';

export { isFfmpegJobStoreConfigured };

export async function getFfmpegJob(userId: string, jobId: string): Promise<FfmpegJobRecord | null> {
  return getFfmpegJobFromStore(userId, jobId) as Promise<FfmpegJobRecord | null>;
}

export async function cleanupOldJobs(maxAgeMs: number): Promise<{ deleted: number }> {
  return cleanupOldJobsFromStore(maxAgeMs) as Promise<{ deleted: number }>;
}

export async function upsertFfmpegJob(input: {
  userId: string;
  jobId: string;
  status: FfmpegJobStatus;
  progress: number;
  message: string;
  videoUrl?: string;
  error?: string;
}): Promise<FfmpegJobRecord> {
  return upsertFfmpegJobInStore(input) as Promise<FfmpegJobRecord>;
}
