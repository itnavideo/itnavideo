import type { SceneBlueprintItem } from './sceneBlueprintTypes';

export interface UploadedImageCandidate {
  key: string;
  url: string;
  fileName?: string;
  captionOrLabel?: string;
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

      const assetLabel = `${asset.fileName || ''} ${asset.captionOrLabel || ''} ${asset.key || ''}`;
      const assetKeywords = extractWords(assetLabel);

      let score = 0;
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
    if (bestScore > 0 && bestAssetIdx >= 0) {
      chosenAssetIdx = bestAssetIdx;
    } else {
      // Pick next available unused asset in sorted chronological order
      chosenAssetIdx = sortedAssets.findIndex((_, idx) => !usedIndices.has(idx));
    }

    if (chosenAssetIdx >= 0 && chosenAssetIdx < sortedAssets.length) {
      const chosenAsset = sortedAssets[chosenAssetIdx];
      if (chosenAsset && chosenAsset.url) {
        mappedBrollUrls[scene.sceneNumber] = chosenAsset.url;
        usedIndices.add(chosenAssetIdx);
      }
    }
    // NO MODULO LOOPING FALLBACK: When all uploaded images have been used once,
    // mappedBrollUrls[scene.sceneNumber] stays empty so surplus scenes automatically
    // transform into Impact Kinetic Typography Callout Cards!
  });

  return mappedBrollUrls;
}

