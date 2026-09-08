type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  retryAfterSeconds: number;
};

type Bucket = {
  count: number;
  resetAt: number;
};

const store = getGlobalStore();

export function checkRateLimit({
  key,
  limit,
  windowMs,
  now = Date.now(),
}: {
  key: string;
  limit: number;
  windowMs: number;
  now?: number;
}): RateLimitResult {
  const safeLimit = Math.max(1, Math.floor(Number(limit) || 1));
  const safeWindowMs = Math.max(1000, Math.floor(Number(windowMs) || 1000));
  const safeKey = String(key || 'anonymous').slice(0, 240);
  cleanupExpiredBuckets(now);

  const existing = store.get(safeKey);
  const bucket: Bucket = existing && existing.resetAt > now
    ? existing
    : { count: 0, resetAt: now + safeWindowMs };

  bucket.count += 1;
  store.set(safeKey, bucket);

  const remaining = Math.max(0, safeLimit - bucket.count);
  const retryAfterSeconds = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));

  return {
    allowed: bucket.count <= safeLimit,
    limit: safeLimit,
    remaining,
    resetAt: bucket.resetAt,
    retryAfterSeconds,
  };
}

export function getClientIp(headers: Headers) {
  const forwarded = headers.get('x-forwarded-for') || '';
  const realIp = headers.get('x-real-ip') || '';
  return (forwarded.split(',')[0] || realIp || 'unknown').trim().slice(0, 80);
}

function cleanupExpiredBuckets(now: number) {
  if (store.size < 2000) return;
  for (const [key, bucket] of store.entries()) {
    if (bucket.resetAt <= now) store.delete(key);
  }
}

function getGlobalStore(): Map<string, Bucket> {
  const globalKey = '__itnavideoRateLimitStore';
  const globalWithStore = globalThis as typeof globalThis & { [globalKey]?: Map<string, Bucket> };
  if (!globalWithStore[globalKey]) globalWithStore[globalKey] = new Map();
  return globalWithStore[globalKey];
}
