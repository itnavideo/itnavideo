/**
 * Pexels Stock Media API Service (Photos & HD Video Clips)
 *
 * Provides instant cinematic B-roll (1080p MP4 clips and 4K/HD landscape photography)
 * for Faceless Videos, Explainers, and B-Roll overlays.
 */

export interface PexelsPhoto {
  imageUrl: string;
  photographer: string;
  photographerUrl: string;
  sourceUrl: string;
  width?: number;
  height?: number;
}

export interface PexelsVideo {
  videoUrl: string;
  previewUrl: string;
  duration: number;
  width: number;
  height: number;
  photographer: string;
  sourceUrl: string;
}

export type PexelsSceneQuery = {
  sceneNumber: number;
  query: string;
};

const DEFAULT_PEXELS_KEY = 'SSnEVHTUu4Pmf93RQB0PNoIr5U7IAGB6FTixxkh5aII6nTEj8w2IoqFu';

export function getPexelsApiKey(): string {
  return (
    process.env.PEXELS_API_KEY ||
    process.env.NEXT_PUBLIC_PEXELS_API_KEY ||
    DEFAULT_PEXELS_KEY
  ).trim();
}

// In-memory query cache to minimize repeated API hits and stay well below rate limits
const photoCache = new Map<string, PexelsPhoto[]>();
const videoCache = new Map<string, PexelsVideo[]>();

/**
 * Search Pexels Photos for High-Definition Photography
 */
