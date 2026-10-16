import type { SceneBlueprintItem } from './sceneBlueprintTypes';

export interface UploadedImageCandidate {
  key: string;
  url: string;
  fileName?: string;
  captionOrLabel?: string;
  tags?: string[];
  description?: string;
}

/**
 * AI Smart Image Matcher: Matches uploaded images to scene beats based on script keywords,
 * narration context, and topic relevancy. Ensures images appear at the exact right timestamp!
 */
export function smartMatchUploadedImagesToScenes(
  scenes: SceneBlueprintItem[],
  uploadedAssets: UploadedImageCandidate[]
): Record<number, string> {
  if (!scenes || !scenes.length || !uploadedAssets || !uploadedAssets.length) {
    return {};
  }

  // Enforce Natural Alphanumerical Pre-Sorting (e.g., 01, 02, 10...)
  const sortedAssets = [...uploadedAssets].sort((a, b) => {
    const nameA = a.fileName || a.captionOrLabel || a.key || '';
    const nameB = b.fileName || b.captionOrLabel || b.key || '';
    return nameA.localeCompare(nameB, undefined, { numeric: true, sensitivity: 'base' });
  });

  const mappedBrollUrls: Record<number, string> = {};
  const usedIndices = new Set<number>();

  // Helper to extract clean keywords from filename or text
  const extractWords = (text: string) =>
    (text || '')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2);

  scenes.forEach((scene) => {
    const sceneText = `${scene.heading || ''} ${scene.supportingText || ''} ${scene.narrationSegment?.text || ''} ${scene.visualAssetRequirement || ''}`;
    const sceneKeywords = extractWords(sceneText);

    let bestScore = 0;
    let bestAssetIdx = -1;

    sortedAssets.forEach((asset, assetIdx) => {
      if (usedIndices.has(assetIdx)) return; // Strictly 1-to-1: Each image used at most ONCE

      let score = 0;

      // 1. Vision AI Tags matching (Highest relevance weight: +5 per match)
      if (Array.isArray(asset.tags) && asset.tags.length > 0) {
        asset.tags.forEach((tag) => {
          const tClean = tag.toLowerCase().trim();
          if (sceneKeywords.some((sWord) => sWord.includes(tClean) || tClean.includes(sWord))) {
            score += 5;
          }
        });
      }

      // 2. Filename & label matching (+3 per match)
      const assetLabel = `${asset.fileName || ''} ${asset.captionOrLabel || ''} ${asset.description || ''} ${asset.key || ''}`;
      const assetKeywords = extractWords(assetLabel);
      sceneKeywords.forEach((sWord) => {
        if (assetKeywords.some((aWord) => aWord.includes(sWord) || sWord.includes(aWord))) {
          score += 3;
        }
      });

      if (score > bestScore) {
        bestScore = score;
        bestAssetIdx = assetIdx;
      }
    });

    let chosenAssetIdx = -1;
    // Primary Pass: map asset when there is an actual semantic relevance match (score > 0)
    if (bestScore > 0 && bestAssetIdx >= 0) {
      chosenAssetIdx = bestAssetIdx;
    }

    if (chosenAssetIdx >= 0 && chosenAssetIdx < sortedAssets.length) {
      const chosenAsset = sortedAssets[chosenAssetIdx];
      if (chosenAsset && chosenAsset.url) {
        mappedBrollUrls[scene.sceneNumber] = chosenAsset.url;
        usedIndices.add(chosenAssetIdx);
      }
    }
  });

  // Secondary Pass: Prioritize integrating ALL remaining uploaded user assets across scenes
  const visualLayouts = new Set([
    'full_bleed_visual',
    'card_concept',
    'split_screen',
    'image_text',
    'broll_overlay',
    'screenshot_highlight',
  ]);

  const unusedAssetIndices = sortedAssets
    .map((_, idx) => idx)
    .filter((idx) => !usedIndices.has(idx));

  if (unusedAssetIndices.length > 0) {
    let nextUnusedPointer = 0;

    // 1. First assign to visual scenes that don't have a media asset yet
    for (const scene of scenes) {
      if (nextUnusedPointer >= unusedAssetIndices.length) break;
      if (!mappedBrollUrls[scene.sceneNumber] && visualLayouts.has(scene.layoutType)) {
        const assetIdx = unusedAssetIndices[nextUnusedPointer++];
        const asset = sortedAssets[assetIdx];
        if (asset && asset.url) {
          mappedBrollUrls[scene.sceneNumber] = asset.url;
          usedIndices.add(assetIdx);
        }
      }
    }

    // 2. If still unused, assign to any remaining scene
    for (const scene of scenes) {
      if (nextUnusedPointer >= unusedAssetIndices.length) break;
      if (!mappedBrollUrls[scene.sceneNumber]) {
        const assetIdx = unusedAssetIndices[nextUnusedPointer++];
        const asset = sortedAssets[assetIdx];
        if (asset && asset.url) {
          mappedBrollUrls[scene.sceneNumber] = asset.url;
          usedIndices.add(assetIdx);
        }
      }
    }
  }

  return mappedBrollUrls;
}

