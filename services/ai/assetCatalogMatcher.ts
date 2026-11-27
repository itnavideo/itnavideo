import { RAW_ITNAVIDEO_STOCK_ASSETS, toAbsoluteS3AssetUrl, type ItnaVideoStockAsset } from '@/constants/itnavideoStockAssets';
import fs from 'node:fs';
import path from 'node:path';

export interface S3CatalogAsset {
  id: string;
  title: string;
  description?: string;
  category: string;
  categoryLabel?: string;
  url: string;
  absoluteUrl: string;
  style: 'realistic' | '2d' | '3d' | 'svg';
  tags: string[];
  needsLabel?: boolean;
  score?: number;
}

let cachedCombinedAssets: S3CatalogAsset[] | null = null;

/**
 * Loads and caches all verified assets from constants and public assets.json
 */
export function getAllS3CatalogAssets(): S3CatalogAsset[] {
  if (cachedCombinedAssets) {
    return cachedCombinedAssets;
  }

  const list: S3CatalogAsset[] = [];
  const seenIds = new Set<string>();

  // 1. Note: RAW_ITNAVIDEO_STOCK_ASSETS in constants/itnavideoStockAssets.ts references
  // legacy /images/2d/ and /widgets/*.html paths that are 403/404 on S3.
  // Skip them so only verified live S3 assets from public/assets/assets.json are matched.

  // 2. Ingest additional verified assets from public/assets/assets.json if available
  try {
    const assetsJsonPath = path.join(process.cwd(), 'public', 'assets', 'assets.json');
    if (fs.existsSync(assetsJsonPath)) {
      const raw = fs.readFileSync(assetsJsonPath, 'utf8');
      const parsed = JSON.parse(raw);
      const items = Array.isArray(parsed) ? parsed : (parsed.assets || []);

      for (const item of items) {
        if (!item.id || seenIds.has(item.id)) continue;
        if (!item.safeToUse || item.type === 'audio' || item.type === 'font') continue;
        const src = item.src || item.file;
        if (!src || /\.(ttf|otf|woff2?|eot|wav|mp3|ogg)(\?.*)?$/i.test(src)) continue;

        seenIds.add(item.id);
        const style: 'realistic' | '2d' | '3d' | 'svg' =
          item.kind === 'svg' || src.endsWith('.svg') ? 'svg' :
          src.includes('/realistic/') ? 'realistic' :
          src.includes('/3d/') ? '3d' : '2d';

        list.push({
          id: item.id,
          title: item.title || item.id,
          description: item.detailedDescription || item.description || '',
          category: item.category || 'general',
          categoryLabel: item.category ? item.category.toUpperCase() : 'GENERAL',
          url: src,
          absoluteUrl: toAbsoluteS3AssetUrl(src),
          style,
          tags: [...(item.tags || []), ...(item.keywords || [])],
          needsLabel: Boolean(item.needsLabel),
        });
      }
    }
  } catch (err) {
    console.warn('[ASSET_CATALOG] Could not read public/assets/assets.json:', err);
  }

  cachedCombinedAssets = list;
  return list;
}

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'with', 'that', 'this', 'from', 'into', 'your', 'about',
  'video', 'scene', 'clip', 'shot', 'image', 'visual', 'showing', 'displaying',
  'high', 'quality', 'look', 'best', 'more', 'some', 'than', 'them', 'they',
  'have', 'been', 'what', 'when', 'where', 'which', 'will', 'would', 'could',
  'there', 'their', 'here', 'over', 'under', 'again', 'after', 'before', 'very',
  'hai', 'hota', 'kare', 'kaise', 'hota', 'hota', 'hota', 'kuch', 'bhi', 'kya',
]);

/**
 * Searches the S3 asset catalog using transcript context and returns the highest matching assets
 */
