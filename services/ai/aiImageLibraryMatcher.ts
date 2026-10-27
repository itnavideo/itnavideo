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
  visualStyle?: 'realistic' | '3d' | '2d';
  minimumScore?: number;
  videoType?: string;
}

const COMMON_STOP_WORDS = new Set([
  'the', 'and', 'for', 'with', 'that', 'this', 'from', 'into', 'your', 'about',
  'video', 'scene', 'clip', 'shot', 'image', 'visual', 'showing', 'displaying',
  'high', 'quality', 'look', 'best', 'more', 'some', 'than', 'them', 'they',
  'have', 'been', 'what', 'when', 'where', 'which', 'will', 'would', 'could',
  'there', 'their', 'here', 'over', 'under', 'again', 'after', 'before', 'very',
]);

const DATABASE_KEYWORDS = new Set([
  'oracle', 'sql', 'plsql', 'database', 'databases', 'rdbms', 'tablespace', 'tablespaces',
  'datafile', 'datafiles', 'redo', 'undo', 'buffer', 'cache', 'sga', 'pga',
  'shared pool', 'lgwr', 'dbwr', 'pmon', 'smon', 'b-tree', 'btree', 'index',
  'indexes', 'execution plan', 'explain plan', 'cbo', 'transaction', 'transactions',
  'acid', 'commit', 'rollback', 'mvcc', 'cursor', 'cursors', 'trigger', 'triggers',
  'stored procedure', 'stored procedures', 'package', 'packages', 'normalization',
  'foreign key', 'primary key', 'schema', 'schemas', 'query optimization', 'partitioning',
  'wal', 'deadlock', 'concurrency', 'data dictionary', 'v$session', 'v$process', 'dbms'
]);

function extractSearchTokens(text: string): string[] {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2 && !COMMON_STOP_WORDS.has(word));
}

function hasDatabaseIntent(tokens: string[]): boolean {
  return tokens.some((t) => DATABASE_KEYWORDS.has(t));
}

/**
 * Calculate relevance score between a scene and an image record
 */
