/**
 * Durable Client-Side Render Job Persistence & Tab Resumption
 * Protects renders against browser tab throttling, window minimization,
 * page reloads, and temporary network disconnections.
 */

export interface ActiveRenderJob {
  jobId?: string;
  renderId: string;
  bucketName?: string;
  title: string;
  mode: string;
  startedAt: number;
}

const STORAGE_PREFIX = 'itnavideo_active_render_job_';
const MAX_JOB_AGE_MS = 2 * 60 * 60 * 1000; // 2 hours

export function saveActiveRenderJob(job: ActiveRenderJob): void {
  if (typeof window === 'undefined') return;
  try {
    const key = `${STORAGE_PREFIX}${job.mode}`;
    localStorage.setItem(key, JSON.stringify(job));
    localStorage.setItem('itnavideo_last_active_render', JSON.stringify(job));
  } catch (err) {
    console.warn('[renderPersistence] Failed to save active render job:', err);
  }
}

export function getActiveRenderJob(mode: string): ActiveRenderJob | null {
  if (typeof window === 'undefined') return null;
  try {
    const key = `${STORAGE_PREFIX}${mode}`;
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed: ActiveRenderJob = JSON.parse(raw);
    if (!parsed || !parsed.renderId) return null;

    // Check expiration (ignore stale jobs older than 2 hours)
    if (Date.now() - (parsed.startedAt || 0) > MAX_JOB_AGE_MS) {
      clearActiveRenderJob(mode);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function clearActiveRenderJob(mode: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}${mode}`);
  } catch (err) {
    console.warn('[renderPersistence] Failed to clear active render job:', err);
  }
}

/**
 * Attaches visibility and focus listeners so when a user returns to a throttled
 * or suspended background tab, an immediate status poll fires with zero delay.
 */
export function attachVisibilityResumption(onFocusOrVisible: () => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleVisibility = () => {
    if (document.visibilityState === 'visible') {
      onFocusOrVisible();
    }
  };

  const handleFocus = () => {
    onFocusOrVisible();
  };

  document.addEventListener('visibilitychange', handleVisibility);
  window.addEventListener('focus', handleFocus);

  return () => {
    document.removeEventListener('visibilitychange', handleVisibility);
    window.removeEventListener('focus', handleFocus);
  };
}