export function searchS3AssetCatalog(
  transcriptText: string,
  options: {
    maxResults?: number;
    category?: string;
    style?: string;
  } = {}
): S3CatalogAsset[] {
  const { maxResults = 30, category, style } = options;
  const catalog = getAllS3CatalogAssets();
  if (!transcriptText || !transcriptText.trim()) {
    return catalog.slice(0, maxResults);
  }

  // Tokenize transcript and expand with domain synonyms
  const rawTokens = transcriptText
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));

  const SYNONYM_MAP: Record<string, string[]> = {
    phone: ['smartphone', 'mobile', 'device'],
    smartphone: ['phone', 'mobile'],
    film: ['video', 'camera', 'recording', 'filming'],
    filming: ['video', 'camera', 'recording'],
    office: ['workspace', 'desk', 'business', 'meeting'],
    gst: ['tax', 'finance', 'business', 'office', 'legal'],
    tax: ['finance', 'money', 'accounting', 'business'],
    money: ['finance', 'cash', 'dollar', 'wealth', 'income'],
    earnings: ['income', 'salary', 'money', 'finance', 'delivery'],
    driver: ['delivery', 'car', 'doordash', 'gig'],
    agent: ['automation', 'robot', 'tech', 'workflow'],
    laptop: ['computer', 'desk', 'work', 'office'],
    growth: ['chart', 'profit', 'investment', 'business'],
  };

  const tokenSet = new Set<string>(rawTokens);
  for (const t of rawTokens) {
    if (t.endsWith('s') && t.length > 4) tokenSet.add(t.slice(0, -1));
    if (t.endsWith('ing') && t.length > 5) tokenSet.add(t.slice(0, -3));
    const syns = SYNONYM_MAP[t];
    if (syns) {
      for (const s of syns) tokenSet.add(s);
    }
  }
  const tokens = Array.from(tokenSet);

  const scored: Array<{ asset: S3CatalogAsset; score: number }> = [];

  for (const asset of catalog) {
    // Skip interactive HTML widgets — Remotion <Img>/<OffthreadVideo> cannot render .html URLs
    if (/\.html?(\?.*)?$/i.test(asset.url || asset.absoluteUrl || '')) continue;
    // Skip unlabeled cryptic assets so they don't pollute semantic matches
    if (asset.needsLabel) continue;
    // Skip technical database-svgs unless transcript actually discusses databases/SQL
    const isDbSvg = (asset.url || asset.absoluteUrl || '').includes('/database-svgs/');
    if (isDbSvg && !/\b(database|sql|postgres|postgresql|mysql|query|indexing|table\s+scan)\b/i.test(transcriptText)) {
      continue;
    }
    if (category && category !== 'all' && asset.category !== category) continue;
    if (style && style !== 'all' && asset.style !== style) continue;

    let score = 0;
    const lowerTitle = asset.title.toLowerCase();
    const lowerDesc = (asset.description || '').toLowerCase();
    const lowerCat = (asset.category || '').toLowerCase();

    // Check title matches
    for (const token of tokens) {
      if (lowerTitle.includes(token)) {
        score += 8;
      }
      if (lowerDesc && lowerDesc.includes(token)) {
        score += 4;
      }
      if (lowerCat && lowerCat.includes(token)) {
        score += 4;
      }
    }

    // Check tag matches
    for (const tag of asset.tags) {
      const lowerTag = tag.toLowerCase();
      if (tokenSet.has(lowerTag)) {
        score += 10;
      } else if (lowerTag.split(/[\s_-]+/).some((part) => tokenSet.has(part))) {
        score += 5;
      }
    }

    // Slight boost for realistic photos and richly described assets
    if (score > 0 && asset.style === 'realistic') score += 3;
    if (score > 0 && lowerDesc.length > 30) score += 2;

    if (score > 0) {
      scored.push({ asset: { ...asset, score }, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);

  // Only return genuinely relevant matches (score >= 10); never pad with unrelated database/neuroscience SVGs
  return scored.filter((s) => s.score >= 10).slice(0, maxResults).map((s) => s.asset);
}

/**
 * Formats a compact JSON string of available S3 assets to inject directly into AI planning prompt
 */
export function formatAssetCatalogForPrompt(assets: S3CatalogAsset[]): string {
  const compact = assets.map((a) => ({
    id: a.id,
    title: a.title,
    category: a.category,
    style: a.style,
    description: a.description ? a.description.slice(0, 140) : undefined,
    keywords: a.tags.slice(0, 6),
  }));

  return JSON.stringify(compact);
}

/**
 * Lookup an asset by its ID
 */
export function getCatalogAssetById(id: string): S3CatalogAsset | null {
  const catalog = getAllS3CatalogAssets();
  return catalog.find((a) => a.id === id) || null;
}

