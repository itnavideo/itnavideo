/**
 * Asset Resolver for Long Video Pro
 *
 * Resolves 3-Tier Visual Requirements (Primary -> Secondary -> Fallback Exec)
 * against available asset libraries and stock catalogs.
 */

import { loadAssetLibrary, type AssetMetadata } from './assetMatcher';
import type {
  VideoBlueprint,
  BlueprintScene,
  ResolvedBlueprintScene,
} from './videoBlueprintTypes';

export async function resolveBlueprintAssets(
  blueprint: VideoBlueprint
): Promise<ResolvedBlueprintScene[]> {
  // Load local/S3 asset library
  let assetLibrary: AssetMetadata[] = [];
  try {
    assetLibrary = await loadAssetLibrary();
  } catch (error) {
    console.warn('[ASSET_RESOLVER] Asset library load warning:', error);
  }

  return blueprint.scenes.map((scene) => resolveSceneAsset(scene, assetLibrary));
}

function resolveSceneAsset(
  scene: BlueprintScene,
  library: AssetMetadata[]
): ResolvedBlueprintScene {
  // 1. Attempt Primary Asset Resolution
  if (scene.primaryAsset?.query && library.length > 0) {
    const primaryMatch = findBestAssetMatch(scene.primaryAsset.query, library);
    if (primaryMatch && primaryMatch.url?.startsWith('http')) {
      return {
        ...scene,
        resolvedUrl: primaryMatch.url,
        resolvedSource: 'primary',
        renderedType: scene.visualType === 'VIDEO_CLIP' ? 'VIDEO_CLIP' : 'IMAGE',
        imageSrc: scene.visualType === 'VIDEO_CLIP' ? undefined : primaryMatch.url,
        videoSrc: scene.visualType === 'VIDEO_CLIP' ? primaryMatch.url : undefined,
        fallbackSpec: scene.fallbackVisual,
      };
    }
  }

  // 2. Attempt Secondary Asset Resolution
  if (scene.secondaryAsset?.query && library.length > 0) {
    const secondaryMatch = findBestAssetMatch(scene.secondaryAsset.query, library);
    if (secondaryMatch && secondaryMatch.url?.startsWith('http')) {
      return {
        ...scene,
        resolvedUrl: secondaryMatch.url,
        resolvedSource: 'secondary',
        renderedType: 'IMAGE',
        imageSrc: secondaryMatch.url,
        fallbackSpec: scene.fallbackVisual,
      };
    }
  }

  // 3. Fallback Visual Execution (Guaranteed 3rd-tier)
  // If neither primary nor secondary asset was found, execute fallback representation
  const fallbackType =
    scene.fallbackVisual.type === 'chart'
      ? 'CHART_GRAPH'
      : scene.fallbackVisual.type === 'simple_background'
      ? 'SIMPLE_BACKGROUND'
      : 'TYPOGRAPHY';

  return {
    ...scene,
    resolvedUrl: undefined,
    resolvedSource: 'fallback',
    renderedType: fallbackType,
    fallbackSpec: scene.fallbackVisual,
  };
}

function findBestAssetMatch(query: string, library: AssetMetadata[]): AssetMetadata | null {
  if (!query || library.length === 0) return null;

  const normalizedQuery = query.toLowerCase().trim();
  const queryTokens = normalizedQuery.split(/\s+/).filter((t) => t.length > 2);

  let bestAsset: AssetMetadata | null = null;
  let bestScore = -1;

  for (const asset of library) {
    const tagsStr = (asset.tags || []).join(' ').toLowerCase();
    const keywordsStr = (asset.keywords || []).join(' ').toLowerCase();
    const idStr = (asset.id || asset.path || '').toLowerCase();
    const categoryStr = (asset.category || '').toLowerCase();

    let score = 0;
    for (const token of queryTokens) {
      if (tagsStr.includes(token)) score += 3;
      if (keywordsStr.includes(token)) score += 2;
      if (idStr.includes(token)) score += 2;
      if (categoryStr.includes(token)) score += 1;
    }

    if (score > bestScore && score > 0) {
      bestScore = score;
      bestAsset = asset;
    }
  }

  return bestAsset || library[0] || null;
}
