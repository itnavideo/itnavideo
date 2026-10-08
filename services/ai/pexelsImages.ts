type PexelsPhoto = {
  imageUrl: string;
  photographer: string;
  photographerUrl: string;
  sourceUrl: string;
};

export type PexelsSceneQuery = {
  sceneNumber: number;
  query: string;
};

function parsePexelsPhoto(value: unknown): PexelsPhoto | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const photo = value as Record<string, unknown>;
  const source = photo.src && typeof photo.src === 'object' && !Array.isArray(photo.src)
    ? photo.src as Record<string, unknown>
    : {};
  const imageUrl = [source.large2x, source.large, source.original].find(
    (candidate): candidate is string => typeof candidate === 'string' && candidate.startsWith('https://'),
  );
  if (!imageUrl) return null;

  return {
    imageUrl,
    photographer: typeof photo.photographer === 'string' ? photo.photographer : 'Pexels contributor',
    photographerUrl: typeof photo.photographer_url === 'string' ? photo.photographer_url : 'https://www.pexels.com',
    sourceUrl: typeof photo.url === 'string' ? photo.url : 'https://www.pexels.com',
  };
}

async function searchPexelsPhoto(query: string, orientation: 'landscape' | 'portrait'): Promise<PexelsPhoto | null> {
  const apiKey = process.env.PEXELS_API_KEY;
  const normalizedQuery = query.replace(/\s+/g, ' ').trim().slice(0, 180);
  if (!apiKey || !normalizedQuery) return null;

  const searchUrl = new URL('https://api.pexels.com/v1/search');
  searchUrl.searchParams.set('query', normalizedQuery);
  searchUrl.searchParams.set('orientation', orientation);
  searchUrl.searchParams.set('per_page', '1');

  try {
    const response = await fetch(searchUrl, {
      headers: { Authorization: apiKey },
      signal: AbortSignal.timeout(8000),
      cache: 'no-store',
    });
    if (!response.ok) {
      console.warn('[PEXELS_IMAGES] Search unavailable:', response.status);
      return null;
    }

    const payload: unknown = await response.json();
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return null;
    const photos = (payload as Record<string, unknown>).photos;
    if (!Array.isArray(photos)) return null;
    return photos.length > 0 ? parsePexelsPhoto(photos[0]) : null;
  } catch (error) {
    console.warn('[PEXELS_IMAGES] Search failed:', error instanceof Error ? error.message : 'unknown error');
    return null;
  }
}

export async function searchPexelsFallbackImages(
  queries: PexelsSceneQuery[],
  options: { orientation: 'landscape' | 'portrait'; maxSearches?: number; concurrency?: number },
): Promise<Map<number, PexelsPhoto>> {
  const results = new Map<number, PexelsPhoto>();
  const work = queries
    .filter((item) => item.query.trim())
    .slice(0, Math.max(0, options.maxSearches ?? 24));
  const concurrency = Math.max(1, Math.min(options.concurrency ?? 4, 6));
  let cursor = 0;

  const workers = Array.from({ length: Math.min(concurrency, work.length) }, async () => {
    while (cursor < work.length) {
      const index = cursor;
      cursor += 1;
      const item = work[index];
      const photo = await searchPexelsPhoto(item.query, options.orientation);
      if (photo) results.set(item.sceneNumber, photo);
    }
  });

  await Promise.all(workers);
  return results;
}