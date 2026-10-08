/**
 * Auto B-Roll Stock Video Matcher (S3 & User Uploads Only - No External Pexels Calls)
 *
 * Matches HD video assets exclusively from our own S3 bucket asset catalog
 * or user uploads, falling back gracefully to dynamic typography/gradient cards.
 */

import { ITNAVIDEO_STOCK_ASSETS, toAbsoluteS3AssetUrl } from '@/constants/itnavideoStockAssets';
import { loadAssetLibrary } from './assetMatcher';

export interface BrollMatchResult {
  sceneIndex: number;
  query: string;
  videoUrl: string;
}

export async function matchBrollForQuery(
  query: string,
  sceneIndex: number,
  options?: { avoidKeywords?: string[]; negativeTags?: string[] }
): Promise<string | null> {
  const cleanQuery = (query || '').toLowerCase().trim();
  if (!cleanQuery) return null;

  const avoidList = (options?.avoidKeywords || []).map((k) => k.toLowerCase().trim());
  const queryTokens = cleanQuery.split(/\s+/).filter((t) => t.length > 1);

  // Detect query-level negations (e.g., "zero money", "no cash", "extreme poverty", "empty wallet", "struggling")
  const hasPovertyOrNegation =
    /\b(no|zero|empty|without|little|lack|broke|poverty|struggling|debt|low|hard times)\b/i.test(cleanQuery);
  const hasWealthKeywords =
    /\b(rich|wealth|millionaire|millions|billions|jackpot|won|lottery|stacks|luxury|cash pile|abundance)\b/i.test(cleanQuery);

  try {
    // 1. Search & Score against S3 Stock Video Assets (ITNAVIDEO_STOCK_ASSETS)
    const stockAssets = ITNAVIDEO_STOCK_ASSETS || [];
    let bestAsset: (typeof stockAssets)[0] | null = null;
    let maxScore = -999;

    for (const asset of stockAssets) {
      let score = 0;
      const posTags = (asset.positiveTags || []).map((t) => t.toLowerCase().trim());
      const negTags = (asset.negativeTags || []).map((t) => t.toLowerCase().trim());
      const titleStr = (asset.title || '').toLowerCase();
      const idStr = (asset.id || '').toLowerCase();

      // 1a. Negative Tag Penalty (-100 Disqualification)
      for (const neg of negTags) {
        if (queryTokens.includes(neg) || cleanQuery.includes(neg)) {
          score -= 100;
        }
      }
      for (const avoid of avoidList) {
        if (avoid && (posTags.some((t) => t.includes(avoid)) || titleStr.includes(avoid) || idStr.includes(avoid))) {
          score -= 100;
        }
      }

      // 1b. Negation Prefix Conflict Rules
      if (hasPovertyOrNegation) {
        const isWealthAsset =
          negTags.some((t) => ['rich', 'wealth', 'luxury', 'cash pile', 'abundance'].includes(t)) ||
          posTags.some((t) => ['millionaire', 'cash pile', 'luxury', 'abundance', 'stacks', 'rich'].includes(t)) ||
          idStr.includes('rich') || idStr.includes('cash-pile');
        if (isWealthAsset) {
          score -= 100;
        }
      } else if (hasWealthKeywords) {
        const isPovertyAsset =
          posTags.some((t) => ['empty wallet', 'broke', 'poverty', 'low money', 'debt'].includes(t)) ||
          idStr.includes('empty-wallet') || idStr.includes('poverty');
        if (isPovertyAsset) {
          score -= 100;
        }
      }

      if (score <= -50) continue; // Skip disqualified assets

      // 1c. Multi-word Exact Phrase Matching (+10 Points)
      for (const tag of posTags) {
        if (tag.includes(' ') && cleanQuery.includes(tag)) {
          score += 10;
        }
      }

      // 1d. Single-token Matching (+1 to +3 Points)
      for (const token of queryTokens) {
        if (posTags.some((t) => t === token)) score += 3;
        else if (posTags.some((t) => t.includes(token))) score += 2;
        else if (titleStr.includes(token) || idStr.includes(token)) score += 1;
      }

      if (score > maxScore && score >= 2) {
        maxScore = score;
        bestAsset = asset;
      }
    }

    if (bestAsset && bestAsset.url) {
      return bestAsset.url;
    }

    // 2. Search & Score against S3 Asset Library Metadata (loadAssetLibrary)
    const library = await loadAssetLibrary();
    const videoMatches = library.filter((item) => item.type === 'video' || (item as any).format === 'mp4');

    let bestLibItem: (typeof videoMatches)[0] | null = null;
    let maxLibScore = -999;

    for (const item of videoMatches) {
      let score = 0;
      const keywords = (item.keywords || []).map((k) => k.toLowerCase());
      for (const avoid of avoidList) {
        if (avoid && keywords.some((k) => k.includes(avoid))) score -= 100;
      }
      for (const token of queryTokens) {
        if (keywords.includes(token)) score += 2;
      }
      if (score > maxLibScore && score >= 2) {
        maxLibScore = score;
        bestLibItem = item;
      }
    }

    if (bestLibItem && bestLibItem.url) {
      return bestLibItem.url;
    }
  } catch (err) {
    console.warn('[BROLL_MATCHER] Asset library match warning, falling back to dynamic card:', err);
  }

  // 3. Fallback: Return null so Remotion renders dynamic typography/gradient card
  return null;
}

export async function planBrollForScenes(
  scenes: { sceneNumber: number; brollSearchQuery?: string; avoidKeywords?: string[] }[]
): Promise<Record<number, string>> {
  const brollMap: Record<number, string> = {};
  if (!scenes || scenes.length === 0) return brollMap;

  await Promise.all(
    scenes.map(async (scene, idx) => {
      const query = scene.brollSearchQuery || '';
      const videoUrl = await matchBrollForQuery(query, idx, { avoidKeywords: scene.avoidKeywords });
      if (videoUrl) {
        brollMap[scene.sceneNumber] = videoUrl;
      }
    })
  );

  return brollMap;
}
