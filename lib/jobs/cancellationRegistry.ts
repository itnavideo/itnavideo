import fs from 'node:fs';
import path from 'node:path';

const inMemoryCancelled = new Set<string>();

const CACHE_FILE = path.join(process.cwd(), '.system_cache', 'cancelled_jobs.json');

function ensureCacheDir() {
  try {
    const dir = path.dirname(CACHE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  } catch {
    // Ignore in read-only environments
  }
}

function loadCancelledFromDisk() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const data = fs.readFileSync(CACHE_FILE, 'utf-8');
      const list = JSON.parse(data);
      if (Array.isArray(list)) {
        list.forEach((id) => {
          if (typeof id === 'string') inMemoryCancelled.add(id);
        });
      }
    }
  } catch {
    // Ignore read errors
  }
}

function saveCancelledToDisk() {
  try {
    ensureCacheDir();
    const list = Array.from(inMemoryCancelled).slice(-500); // keep last 500 cancelled jobs
    fs.writeFileSync(CACHE_FILE, JSON.stringify(list), 'utf-8');
  } catch {
    // Ignore write errors in read-only environments
  }
}

// Initial load
loadCancelledFromDisk();

export function cancelJob(renderId: string): void {
  const cleanId = String(renderId || '').trim();
  if (!cleanId) return;
  inMemoryCancelled.add(cleanId);
  saveCancelledToDisk();
}

export function isJobCancelled(renderId: string): boolean {
  const cleanId = String(renderId || '').trim();
  if (!cleanId) return false;
  if (inMemoryCancelled.has(cleanId)) return true;
  // Re-check disk cache once in case another worker process cancelled it
  loadCancelledFromDisk();
  return inMemoryCancelled.has(cleanId);
}

export { inMemoryCancelled as cancelledJobs };
