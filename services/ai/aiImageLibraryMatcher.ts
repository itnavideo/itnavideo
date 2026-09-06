/**
 * Cloudinary ChatGPT AI Image Library Matcher
 *
 * Deterministically analyzes narrative scenes and matches the highest-relevance
 * curated ChatGPT image from the Cloudinary library without external stock APIs.
 */

import { getAllLibraryImages, type AiLibraryImage } from './aiImageLibrary';
import type { SceneBlueprintItem } from './sceneBlueprintTypes';

export interface ImageMatchOptions {
  aspectRatio?: '16:9' | '9:16';
  allowRepeats?: boolean;
}

const COMMON_STOP_WORDS = new Set([
  'the', 'and', 'for', 'with', 'that', 'this', 'from', 'into', 'your', 'about',
  'video', 'scene', 'clip', 'shot', 'image', 'visual', 'showing', 'displaying',
  'high', 'quality', 'look', 'best', 'more', 'some', 'than', 'them', 'they',
  'have', 'been', 'what', 'when', 'where', 'which', 'will', 'would', 'could',
  'there', 'their', 'here', 'over', 'under', 'again', 'after', 'before', 'very',
]);

function extractSearchTokens(text: string): string[] {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2 && !COMMON_STOP_WORDS.has(word));
}

/**
 * Calculate relevance score between a scene and an image record
 */
function scoreImageForScene(
  scene: SceneBlueprintItem,
  image: AiLibraryImage,
  targetRatio: '16:9' | '9:16',
  recentlyUsedIds: string[],
  usageCounts: Map<string, number>
): number {
  let score = 0;

  // 1. Aspect Ratio Alignment (+8 points)
  if (image.aspectRatio === targetRatio) {
    score += 8;
  }

  // 2. High-Intent Visual Asset Requirement & B-Roll Queries
  const intentTokens = extractSearchTokens(
    `${scene.visualIntent || ''} ${scene.brollSearchQuery || ''} ${scene.visualAssetRequirement || ''}`
  );

  // 3. Narrative Context Tokens (Heading, Highlights, Narration)
  const headingTokens = extractSearchTokens(scene.heading || '');
  const highlightTokens = (scene.highlightedWords || []).map((w) => w.toLowerCase());
  const narrationTokens = extractSearchTokens(
    `${scene.supportingText || ''} ${scene.narrationSegment?.text || ''}`
  );

  const imageTags = (image.tags || []).map((t) => t.toLowerCase());
  const imageTitle = (image.title || '').toLowerCase();
  const imageDesc = (image.visualDescription || '').toLowerCase();
  const imageCategory = (image.category || '').toLowerCase();

  // Score Intent Tokens (Highest Weight: 10 per tag, 5 per desc/title)
  for (const token of intentTokens) {
    if (imageTags.some((tag) => tag.includes(token) || token.includes(tag))) {
      score += 10;
    } else if (imageTitle.includes(token)) {
      score += 5;
    } else if (imageDesc.includes(token)) {
      score += 3;
    }
  }

  // Score Highlighted Keywords
  for (const token of highlightTokens) {
    if (imageTags.some((tag) => tag.includes(token))) {
      score += 8;
    } else if (imageTitle.includes(token)) {
      score += 4;
    }
  }

  // Score Heading Tokens
  for (const token of headingTokens) {
    if (imageTags.some((tag) => tag.includes(token))) {
      score += 6;
    } else if (imageTitle.includes(token)) {
      score += 3;
    }
  }

  // Score Narration Tokens (General context)
  for (const token of narrationTokens) {
    if (imageTags.includes(token)) {
      score += 2;
    } else if (imageTitle.includes(token)) {
      score += 1.5;
    }
  }

  // Category Semantic Boost
  if (intentTokens.includes(imageCategory) || headingTokens.includes(imageCategory)) {
    score += 7;
  }

  // Diversity & Anti-Repetition Rules
  const recentIdx = recentlyUsedIds.indexOf(image.id);
  if (recentIdx !== -1) {
    // If used in the immediate previous scene, penalize heavily
    if (recentIdx === recentlyUsedIds.length - 1) {
      score -= 30;
    } else {
      score -= 15;
    }
  }

  // Penalize frequent total usages to favor fresh visuals
  const timesUsed = usageCounts.get(image.id) || 0;
  score -= timesUsed * 6;

  return score;
}

/**
 * Plans and matches Cloudinary ChatGPT images for all scenes in a video blueprint.
 * Returns a mapping of { [sceneNumber]: imageUrl }.
 */
export async function planImagesFromLibraryForScenes(
  scenes: SceneBlueprintItem[],
  options?: ImageMatchOptions
): Promise<Record<number, string>> {
  const result: Record<number, string> = {};
  if (!scenes || scenes.length === 0) return result;

  const library = getAllLibraryImages();
  if (library.length === 0) return result;

  const targetRatio = options?.aspectRatio || '16:9';
  const recentlyUsedIds: string[] = [];
  const usageCounts = new Map<string, number>();

  for (const scene of scenes) {
    // Evaluate every image in the library for this scene
    let bestImage = library[0];
    let bestScore = -Infinity;

    for (const candidate of library) {
      const score = scoreImageForScene(
        scene,
        candidate,
        targetRatio,
        recentlyUsedIds,
        usageCounts
      );

      if (score > bestScore) {
        bestScore = score;
        bestImage = candidate;
      }
    }

    // Assign the winning image URL
    result[scene.sceneNumber] = bestImage.url;

    // Track usage to ensure visual variety across scenes
    recentlyUsedIds.push(bestImage.id);
    if (recentlyUsedIds.length > 4) {
      recentlyUsedIds.shift();
    }
    usageCounts.set(bestImage.id, (usageCounts.get(bestImage.id) || 0) + 1);
  }

  return result;
}