function scoreImageForScene(
  scene: SceneBlueprintItem,
  image: AiLibraryImage,
  targetRatio: '16:9' | '9:16',
  recentlyUsedIds: string[],
  usageCounts: Map<string, number>,
  videoType?: string
): number {
  let score = 0;

  // 1. Aspect Ratio Alignment (+8 points)
  if (image.aspectRatio === targetRatio) {
    score += 8;
  }

  // 2. High-Intent Visual Asset Requirement & B-Roll Queries (including Backend English Translation)
  const intentTokens = extractSearchTokens(
    `${scene.visualIntent || ''} ${scene.brollSearchQuery || ''} ${scene.visualAssetRequirement || ''} ${(scene as any).englishMeaning || ''}`
  );

  // 3. Narrative Context Tokens (Heading, Highlights, Narration)
  const headingTokens = extractSearchTokens(scene.heading || '');
  const highlightTokens = (scene.highlightedWords || []).map((w) => w.toLowerCase());
  const narrationTokens = extractSearchTokens(
    `${scene.supportingText || ''} ${scene.narrationSegment?.text || ''}`
  );

  // ── RULE: Oracle Database Asset Isolation (Strict Technical Topic Gating) ──
  const isOracleAsset = image.category === 'oracle-database' || (image.subCategory && image.subCategory.includes('oracle'));
  if (isOracleAsset) {
    const allContextTokens = [...intentTokens, ...headingTokens, ...highlightTokens, ...narrationTokens];
    const isDbRelevant = hasDatabaseIntent(allContextTokens);
    if (!isDbRelevant) {
      // Disqualify Oracle diagrams on non-database videos (prevents Oracle diagrams appearing in fitness, business, etc.)
      return -999;
    }
    // High-Intent Technical Boost
    score += 16;
  }

  // ── RULE: Whiteboard Aesthetic Isolation ──
  if (videoType === 'whiteboardVideo') {
    if (image.kind !== 'whiteboard' && image.kind !== 'icon' && image.category !== 'whiteboard') {
      return -999; // Reject dark full-bleed photos/backgrounds on clean whiteboard canvas
    }
    score += 15;
  } else if (image.kind === 'whiteboard' || image.category === 'whiteboard') {
    // For non-whiteboard videos (like cinematic Faceless Video), don't pick doodle assets unless explicitly requested
    if (!intentTokens.includes('whiteboard') && !intentTokens.includes('sketch') && !intentTokens.includes('doodle')) {
      score -= 20;
    }
  }

  // ── RULE: Icon Full-Bleed Protection ──
  if (image.kind === 'icon' && videoType !== 'whiteboardVideo') {
    if ((scene as any).visualLayout !== 'card_concept') {
      score -= 25; // Prevent small 24x24 vector icons from being picked as full-bleed 16:9 backgrounds
    }
  }

  // ── RULE: Book Summary Conceptual Visual Boost ──
  if (videoType === 'bookSummary') {
    if (image.category === 'diagrams' || image.category === 'backgrounds' || image.kind === 'diagram') {
      score += 8;
    }
  }

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
  score -= timesUsed * 8;

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

  const allLibraryImages = getAllLibraryImages();
  let library = allLibraryImages;
  if (options?.visualStyle === '2d') {
    const filtered = allLibraryImages.filter((image) => {
      const searchable = `${image.url} ${image.category} ${image.title} ${(image.tags || []).join(' ')}`.toLowerCase();
      return /(?:\/2d\/|\b2d\b|vector|illustration|cartoon)/i.test(searchable);
    });
    if (filtered.length > 0) library = filtered;
  } else if (options?.visualStyle === '3d') {
    const filtered = allLibraryImages.filter((image) => {
      const searchable = `${image.url} ${image.category} ${image.title} ${(image.tags || []).join(' ')}`.toLowerCase();
      return /(?:\/3d\/|\b3d\b|render|isometric|cgi)/i.test(searchable);
    });
    if (filtered.length > 0) library = filtered;
  } else if (options?.visualStyle === 'realistic') {
    const filtered = allLibraryImages.filter((image) => {
      const searchable = `${image.url} ${image.category} ${image.title} ${(image.tags || []).join(' ')}`.toLowerCase();
      return !/(?:\/2d\/|\/3d\/|vector|cartoon|isometric)/i.test(searchable);
    });
    if (filtered.length > 0) library = filtered;
  }
  if (library.length === 0) library = allLibraryImages;

  const targetRatio = options?.aspectRatio || '16:9';
  const videoType = options?.videoType;
  const recentlyUsedIds: string[] = [];
  const usageCounts = new Map<string, number>();

  for (const scene of scenes) {
    // Evaluate every image in the library for this scene
    const scoredCandidates: Array<{ image: AiLibraryImage; score: number }> = [];

    for (const candidate of library) {
      const score = scoreImageForScene(
        scene,
        candidate,
        targetRatio,
        recentlyUsedIds,
        usageCounts,
        videoType
      );

      // Only consider non-disqualified candidates
      if (score > -500) {
        scoredCandidates.push({ image: candidate, score });
      }
    }

    scoredCandidates.sort((a, b) => b.score - a.score);

    const bestScore = scoredCandidates[0]?.score ?? -Infinity;

    // Generative Variety Engine: Pick among top 4 relevant candidates within 80% of top score
    let bestImage = scoredCandidates[0]?.image || library[0];
    if (bestScore >= (options?.minimumScore ?? 0)) {
      const topPool = scoredCandidates
        .filter((c) => c.score >= Math.max((options?.minimumScore ?? 0), bestScore - 12))
        .slice(0, 4);

      if (topPool.length > 1) {
        bestImage = topPool[Math.floor(Math.random() * topPool.length)].image;
      }

      result[scene.sceneNumber] = bestImage.url;
    }

    // Track usage to ensure visual variety across scenes
    recentlyUsedIds.push(bestImage.id);
    if (recentlyUsedIds.length > 5) {
      recentlyUsedIds.shift();
    }
    usageCounts.set(bestImage.id, (usageCounts.get(bestImage.id) || 0) + 1);
  }

  return result;
}
