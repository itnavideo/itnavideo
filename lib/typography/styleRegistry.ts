import type { TypographyStyleId, AdvancedStyleBlueprint, StyleBlueprint } from './types';

// Export legacy STYLE_BLUEPRINTS for backwards compatibility
export const STYLE_BLUEPRINTS: Record<string, StyleBlueprint> = {
  'apple-keynote-punch': {
    id: 'apple-keynote-punch' as TypographyStyleId,
    name: 'Apple Keynote Punch',
    fontFamily: 'Inter, sans-serif',
    heroFontWeight: 900,
    leadFontWeight: 700,
    textColor: '#FFFFFF',
    accentColor: '#FF6D00',
    secondaryAccentColor: '#FFA726',
    maxWordsPerChunk: 3,
    kenBurnsIntensity: 0.05,
    colorGrade: { name: 'Clean High Contrast', filter: 'contrast(1.1)' },
    animationPreset: 'pop',
    animation: { mass: 0.5, damping: 14, stiffness: 180, scaleEntrance: [0.9, 1.0], blurEntrance: [10, 0] },
  },
};

export const ADVANCED_STYLE_BLUEPRINTS: Record<string, AdvancedStyleBlueprint> = {};

export function getAdvancedStyleBlueprint(styleId?: string): AdvancedStyleBlueprint | null {
  const targetId = (styleId || 'vox-giant-stagger').toLowerCase().trim();
  const found = ADVANCED_STYLE_BLUEPRINTS[targetId];

  if (!found && process.env.NODE_ENV !== 'production') {
    // In dev mode, ensure a clean fallback blueprint object is constructed if missing
    return {
      metadata: {
        styleId: targetId,
        demoVideoId: targetId,
        name: targetId.replace(/-/g, ' ').toUpperCase(),
        category: 'kinetic',
        tags: [targetId],
        sourceVideoUrl: '',
        analysisVersion: '2.0',
        analyzedAt: new Date().toISOString(),
        overallConfidence: 0.95,
      },
      pacingAndRhythm: {
        personality: { value: 'fast-kinetic', confidence: 0.9, status: 'DETECTED' },
        rhythmPattern: { value: 'word-slam', confidence: 0.9, status: 'DETECTED' },
        targetWordsPerPhrase: 3,
        averagePhraseDurationSec: 1.5,
        transitionFrequencyPerMinute: 40,
        speechSyncMode: 'word-locked',
        motionIntensity: { value: 'punchy', confidence: 0.9, status: 'DETECTED' },
      },
      typography: {
        fontCategory: { value: 'bold-geometric-sans', confidence: 0.9, status: 'DETECTED' },
        fontFamilyEstimate: { value: 'Impact, sans-serif', confidence: 0.9, status: 'DETECTED' },
        heroTreatment: { casing: 'uppercase', fontWeight: 900, relativeScale: 1.5, letterSpacingRatio: 0.04, lineHeightRatio: 1.1, opacity: 1 },
        leadTreatment: { casing: 'uppercase', fontWeight: 700, relativeScale: 1.0, letterSpacingRatio: 0.02, lineHeightRatio: 1.1, opacity: 0.8 },
        subTreatment: { casing: 'uppercase', fontWeight: 600, relativeScale: 0.7, letterSpacingRatio: 0.02, lineHeightRatio: 1.1, opacity: 0.6 },
        hierarchyLevels: ['hero', 'lead'],
        textDensity: { value: 'compact-phrases', confidence: 0.9, status: 'DETECTED' },
        wordGroupingRule: '2-4-balanced',
        lineBreakPolicy: 'word-wrap',
      },
      composition: {
        layoutStructure: { value: 'single-hero', confidence: 0.9, status: 'DETECTED' },
        anchor: { xRatio: 0.5, yRatio: 0.5, horizontalAlign: 'center', verticalAlign: 'center' },
        safeZoneMargins: { topRatio: 0.1, bottomRatio: 0.1, leftRatio: 0.05, rightRatio: 0.05 },
        aspectRatioAdaptation: {
          portrait_9_16: { yRatio: 0.5, xRatio: 0.5, scaleMultiplier: 1.0, maxLineWidthRatio: 0.9, alignment: 'center' },
          landscape_16_9: { yRatio: 0.5, xRatio: 0.5, scaleMultiplier: 1.0, maxLineWidthRatio: 0.9, alignment: 'center' },
          square_1_1: { yRatio: 0.5, xRatio: 0.5, scaleMultiplier: 1.0, maxLineWidthRatio: 0.9, alignment: 'center' },
        },
      },
      subjectRelationship: {} as any,
      animation: {} as any,
      color: {} as any,
      emphasisRules: [],
      styleVariants: {} as any,
      soundSync: {} as any,
      trackedEvents: [],
      sampleKeyframes: [],
      validation: { typographyConsistencyScore: 100, motionConsistencyScore: 100, colorConsistencyScore: 100, compositionScore: 100, distinctivenessScore: 100, status: 'valid', notes: [] },
    };
  }

  return found || null;
}

export function getStyleBlueprint(styleId?: string): StyleBlueprint {
  if (styleId && STYLE_BLUEPRINTS[styleId]) return STYLE_BLUEPRINTS[styleId];
  return STYLE_BLUEPRINTS['apple-keynote-punch'];
}
