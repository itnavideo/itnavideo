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

  const mappedBrollUrls: Record<number, string> = {};
  const remainingAssets = [...uploadedAssets];

  // Helper to extract clean keywords from filename or text
  const extractWords = (text: string) =>
    (text || '')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2);

  scenes.forEach((scene, sceneIdx) => {
    const sceneText = `${scene.heading || ''} ${scene.supportingText || ''} ${scene.narrationSegment?.text || ''} ${scene.visualAssetRequirement || ''}`;
    const sceneKeywords = extractWords(sceneText);

    let bestScore = -1;
    let bestAssetIdx = -1;

    uploadedAssets.forEach((asset, assetIdx) => {
      const assetLabel = `${asset.fileName || ''} ${asset.captionOrLabel || ''} ${asset.key || ''}`;
      const assetKeywords = extractWords(assetLabel);

      // Score keyword overlaps
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

    // If semantic keyword match found, use it; otherwise fallback to sequential distribution
    const chosenAsset =
      bestScore > 0 && bestAssetIdx >= 0
        ? uploadedAssets[bestAssetIdx]
        : uploadedAssets[sceneIdx % uploadedAssets.length];

    if (chosenAsset && chosenAsset.url) {
      mappedBrollUrls[scene.sceneNumber] = chosenAsset.url;
    }
  });

  return mappedBrollUrls;
}