export async function searchPexelsPhotos(
  query: string,
  options: {
    orientation?: 'landscape' | 'portrait' | 'square';
    perPage?: number;
  } = {}
): Promise<PexelsPhoto[]> {
  const apiKey = getPexelsApiKey();
  if (!apiKey) return [];

  const cleanQuery = query.trim().replace(/[#✦]/g, '').trim();
  if (!cleanQuery) return [];

  const orientation = options.orientation || 'landscape';
  const perPage = Math.min(15, options.perPage || 6);
  const cacheKey = `${orientation}:${perPage}:${cleanQuery.toLowerCase()}`;

  if (photoCache.has(cacheKey)) {
    return photoCache.get(cacheKey)!;
  }

  try {
    const url = new URL('https://api.pexels.com/v1/search');
    url.searchParams.set('query', cleanQuery);
    url.searchParams.set('orientation', orientation);
    url.searchParams.set('per_page', String(perPage));

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: apiKey,
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.warn(`[PEXELS_PHOTOS] API returned status ${response.status} for query "${cleanQuery}"`);
      return [];
    }

    const data = await response.json();
    const photos: PexelsPhoto[] = (data.photos || []).map((p: any) => ({
      imageUrl: p.src?.large2x || p.src?.large || p.src?.original || '',
      photographer: p.photographer || 'Pexels Contributor',
      photographerUrl: p.photographer_url || 'https://www.pexels.com',
      sourceUrl: p.url || '',
      width: p.width,
      height: p.height,
    })).filter((p: PexelsPhoto) => Boolean(p.imageUrl));

    photoCache.set(cacheKey, photos);
    return photos;
  } catch (err) {
    console.warn(`[PEXELS_PHOTOS] Error searching for "${cleanQuery}":`, err);
    return [];
  }
}

/**
 * Search Pexels Videos for 1080p HD B-Roll Video Clips
 */
export async function searchPexelsVideos(
  query: string,
  options: {
    orientation?: 'landscape' | 'portrait';
    perPage?: number;
    minDuration?: number;
    maxDuration?: number;
  } = {}
): Promise<PexelsVideo[]> {
  const apiKey = getPexelsApiKey();
  if (!apiKey) return [];

  const cleanQuery = query.trim().replace(/[#✦]/g, '').trim();
  if (!cleanQuery) return [];

  const orientation = options.orientation || 'landscape';
  const perPage = Math.min(10, options.perPage || 5);
  const cacheKey = `${orientation}:${perPage}:${cleanQuery.toLowerCase()}`;

  if (videoCache.has(cacheKey)) {
    return videoCache.get(cacheKey)!;
  }

  try {
    const url = new URL('https://api.pexels.com/videos/search');
    url.searchParams.set('query', cleanQuery);
    url.searchParams.set('orientation', orientation);
    url.searchParams.set('per_page', String(perPage));

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: apiKey,
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.warn(`[PEXELS_VIDEOS] API returned status ${response.status} for query "${cleanQuery}"`);
      return [];
    }

    const data = await response.json();
    const videos: PexelsVideo[] = (data.videos || [])
      .map((v: any) => {
        const files: any[] = v.video_files || [];
        // Prioritize 1080p Full HD MP4 files, fallback to 720p HD
        const hdFile =
          files.find((f: any) => f.quality === 'hd' && f.width >= 1920 && f.file_type?.includes('mp4')) ||
          files.find((f: any) => f.quality === 'hd' && f.width >= 1280 && f.file_type?.includes('mp4')) ||
          files.find((f: any) => f.file_type?.includes('mp4')) ||
          files[0];

        if (!hdFile || !hdFile.link) return null;

        return {
          videoUrl: hdFile.link,
          previewUrl: v.image || '',
          duration: Number(v.duration) || 0,
          width: Number(hdFile.width) || 1920,
          height: Number(hdFile.height) || 1080,
          photographer: v.user?.name || 'Pexels Contributor',
          sourceUrl: v.url || '',
        };
      })
      .filter(Boolean) as PexelsVideo[];

    videoCache.set(cacheKey, videos);
    return videos;
  } catch (err) {
    console.warn(`[PEXELS_VIDEOS] Error searching videos for "${cleanQuery}":`, err);
    return [];
  }
}

/**
 * Batch Search Fallback Images for Video Scenes
 * Replaces any missing visuals with crisp Pexels photos.
 */
export async function searchPexelsFallbackImages(
  queries: PexelsSceneQuery[],
  options: {
    orientation: 'landscape' | 'portrait';
    maxSearches?: number;
    concurrency?: number;
  }
): Promise<Map<number, PexelsPhoto>> {
  const result = new Map<number, PexelsPhoto>();
  if (!queries || queries.length === 0) return result;

  const maxSearches = options.maxSearches || 24;
  const targetQueries = queries.slice(0, maxSearches);
  const concurrency = Math.max(1, Math.min(6, options.concurrency || 4));

  for (let i = 0; i < targetQueries.length; i += concurrency) {
    const chunk = targetQueries.slice(i, i + concurrency);
    await Promise.all(
      chunk.map(async ({ sceneNumber, query }) => {
        if (!query.trim()) return;
        const photos = await searchPexelsPhotos(query, {
          orientation: options.orientation,
          perPage: 3,
        });
        if (photos.length > 0) {
          result.set(sceneNumber, photos[0]);
        }
      })
    );
  }

  return result;
}

/**
 * Smart Media Matcher for Scenes:
 * Matches cinematic Pexels video clips or photos for each scene based on narrative intent.
 */
export async function matchPexelsMediaForScenes(
  scenes: Array<{
    sceneNumber: number;
    brollSearchQuery?: string;
    visualIntent?: string;
    visualAssetRequirement?: string;
    heading?: string;
  }>,
  options: {
    orientation?: 'landscape' | 'portrait';
    preferVideo?: boolean;
    maxItems?: number;
  } = {}
): Promise<Record<number, string>> {
  const mediaMap: Record<number, string> = {};
  if (!scenes || scenes.length === 0) return mediaMap;

  const orientation = options.orientation || 'landscape';
  const preferVideo = options.preferVideo !== false; // Default: true for dynamic motion video clips
  const maxItems = options.maxItems || 30;

  const targetScenes = scenes.slice(0, maxItems);

  await Promise.all(
    targetScenes.map(async (scene, idx) => {
      const cleanTerm = (
        scene.brollSearchQuery ||
        scene.visualAssetRequirement ||
        scene.visualIntent ||
        scene.heading ||
        ''
      )
        .replace(/[^a-zA-Z0-9\s]/g, ' ')
        .trim();

      if (!cleanTerm) return;

      // Clean search tokens (take 1-3 most meaningful words)
      const tokens = cleanTerm
        .split(/\s+/)
        .filter((t) => t.length > 2 && !['photo', 'video', 'cinematic', 'broll', 'none'].includes(t.toLowerCase()))
        .slice(0, 3)
        .join(' ');

      const searchQuery = tokens || cleanTerm;

      // Even scenes or preferVideo -> Try HD video first
      if (preferVideo && idx % 2 === 0) {
        const videos = await searchPexelsVideos(searchQuery, { orientation, perPage: 2 });
        if (videos.length > 0 && videos[0].videoUrl) {
          mediaMap[scene.sceneNumber] = videos[0].videoUrl;
          return;
        }
      }

      // Photos fallback or alternate
      const photos = await searchPexelsPhotos(searchQuery, { orientation, perPage: 3 });
      if (photos.length > 0 && photos[0].imageUrl) {
        mediaMap[scene.sceneNumber] = photos[0].imageUrl;
      }
    })
  );

  return mediaMap;
}