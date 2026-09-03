// lib/captions/eventPlanner.ts
// Master orchestrator: TranscriptDocument -> Structured CaptionEvent Timeline

import type {
  TranscriptDocument,
  CaptionEvent,
  CaptionAnchorPosition,
  LineDistributionMode,
  MotionFamily,
} from './types';
import { segmentTranscriptIntoPhrases } from './phraseSegmenter';
import { classifyPhraseType, calculateSpeechSpeed, analyzePhraseWords } from './semanticEmphasis';
import { buildResponsiveLayout, detectAspectRatio } from './layoutEngine';
import { resolveStyleSystem } from './styleSystems';
import { getMotionConfig } from './motionEngine';

export interface CaptionPlanOptions {
  styleName?: string;
  canvasWidth?: number;
  canvasHeight?: number;
  anchorPosition?: CaptionAnchorPosition;
  customTextColor?: string;
  customHighlightColor?: string;
  customBackgroundColor?: string;
  customFontFamily?: string;
  customFontSize?: 'small' | 'medium' | 'large' | 'xlarge' | number;
  lineDistribution?: LineDistributionMode;
  motionFamily?: MotionFamily;
}

function resolveFontSizePx(
  sizeOption: 'small' | 'medium' | 'large' | 'xlarge' | number | undefined,
  aspectRatio: '9:16' | '16:9' | '1:1',
  defaultHeroSize = 64
): { heroSizePx: number; leadSizePx: number } {
  let basePx = defaultHeroSize;

  if (typeof sizeOption === 'number') {
    basePx = sizeOption;
  } else if (sizeOption === 'small') {
    basePx = 48;
  } else if (sizeOption === 'medium') {
    basePx = 58;
  } else if (sizeOption === 'large') {
    basePx = 68;
  } else if (sizeOption === 'xlarge') {
    basePx = 82;
  }

  // Adjust slightly for widescreen landscape 16:9
  if (aspectRatio === '16:9') {
    basePx = Math.round(basePx * 0.9);
  }

  return {
    heroSizePx: basePx,
    leadSizePx: Math.max(32, Math.round(basePx * 0.82)),
  };
}

/**
 * Plans a complete stream of CaptionEvents from an approved TranscriptDocument
 */
export function planCaptionEvents(
  doc: TranscriptDocument,
  options: CaptionPlanOptions = {}
): CaptionEvent[] {
  const width = options.canvasWidth ?? 1080;
  const height = options.canvasHeight ?? 1920;
  const aspectRatio = detectAspectRatio(width, height);

  // 1. Segment words into balanced clause phrases
  const rawPhrases = segmentTranscriptIntoPhrases(doc.words, {
    minWordsPerPhrase: 2,
    maxWordsPerPhrase: 5,
    maxDurationSeconds: 2.2,
  });

  if (rawPhrases.length === 0) {
    return [];
  }

  // 2. Resolve selected Style System
  const stylePreset = resolveStyleSystem(options.styleName);

  // 3. Resolve typography sizing
  const fontSizes = resolveFontSizePx(options.customFontSize, aspectRatio, 64);
  const heroFont = options.customFontFamily || stylePreset.defaultTypography.heroFont;
  const leadFont = options.customFontFamily || stylePreset.defaultTypography.leadFont;

  // 4. Map each phrase into a rich CaptionEvent
  const totalPhrases = rawPhrases.length;

  const events: CaptionEvent[] = rawPhrases.map((phrase, idx) => {
    const phraseType = classifyPhraseType(phrase, idx, totalPhrases);
    const speechSpeed = calculateSpeechSpeed(phrase.duration, phrase.text.length);

    // Analyze semantic hierarchy and staging
    const { words, leadText, heroText, subText } = analyzePhraseWords(phrase, phraseType);

    // Build layout
    const layout = buildResponsiveLayout(
      { width, height, aspectRatio },
      options.anchorPosition || stylePreset.defaultLayout.anchor,
      phrase.words.length,
      phrase.text.length,
      options.lineDistribution
    );

    // Build motion
    const motion = getMotionConfig(
      options.motionFamily || stylePreset.defaultMotion.family,
      {
        ...stylePreset.defaultMotion,
      }
    );

    // Build effects
    const effects = {
      ...stylePreset.defaultEffects,
      textColor: options.customTextColor || stylePreset.defaultEffects.textColor,
      highlightColor: options.customHighlightColor || stylePreset.defaultEffects.highlightColor,
      containerBackground:
        options.customBackgroundColor || stylePreset.defaultEffects.containerBackground,
    };

    return {
      id: phrase.id,
      start: phrase.start,
      end: phrase.end,
      duration: phrase.duration,
      text: phrase.text,
      words,
      phraseType,
      speechSpeed,
      leadText,
      heroText,
      subText,
      layout,
      typography: {
        heroFont,
        leadFont,
        heroWeight: stylePreset.defaultTypography.heroWeight,
        leadWeight: stylePreset.defaultTypography.leadWeight,
        heroSizePx: fontSizes.heroSizePx,
        leadSizePx: fontSizes.leadSizePx,
        letterSpacingEm: stylePreset.defaultTypography.letterSpacingEm,
        lineHeight: stylePreset.defaultTypography.lineHeight,
        textTransform: stylePreset.defaultTypography.textTransform,
      },
      motion,
      effects,
      layering: {
        depthTier: 'foreground',
        occlusionProtection: true,
      },
    };
  });

  return events;
}
