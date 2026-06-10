import {readFileSync} from 'node:fs';
import path from 'node:path';
import type {ScriptDetails} from './scriptDetails';

type VisualAsset = {
  id: string;
  src: string;
  type: 'image' | 'video';
  category: string;
  title: string;
  tags: string[];
  useFor: string[];
  avoidFor: string[];
  qualityScore: number;
  needsLabel: boolean;
  safeToUse: boolean;
};

type VisualAssetIndex = {
  assets?: VisualAsset[];
};

let cachedAssets: VisualAsset[] | null = null;

export function matchVisualAssetsForScript(scriptDetails: ScriptDetails, limit = 8) {
  const assets = readVisualAssets().filter((asset) => asset.safeToUse && !asset.needsLabel);
  if (!assets.length) return [];

  const searchText = [
    scriptDetails.topic,
    scriptDetails.summary,
    ...(scriptDetails.keyPoints || []),
    ...(scriptDetails.assetBriefs || []).map((brief) => `${brief.title} ${brief.searchText}`),
    ...(scriptDetails.imageSelectionPlan || []).map((item) => [
      item.imageNeed,
      item.bestMatchDescription,
      ...(item.requiredTags || []),
    ].join(' ')),
    ...(scriptDetails.detailBlocks || []).flatMap((block) => [block.title, ...block.items]),
  ].join(' ');
  const queryTokens = tokenize(searchText);

  return assets
    .map((asset) => ({
      asset,
      score: scoreAsset(asset, queryTokens),
    }))
    .filter((item) => item.score >= MIN_RELEVANCE_SCORE)
    .sort((a, b) => b.score - a.score || b.asset.qualityScore - a.asset.qualityScore)
    .slice(0, limit)
    .map(({asset}) => `asset: ${asset.title} (${asset.type}, ${asset.category}) -> ${asset.src}`);
}

const MIN_RELEVANCE_SCORE = 6;

export function readVisualAssets() {
  if (cachedAssets) return cachedAssets;
  try {
    const indexPath = path.join(process.cwd(), 'public', 'visuals', 'asset-index.json');
    const parsed = JSON.parse(readFileSync(indexPath, 'utf8')) as VisualAssetIndex;
    cachedAssets = Array.isArray(parsed.assets) ? parsed.assets : [];
  } catch {
    cachedAssets = [];
  }
  return cachedAssets;
}

function scoreAsset(asset: VisualAsset, queryTokens: Set<string>) {
  const assetText = [
    asset.id,
    asset.title,
    asset.category,
    ...(asset.tags || []),
    ...(asset.useFor || []),
  ].join(' ');
  const assetTokens = tokenize(assetText);
  let score = 0;
  for (const token of assetTokens) {
    if (queryTokens.has(token)) score += token.length > 5 ? 3 : 1;
  }
  if (queryTokens.has(asset.category)) score += 4;
  return score + Math.max(0, Math.min(100, asset.qualityScore || 0)) / 100;
}

function tokenize(value: string) {
  return new Set(
    String(value || '')
      .toLowerCase()
      .split(/[^a-z0-9]+/g)
      .filter((token) => token.length > 2)
      .filter((token) => !STOP_WORDS.has(token)),
  );
}

const STOP_WORDS = new Set([
  'the',
  'and',
  'for',
  'with',
  'this',
  'that',
  'from',
  'into',
  'your',
  'video',
  'reel',
  'scene',
  'visual',
  'preview',
]);
