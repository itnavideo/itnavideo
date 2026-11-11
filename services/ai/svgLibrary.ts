import { readUnifiedAssets } from './assetPicker';
import { toAbsoluteS3AssetUrl } from '@/constants/itnavideoStockAssets';

/**
 * S3-Hosted SVG Illustration Library
 *
 * Mirrors the verified-image catalog pattern (see aiImageLibrary.ts) but is
 * scoped to hosted `.svg` illustration assets. Designed SVG files uploaded to
 * S3 and indexed via `npm run assets:index` surface here, letting the faceless
 * pipeline render bespoke designed illustrations instead of the procedural
 * fallback catalog (svgMasterCatalog.ts).
 */

export interface S3SvgAsset {
  id: string;
  url: string;
  title: string;
  category: string;
  tags: string[];
  keywords: string[];
  visualDescription?: string;
  recommendedVideoTypes?: string[];
}

let cachedSvgs: S3SvgAsset[] | null = null;

function getVerifiedSvgs(): S3SvgAsset[] {
  if (cachedSvgs) return cachedSvgs;

  try {
    const unified = readUnifiedAssets();
    const mapped = unified
      .filter((asset) => {
        if (!asset.safeToUse || !asset.src) return false;
        // Strictly SVG illustration assets only
        if (asset.type !== 'image') return false;
        return asset.src.toLowerCase().endsWith('.svg');
      })
      .map((asset) => {
        const absoluteUrl = toAbsoluteS3AssetUrl(asset.src);
        return {
          id: asset.id,
          url: absoluteUrl,
          title: asset.title || 'Designed SVG Illustration',
          category: asset.category || 'illustration',
          tags: [...(asset.tags || []), ...(asset.keywords || [])],
          keywords: [...(asset.keywords || []), ...(asset.tags || [])],
          visualDescription: asset.detailedDescription || asset.title || '',
          recommendedVideoTypes: asset.recommendedVideoTypes || asset.useFor || [],
        } as S3SvgAsset;
      });

    cachedSvgs = mapped.length > 0 ? mapped : [];
    return cachedSvgs;
  } catch (err) {
    console.warn('[svgLibrary] Could not read unified SVG assets:', err);
    cachedSvgs = [];
    return cachedSvgs;
  }
}

/** Return all S3-hosted SVG illustrations currently cataloged. */
export function getAllSvgs(): S3SvgAsset[] {
  return getVerifiedSvgs();
}

/** Total count of available S3-hosted SVG illustrations. */
export function getS3SvgCount(): number {
  return getVerifiedSvgs().length;
}

/**
 * Eagerly load the S3 SVG catalog into the module cache. Call this once at the
 * start of the production crew so the synchronous resolver can consult hosted
 * SVGs without blocking on file I/O.
 */
export async function loadS3SvgLibrary(): Promise<S3SvgAsset[]> {
  return getVerifiedSvgs();
}

/**
 * Semantic keyword search across the S3 SVG library. Returns the best matches
 * for a spoken sentence / topic, optionally avoiding already-used asset ids.
 */
export function searchSvgs(
  sentenceText: string,
  options?: { avoidIds?: string[]; limit?: number }
): S3SvgAsset[] {
  const pool = getVerifiedSvgs();
  if (pool.length === 0) return [];

  const avoidSet = new Set(options?.avoidIds || []);
  const cleanTokens = sentenceText
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2);

  if (cleanTokens.length === 0) {
    return pool.filter((s) => !avoidSet.has(s.id)).slice(0, options?.limit ?? pool.length);
  }

  const scored = pool
    .map((svg) => {
      if (avoidSet.has(svg.id)) return { svg, score: -1 };
      const haystack = [svg.title, svg.category, svg.visualDescription || '', ...svg.tags, ...svg.keywords]
        .join(' ')
        .toLowerCase();
      let score = 0;
      for (const token of cleanTokens) {
        if (haystack.includes(token)) score += token.length;
      }
      return { svg, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  const limit = options?.limit ?? scored.length;
  return scored.slice(0, limit).map((entry) => entry.svg);
}
