import type {ScriptDetails} from './scriptDetails';

export type ExternalVisualAssetCandidate = {
  id: string;
  provider: 'pexels' | 'unsplash' | 'unsplash-source';
  type: 'image' | 'video';
  src: string;
  query: string;
  title: string;
  attribution?: string;
};

type PexelsPhoto = {
  id?: number;
  alt?: string;
  photographer?: string;
  src?: {
    portrait?: string;
    large2x?: string;
    large?: string;
    original?: string;
  };
};

type UnsplashPhoto = {
  id?: string;
  alt_description?: string;
  description?: string;
  user?: {name?: string};
  urls?: {
    regular?: string;
    full?: string;
    raw?: string;
  };
};

export async function buildExternalVisualAssetPool(scriptDetails: ScriptDetails, limit = getAssetLimit()): Promise<ExternalVisualAssetCandidate[]> {
  if (process.env.EXTERNAL_ASSET_POOL_ENABLED !== 'true') return [];
  const queries = buildAssetQueries(scriptDetails).slice(0, getQueryLimit());
  if (!queries.length) return [];

  const [pexels, unsplash] = await Promise.all([
    isPexelsEnabled() ? fetchPexelsImages(queries) : Promise.resolve([]),
    fetchUnsplashImages(queries),
  ]);
  const remote = uniqueAssets([...unsplash, ...pexels]).slice(0, limit);
  return remote.filter((asset) => isRenderableRemoteImage(asset.src));
}

function buildAssetQueries(scriptDetails: ScriptDetails) {
  const candidates = [
    ...(scriptDetails.imageSelectionPlan || []).map((item) => [
      item.bestMatchDescription,
      item.imageNeed,
      ...(item.requiredTags || []),
    ].join(' ')),
    ...(scriptDetails.assetBriefs || [])
      .filter((item) => item.visualType === 'editorial_photo' || item.visualType === 'video_clip')
      .map((item) => item.searchText || item.title),
    ...(scriptDetails.keyPoints || []),
    scriptDetails.topic,
    scriptDetails.summary,
  ];
  return uniqueStrings(candidates)
    .map((query) => sanitizeQuery(query))
    .filter(Boolean)
    .slice(0, 8);
}

async function fetchPexelsImages(queries: string[]) {
  const apiKey = process.env.PEXELS_API_KEY || process.env.NEXT_PUBLIC_PEXELS_API_KEY;
  if (!apiKey) return [];
  const results = await Promise.all(queries.map(async (query, queryIndex) => {
    try {
      const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=2&orientation=portrait`;
      const response = await fetch(url, {headers: {Authorization: apiKey}});
      if (!response.ok) return [];
      const json = await response.json() as {photos?: PexelsPhoto[]};
      return (json.photos || []).map((photo, photoIndex) => ({
        id: `pexels-${photo.id || `${queryIndex}-${photoIndex}`}`,
        provider: 'pexels' as const,
        type: 'image' as const,
        src: photo.src?.portrait || photo.src?.large2x || photo.src?.large || photo.src?.original || '',
        query,
        title: photo.alt || `${titleCase(query)} photo`,
        attribution: photo.photographer ? `Pexels / ${photo.photographer}` : 'Pexels',
      }));
    } catch {
      return [];
    }
  }));
  return results.flat().filter((asset) => asset.src);
}

function isPexelsEnabled() {
  const providerList = String(process.env.EXTERNAL_ASSET_PROVIDERS || '').toLowerCase();
  return providerList.split(',').map((item) => item.trim()).includes('pexels');
}

function getQueryLimit() {
  const configured = Number(process.env.EXTERNAL_ASSET_QUERY_LIMIT || 3);
  return Number.isFinite(configured) ? Math.min(5, Math.max(1, configured)) : 3;
}

export function getExternalAssetImageLimit() {
  return getAssetLimit();
}

function getAssetLimit() {
  const configured = Number(process.env.EXTERNAL_ASSET_IMAGES_PER_RENDER || 4);
  return Number.isFinite(configured) ? Math.min(8, Math.max(1, configured)) : 4;
}

async function fetchUnsplashImages(queries: string[]) {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY || process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
  if (!accessKey) return [];
  const results = await Promise.all(queries.map(async (query, queryIndex) => {
    try {
      const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=2&orientation=portrait&client_id=${encodeURIComponent(accessKey)}`;
      const response = await fetch(url);
      if (!response.ok) return [];
      const json = await response.json() as {results?: UnsplashPhoto[]};
      return (json.results || []).map((photo, photoIndex) => ({
        id: `unsplash-${photo.id || `${queryIndex}-${photoIndex}`}`,
        provider: 'unsplash' as const,
        type: 'image' as const,
        src: photo.urls?.regular || photo.urls?.full || photo.urls?.raw || '',
        query,
        title: photo.alt_description || photo.description || `${titleCase(query)} image`,
        attribution: photo.user?.name ? `Unsplash / ${photo.user.name}` : 'Unsplash',
      }));
    } catch {
      return [];
    }
  }));
  return results.flat().filter((asset) => asset.src);
}

function uniqueAssets(assets: ExternalVisualAssetCandidate[]) {
  const seen = new Set<string>();
  const result: ExternalVisualAssetCandidate[] = [];
  for (const asset of assets) {
    const key = asset.src.toLowerCase();
    if (!isRenderableRemoteImage(asset.src) || seen.has(key)) continue;
    seen.add(key);
    result.push(asset);
  }
  return result;
}

function isRenderableRemoteImage(src: string) {
  const value = String(src || '').trim();
  if (!/^https:\/\//i.test(value)) return false;
  if (/source\.unsplash\.com/i.test(value)) return false;
  return /\.(?:jpe?g|png|webp|avif)(?:[?#].*)?$/i.test(value) || /images\.pexels\.com|images\.unsplash\.com/i.test(value);
}

function sanitizeQuery(value: string) {
  return String(value || '')
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 90);
}

function uniqueStrings(values: string[]) {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values.map((item) => String(item || '').trim()).filter(Boolean)) {
    const key = value.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(value);
  }
  return result;
}

function titleCase(value: string) {
  return value.replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).slice(0, 64);
}
