export type SemanticVisualAssetType =
  | 'broll'
  | 'chart'
  | 'metric_card'
  | 'typography_backdrop'
  | 'ui_mockup';

export type MotionAnimationPreset =
  | 'slow_zoom_in'
  | 'slow_zoom_out'
  | 'pan_right'
  | 'scale_pop'
  | 'number_count_up';

export interface SemanticAssetPlan {
  visualIntent: string;
  visualAssetType: SemanticVisualAssetType;
  brollSearchQuery: string;
  motion: MotionAnimationPreset;
  highlightedWords: string[];
  suggestedHeading: string;
  suggestedSupportingText: string;
}

/**
 * Deterministic semantic visual asset planner that matches spoken transcript context
 * to exact visual representations, motions, and search queries.
 */
export function planVisualAssetsForSentence(text: string): SemanticAssetPlan {
  const cleanText = text.trim();
  const lower = cleanText.toLowerCase();

  // Keyword extraction for emphasis (words >= 4 letters)
  const words = cleanText.split(/\s+/).map((w) => w.replace(/[^\w]/g, ''));
  const highlightedWords = words.filter((w) => w.length >= 4).slice(0, 3);
  const heading = words.slice(0, 5).join(' ').toUpperCase() || 'KEY INSIGHT';

  const conciseSupportingText = cleanText.split(/\s+/).slice(0, 10).join(' ') + (cleanText.split(/\s+/).length > 10 ? '...' : '');

  // 1. Metric / Analytics / CTR / Growth Detection
  if (
    lower.includes('ctr') ||
    lower.includes('views') ||
    lower.includes('analytics') ||
    lower.includes('percent') ||
    lower.includes('%') ||
    lower.includes('growth') ||
    lower.includes('subscribers')
  ) {
    return {
      visualIntent: 'Analytics dashboard metric visualization with count up growth',
      visualAssetType: 'chart',
      brollSearchQuery: 'youtube analytics dashboard metrics',
      motion: 'number_count_up',
      highlightedWords,
      suggestedHeading: heading,
      suggestedSupportingText: conciseSupportingText,
    };
  }

  // 2. Creator struggle / Quitting / Failing
  if (
    lower.includes('quit') ||
    lower.includes('stop') ||
    lower.includes('fail') ||
    lower.includes('give up') ||
    lower.includes('mistake') ||
    lower.includes('problem')
  ) {
    return {
      visualIntent: 'Creator experiencing creative burnout or looking at declining metrics',
      visualAssetType: 'broll',
      brollSearchQuery: 'stressed creator desk laptop night',
      motion: 'slow_zoom_in',
      highlightedWords,
      suggestedHeading: heading,
      suggestedSupportingText: conciseSupportingText,
    };
  }

  // 3. Success / Blowing Up / Viral / Revenue
  if (
    lower.includes('blow up') ||
    lower.includes('viral') ||
    lower.includes('success') ||
    lower.includes('money') ||
    lower.includes('revenue') ||
    lower.includes('scale')
  ) {
    return {
      visualIntent: 'Explosive viral growth or 3D gold play button reward',
      visualAssetType: 'metric_card',
      brollSearchQuery: 'golden play button viral growth fireworks',
      motion: 'scale_pop',
      highlightedWords,
      suggestedHeading: heading,
      suggestedSupportingText: conciseSupportingText,
    };
  }

  // 4. UI / Software / Technical Workflow
  if (
    lower.includes('software') ||
    lower.includes('tool') ||
    lower.includes('app') ||
    lower.includes('dashboard') ||
    lower.includes('website')
  ) {
    return {
      visualIntent: 'Clean modern software dashboard interface highlight',
      visualAssetType: 'ui_mockup',
      brollSearchQuery: 'modern app interface dashboard screen',
      motion: 'pan_right',
      highlightedWords,
      suggestedHeading: heading,
      suggestedSupportingText: conciseSupportingText,
    };
  }

  // Default Cinematic Statement
  return {
    visualIntent: `Cinematic visualization of: ${heading}`,
    visualAssetType: 'broll',
    brollSearchQuery: `${words.slice(0, 3).join(' ')} cinematic studio`,
    motion: 'slow_zoom_out',
    highlightedWords,
    suggestedHeading: heading,
    suggestedSupportingText: conciseSupportingText,
  };
}

