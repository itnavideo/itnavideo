/**
 * Typography Style Blueprint Validation & Differentiation Engine
 *
 * Validates individual blueprints for structural consistency, and runs cross-style
 * differentiation checks across all analyzed demo styles to ensure each demo produces
 * a genuinely distinct visual design and motion system.
 */

import type {
  AdvancedStyleBlueprint,
  BlueprintValidationReport,
} from '@/lib/typography/blueprintSchema';

export interface StylePairComparison {
  styleA: string;
  styleB: string;
  similarityScore: number; // 0.0 (totally different) to 1.0 (identical duplicate)
  isSuspiciouslySimilar: boolean;
  differingDimensions: string[];
  identicalDimensions: string[];
}

export interface BatchValidationSummary {
  totalAnalyzed: number;
  validCount: number;
  flaggedCount: number;
  overallHealthScore: number;
  pairComparisons: StylePairComparison[];
  distinctivenessMatrix: Record<string, number>; // styleId -> distinctiveness score (0 to 100)
}

/**
 * Validates an individual Style Blueprint for structural integrity and property confidence
 */
export function validateBlueprint(blueprint: AdvancedStyleBlueprint): BlueprintValidationReport {
  const notes: string[] = [];
  let typoScore = 90;
  let motionScore = 90;
  let colorScore = 95;
  let compScore = 92;

  if (!blueprint.typography?.fontCategory?.value) {
    typoScore -= 25;
    notes.push('Missing font category classification.');
  }

  if (!blueprint.animation?.entrance?.type?.value) {
    motionScore -= 30;
    notes.push('Missing entrance animation type.');
  }

  if (!blueprint.color?.accentColor?.value) {
    colorScore -= 20;
    notes.push('Missing accent color definition.');
  }

  if (!blueprint.composition?.anchor) {
    compScore -= 25;
    notes.push('Missing normalized anchor positioning.');
  }

  if (!blueprint.trackedEvents || blueprint.trackedEvents.length === 0) {
    motionScore -= 15;
    notes.push('No temporal Typography Events were tracked.');
  }

  const isFlagged = typoScore < 70 || motionScore < 70 || colorScore < 70 || compScore < 70;

  return {
    typographyConsistencyScore: Math.max(0, typoScore),
    motionConsistencyScore: Math.max(0, motionScore),
    colorConsistencyScore: Math.max(0, colorScore),
    compositionScore: Math.max(0, compScore),
    distinctivenessScore: 90,
    status: isFlagged ? 'flagged_for_review' : 'valid',
    notes,
  };
}

/**
 * Compares two blueprints across 6 key dimensions to calculate their visual similarity
 */
export function compareStylePair(
  a: AdvancedStyleBlueprint,
  b: AdvancedStyleBlueprint
): StylePairComparison {
  const differing: string[] = [];
  const identical: string[] = [];
  let similarityPoints = 0;
  const totalDimensions = 6;

  // 1. Typography & Font Family
  if (
    a.typography.fontCategory.value === b.typography.fontCategory.value &&
    a.typography.fontFamilyEstimate.value.toLowerCase() === b.typography.fontFamilyEstimate.value.toLowerCase()
  ) {
    similarityPoints += 1;
    identical.push('Font Category & Family');
  } else {
    differing.push('Font Category & Family');
  }

  // 2. Entrance Motion & Easing
  if (
    a.animation.entrance.type.value === b.animation.entrance.type.value &&
    a.animation.entrance.easing.value === b.animation.entrance.easing.value
  ) {
    similarityPoints += 1;
    identical.push('Entrance Motion & Easing');
  } else {
    differing.push('Entrance Motion & Easing');
  }

  // 3. Accent Color System
  if (a.color.accentColor.value.toLowerCase() === b.color.accentColor.value.toLowerCase()) {
    similarityPoints += 1;
    identical.push('Accent Color');
  } else {
    differing.push('Accent Color');
  }

  // 4. Composition Layout Structure
  if (a.composition.layoutStructure.value === b.composition.layoutStructure.value) {
    similarityPoints += 1;
    identical.push('Layout Structure');
  } else {
    differing.push('Layout Structure');
  }

  // 5. Subject Layering & Depth
  if (
    a.subjectRelationship.layerPlacement.value === b.subjectRelationship.layerPlacement.value &&
    a.subjectRelationship.awarenessMode.value === b.subjectRelationship.awarenessMode.value
  ) {
    similarityPoints += 1;
    identical.push('Subject Layering & Awareness');
  } else {
    differing.push('Subject Layering & Awareness');
  }

  // 6. Sound Cue & Rhythm Personality
  if (
    a.soundSync.personality === b.soundSync.personality &&
    a.pacingAndRhythm.personality.value === b.pacingAndRhythm.personality.value
  ) {
    similarityPoints += 1;
    identical.push('Rhythm & SFX Personality');
  } else {
    differing.push('Rhythm & SFX Personality');
  }

  const similarityScore = Math.round((similarityPoints / totalDimensions) * 100) / 100;
  const isSuspiciouslySimilar = similarityScore >= 0.75;

  return {
    styleA: a.metadata.styleId,
    styleB: b.metadata.styleId,
    similarityScore,
    isSuspiciouslySimilar,
    differingDimensions: differing,
    identicalDimensions: identical,
  };
}

/**
 * Validates a batch of blueprints, runs full matrix differentiation, and assigns distinctiveness scores
 */
export function validateBlueprintBatch(
  blueprints: AdvancedStyleBlueprint[]
): BatchValidationSummary {
  const comparisons: StylePairComparison[] = [];
  const distinctivenessMap: Record<string, number> = {};

  // Initialize distinctiveness map
  blueprints.forEach((bp) => {
    distinctivenessMap[bp.metadata.styleId] = 100;
  });

  // Compare every pair
  for (let i = 0; i < blueprints.length; i++) {
    for (let j = i + 1; j < blueprints.length; j++) {
      const comp = compareStylePair(blueprints[i], blueprints[j]);
      comparisons.push(comp);

      // Penalize distinctiveness if too similar
      if (comp.similarityScore > 0.5) {
        const penalty = Math.round((comp.similarityScore - 0.5) * 40);
        distinctivenessMap[comp.styleA] = Math.max(40, distinctivenessMap[comp.styleA] - penalty);
        distinctivenessMap[comp.styleB] = Math.max(40, distinctivenessMap[comp.styleB] - penalty);
      }
    }
  }

  // Attach distinctiveness score to individual blueprint validation reports
  blueprints.forEach((bp) => {
    const dist = distinctivenessMap[bp.metadata.styleId] || 90;
    bp.validation.distinctivenessScore = dist;
    if (dist < 60) {
      bp.validation.status = 'flagged_for_review';
      bp.validation.notes.push(`Low distinctiveness score (${dist}%). Verify that this style is not a duplicate.`);
    }
  });

  const validCount = blueprints.filter((b) => b.validation.status === 'valid').length;
  const flaggedCount = blueprints.length - validCount;
  const avgHealth = Math.round(
    blueprints.reduce((sum, b) => sum + (b.validation.distinctivenessScore + b.validation.typographyConsistencyScore) / 2, 0) /
      Math.max(1, blueprints.length)
  );

  return {
    totalAnalyzed: blueprints.length,
    validCount,
    flaggedCount,
    overallHealthScore: avgHealth,
    pairComparisons: comparisons,
    distinctivenessMatrix: distinctivenessMap,
  };
}
