import { RAW_ITNAVIDEO_STOCK_ASSETS, toAbsoluteS3AssetUrl, type ItnaVideoStockAsset } from '@/constants/itnavideoStockAssets';
import fs from 'node:fs';
import path from 'node:path';

export interface S3CatalogAsset {
  id: string;
  title: string;
  category: string;
  categoryLabel?: string;
  url: string;
  absoluteUrl: string;
  style: 'realistic' | '2d' | '3d' | 'svg';
  tags: string[];
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

  // 1. Ingest curated stock assets from constants
  for (const asset of RAW_ITNAVIDEO_STOCK_ASSETS) {
    if (!asset.id || seenIds.has(asset.id)) continue;
    seenIds.add(asset.id);
    list.push({
      id: asset.id,
      title: asset.title,
      category: asset.category,
      categoryLabel: asset.categoryLabel,
      url: asset.url,
      absoluteUrl: toAbsoluteS3AssetUrl(asset.url),
      style: asset.style || '2d',
      tags: [...(asset.positiveTags || [])],
    });
  }

  // 2. Ingest additional verified assets from public/assets/assets.json if available
  try {
    const assetsJsonPath = path.join(process.cwd(), 'public', 'assets', 'assets.json');
    if (fs.existsSync(assetsJsonPath)) {
      const raw = fs.readFileSync(assetsJsonPath, 'utf8');
      const parsed = JSON.parse(raw);
      const items = Array.isArray(parsed) ? parsed : (parsed.assets || []);

      for (const item of items) {
        if (!item.id || seenIds.has(item.id)) continue;
        if (!item.safeToUse || item.type === 'audio') continue;
        const src = item.src || item.file;
        if (!src) continue;

        seenIds.add(item.id);
        const style: 'realistic' | '2d' | '3d' | 'svg' =
          item.kind === 'svg' || src.endsWith('.svg') ? 'svg' :
          src.includes('/realistic/') ? 'realistic' :
          src.includes('/3d/') ? '3d' : '2d';

        list.push({
          id: item.id,
          title: item.title || item.id,
          category: item.category || 'general',
          categoryLabel: item.category ? item.category.toUpperCase() : 'GENERAL',
          url: src,
          absoluteUrl: toAbsoluteS3AssetUrl(src),
          style,
          tags: [...(item.tags || []), ...(item.keywords || [])],
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

  // Tokenize transcript
  const tokens = transcriptText
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));

  const tokenSet = new Set(tokens);

  const scored: Array<{ asset: S3CatalogAsset; score: number }> = [];

  for (const asset of catalog) {
    if (category && category !== 'all' && asset.category !== category) continue;
    if (style && style !== 'all' && asset.style !== style) continue;

    let score = 0;
    const lowerTitle = asset.title.toLowerCase();

    // Check title matches
    for (const token of tokens) {
      if (lowerTitle.includes(token)) {
        score += 8;
      }
    }

    // Check tag matches
    for (const tag of asset.tags) {
      const lowerTag = tag.toLowerCase();
      if (tokenSet.has(lowerTag)) {
        score += 10;
      } else if (lowerTag.split(' ').some((part) => tokenSet.has(part))) {
        score += 5;
      }
    }

    if (score > 0) {
      scored.push({ asset: { ...asset, score }, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);

  if (scored.length >= maxResults) {
    return scored.slice(0, maxResults).map((s) => s.asset);
  }

  // Fill up with high quality general assets if score list is small
  const matchedIds = new Set(scored.map((s) => s.asset.id));
  const remaining = catalog.filter((a) => !matchedIds.has(a.id)).slice(0, maxResults - scored.length);

  return [...scored.map((s) => s.asset), ...remaining];
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
    keywords: a.tags.slice(0, 5),
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

