// lib/captions/layoutEngine.ts
// Responsive optical layout, line balancing, and safe zone positioning

import type { CaptionLayoutConfig, LineDistributionMode, CaptionAnchorPosition } from './types';

export interface CanvasDimensions {
  width: number;
  height: number;
  aspectRatio: '9:16' | '16:9' | '1:1';
}

export function detectAspectRatio(width: number, height: number): '9:16' | '16:9' | '1:1' {
  const ratio = width / height;
  if (ratio <= 0.65) return '9:16';
  if (ratio >= 1.4) return '16:9';
  return '1:1';
}

/**
 * Calculates safe margins and maximum line widths based on aspect ratio
 */
export function calculateCanvasBounds(dimensions: CanvasDimensions): {
  maxLineWidthPx: number;
  safeMarginTopPx: number;
  safeMarginBottomPx: number;
  safeMarginSidePx: number;
} {
  const { width, height, aspectRatio } = dimensions;

  if (aspectRatio === '9:16') {
    // 9:16 Vertical Reel/Short
    // TikTok/Reels UI: Top 15% header, Bottom 20% description/caption card, Right 16% action buttons
    return {
      maxLineWidthPx: Math.round(width * 0.84),
      safeMarginTopPx: Math.round(height * 0.14),
      safeMarginBottomPx: Math.round(height * 0.22),
      safeMarginSidePx: Math.round(width * 0.08),
    };
  }

  if (aspectRatio === '16:9') {
    // 16:9 Landscape YouTube
    return {
      maxLineWidthPx: Math.round(width * 0.76),
      safeMarginTopPx: Math.round(height * 0.1),
      safeMarginBottomPx: Math.round(height * 0.12),
      safeMarginSidePx: Math.round(width * 0.12),
    };
  }

  // 1:1 Square
  return {
    maxLineWidthPx: Math.round(width * 0.82),
    safeMarginTopPx: Math.round(height * 0.12),
    safeMarginBottomPx: Math.round(height * 0.16),
    safeMarginSidePx: Math.round(width * 0.09),
  };
}

/**
 * Determines the optimal line distribution mode for a phrase
 */
export function determineLineDistribution(
  wordCount: number,
  charCount: number,
  preferredMode?: LineDistributionMode
): LineDistributionMode {
  if (preferredMode) return preferredMode;
  if (wordCount <= 3 && charCount <= 18) return 'single-line';
  if (wordCount >= 4 && charCount > 22) return 'balanced-2line';
  return 'single-line';
}

/**
 * Splits words into balanced visual lines to prevent orphan single-word lines.
 */
export function balanceTextLines(words: string[]): string[][] {
  if (words.length <= 3) {
    return [words];
  }

  const totalChars = words.reduce((acc, w) => acc + w.length + 1, 0) - 1;
  const targetHalf = totalChars / 2;

  let currentLine: string[] = [];
  let currentLen = 0;
  let bestSplitIndex = 1;
  let minDifference = Infinity;

  for (let i = 0; i < words.length - 1; i++) {
    currentLen += words[i].length + (i > 0 ? 1 : 0);
    const diff = Math.abs(currentLen - targetHalf);
    if (diff < minDifference) {
      minDifference = diff;
      bestSplitIndex = i + 1;
    }
  }

  // Ensure neither line has only 1 word if total words >= 4
  if (words.length >= 4) {
    bestSplitIndex = Math.max(2, Math.min(words.length - 2, bestSplitIndex));
  }

  return [words.slice(0, bestSplitIndex), words.slice(bestSplitIndex)];
}

/**
 * Builds responsive layout configuration for a caption phrase
 */
export function buildResponsiveLayout(
  dimensions: CanvasDimensions,
  anchor: CaptionAnchorPosition = 'bottom-center',
  wordCount = 4,
  charCount = 20,
  lineDistributionOverride?: LineDistributionMode
): CaptionLayoutConfig {
  const bounds = calculateCanvasBounds(dimensions);
  const lineDistribution = determineLineDistribution(wordCount, charCount, lineDistributionOverride);

  let verticalOffsetPct = 74; // Lower third default

  if (anchor === 'center') {
    verticalOffsetPct = 50;
  } else if (anchor === 'top-center') {
    verticalOffsetPct = 20;
  } else if (anchor === 'dynamic-safe') {
    verticalOffsetPct = dimensions.aspectRatio === '9:16' ? 70 : 76;
  }

  return {
    anchor,
    verticalOffsetPct,
    maxLineWidthPx: bounds.maxLineWidthPx,
    lineDistribution,
    safeMarginBottomPct: Number(((bounds.safeMarginBottomPx / dimensions.height) * 100).toFixed(1)),
    textAlign: 'center',
  };
}
