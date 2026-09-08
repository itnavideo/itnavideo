/**
 * Director Brain — The production intelligence layer
 *
 * Integrates all AI Director subsystems into one coherent "Director Loop":
 * - Rule-based: branding, safe zones, contrast, aspect ratios
 * - AI-based: creative decisions (Gemini scene planning, pacing, visual mode)
 * - Deterministic: final render reliability
 *
 * Professional Editing Principles enforced:
 * 1. Information Hierarchy: one focal point per frame
 * 2. Pacing: no static shots >3s unless atmospheric; high density = faster cuts
 * 3. Visual Continuity: consistent color grading + motion curve
 */

import type { DirectedScene, SceneIntent } from './sceneDirector';
import type { KineticText } from './typographyPipeline';

// ── Types ─────────────────────────────────────────────────────────────────────

export type VisualMode =
  | 'cinematic_broll'       // Emotional/atmospheric — evocative adjectives
  | 'infographic_data'      // High complexity/abstract — stats, charts, comparisons
  | 'facecam_callout'       // Speaker-centric — key points needing human connection
  | 'ui_mockup'             // Process explanation — how-to, steps
  | 'quote_card'            // Value explanation — why, philosophy
  | 'split_screen'          // Comparison/contrast — vs, before/after
  | 'text_only';            // Pure typography — headlines, CTAs

export type NarrativeDensity = 'high' | 'medium' | 'low';

export type PacingDecision = {
  minDurationSeconds: number;
  maxDurationSeconds: number;
  cutStyle: 'hard' | 'dissolve' | 'motivated';
  reason: string;
};

export type ColorGrade = {
  temperature: number;    // -1 (cool) to 1 (warm)
  contrast: number;       // 0.8–1.3
  saturation: number;     // 0.7–1.2
  brightness: number;     // 0.9–1.1
  tint: string;           // hex overlay color
  tintOpacity: number;    // 0–0.15
};

export type VisualContinuity = {
  colorGrade: ColorGrade;
  motionCurve: 'smooth_cinematic' | 'snappy_creator' | 'gentle_documentary' | 'energetic_fast';
  transitionConsistency: 'all_dissolve' | 'all_cut' | 'motivated_mix';
};

export type DirectorDecision = {
  sceneId: number;
  visualMode: VisualMode;
  narrativeDensity: NarrativeDensity;
  pacing: PacingDecision;
  focalPoint: 'text' | 'visual' | 'balanced';
  hierarchyRule: string;
};

// ── 1. Narrative Density Detection ────────────────────────────────────────────

const DATA_KEYWORDS = /\b(percent|%|million|billion|growth|increase|decrease|data|chart|graph|statistic|number|compare|ratio|metric|kpi|revenue|profit|loss|market|rate)\b/i;
const EMOTIONAL_KEYWORDS = /\b(feel|heart|soul|dream|imagine|remember|moment|beautiful|incredible|amazing|journey|story|legacy|passion|love|hope|believe)\b/i;
const PROCESS_KEYWORDS = /\b(step|first|second|third|then|next|how to|process|method|system|workflow|setup|install|configure|click|open|select|create)\b/i;
const VALUE_KEYWORDS = /\b(why|because|reason|value|benefit|important|matter|purpose|mission|vision|philosophy|principle)\b/i;

export function detectVisualMode(text: string, intent: SceneIntent): VisualMode {
  const normalized = text.toLowerCase();

  // Data/statistics → infographic
  if (DATA_KEYWORDS.test(normalized)) return 'infographic_data';

  // Process/how-to → UI mockup
  if (PROCESS_KEYWORDS.test(normalized)) return 'ui_mockup';

  // Value/philosophy → quote card
  if (VALUE_KEYWORDS.test(normalized) && normalized.length < 80) return 'quote_card';

  // Intent-based fallback
  switch (intent) {
    case 'compare_contrast': return 'split_screen';
    case 'establish_atmosphere': return 'cinematic_broll';
    case 'call_to_action': return 'text_only';
    case 'emphasize_point': return normalized.length < 40 ? 'text_only' : 'facecam_callout';
    default: break;
  }

  // Emotional content → cinematic b-roll
  if (EMOTIONAL_KEYWORDS.test(normalized)) return 'cinematic_broll';

  // Default: cinematic b-roll (safest professional choice)
  return 'cinematic_broll';
}

export function detectNarrativeDensity(text: string, durationSeconds: number): NarrativeDensity {
  const words = text.split(/\s+/).filter(Boolean).length;
  const wordsPerSecond = words / Math.max(0.5, durationSeconds);

  if (wordsPerSecond > 3.5) return 'high';
  if (wordsPerSecond > 2.0) return 'medium';
  return 'low';
}

// ── 2. Pacing Engine ──────────────────────────────────────────────────────────

/**
 * The "1.5-Second Rule": High density = fast cuts; low density = hold longer.
 * No static shot >5s unless intentionally atmospheric.
 */
export function calculatePacing(
  density: NarrativeDensity,
  intent: SceneIntent,
  visualMode: VisualMode,
): PacingDecision {
  // Atmospheric scenes can hold longer
  if (intent === 'establish_atmosphere') {
    return { minDurationSeconds: 3, maxDurationSeconds: 6, cutStyle: 'dissolve', reason: 'atmospheric_hold' };
  }

  // High density: fast cuts (1.5–3s)
  if (density === 'high') {
    return { minDurationSeconds: 1.5, maxDurationSeconds: 3, cutStyle: 'hard', reason: 'high_density_fast_cut' };
  }

  // Data/infographic: needs reading time
  if (visualMode === 'infographic_data' || visualMode === 'quote_card') {
    return { minDurationSeconds: 3, maxDurationSeconds: 5, cutStyle: 'dissolve', reason: 'reading_time' };
  }

  // Medium density: moderate pacing
  if (density === 'medium') {
    return { minDurationSeconds: 2.5, maxDurationSeconds: 4, cutStyle: 'motivated', reason: 'medium_pace' };
  }

  // Low density: relaxed
  return { minDurationSeconds: 3, maxDurationSeconds: 5, cutStyle: 'dissolve', reason: 'low_density_breathe' };
}

// ── 3. Information Hierarchy Enforcer ─────────────────────────────────────────

/**
 * One focal point per frame.
 * If text is prominent → visual recedes (darken/blur background)
 * If visual is prominent → text is minimal (lower-third only)
 */
export function enforceHierarchy(
  visualMode: VisualMode,
  textImportance: number,
  textLength: number,
): { focalPoint: 'text' | 'visual' | 'balanced'; backgroundTreatment: string; textMaxOpacity: number } {
  // Text-dominant scenes
  if (visualMode === 'text_only' || visualMode === 'quote_card') {
    return { focalPoint: 'text', backgroundTreatment: 'darken_heavy', textMaxOpacity: 1.0 };
  }

  // If the text is long/important, it takes focus
  if (textImportance > 0.7 && textLength > 30) {
    return { focalPoint: 'text', backgroundTreatment: 'darken_medium', textMaxOpacity: 0.95 };
  }

  // Visual-dominant: cinematic b-roll, data visualization
  if (visualMode === 'cinematic_broll' && textImportance < 0.5) {
    return { focalPoint: 'visual', backgroundTreatment: 'none', textMaxOpacity: 0.7 };
  }

  // Balanced
  return { focalPoint: 'balanced', backgroundTreatment: 'darken_light', textMaxOpacity: 0.88 };
}

// ── 4. Visual Continuity System ───────────────────────────────────────────────

/**
 * Ensures consistent color grading and motion curve across all scenes.
 * No scene should feel like a "random clip" — they all belong to one world.
 */
export function buildVisualContinuity(
  topicTitle: string,
  transcript: string,
  sceneCount: number,
): VisualContinuity {
  const text = `${topicTitle} ${transcript}`.toLowerCase();

  // Finance/business → cool trust grading, smooth motion
  if (/finance|business|corporate|investment|money|bank|revenue|profit/.test(text)) {
    return {
      colorGrade: { temperature: -0.2, contrast: 1.05, saturation: 0.85, brightness: 0.98, tint: '#1E3A5F', tintOpacity: 0.06 },
      motionCurve: 'smooth_cinematic',
      transitionConsistency: 'all_dissolve',
    };
  }

  // Education/documentary → clean, neutral grading
  if (/education|learn|history|documentary|explain|science|research/.test(text)) {
    return {
      colorGrade: { temperature: 0, contrast: 1.0, saturation: 0.92, brightness: 1.0, tint: '#2D3748', tintOpacity: 0.04 },
      motionCurve: 'gentle_documentary',
      transitionConsistency: 'all_dissolve',
    };
  }

  // Tech/startup → cyan-cool, snappy
  if (/tech|startup|ai|software|app|developer|code|saas|product/.test(text)) {
    return {
      colorGrade: { temperature: -0.15, contrast: 1.08, saturation: 0.9, brightness: 0.97, tint: '#0F172A', tintOpacity: 0.05 },
      motionCurve: 'snappy_creator',
      transitionConsistency: 'motivated_mix',
    };
  }

  // Creator/energetic → warm, high contrast, fast
  if (/creator|viral|reel|tiktok|instagram|trending|content|vlog/.test(text)) {
    return {
      colorGrade: { temperature: 0.1, contrast: 1.12, saturation: 1.05, brightness: 1.02, tint: '#1A1A2E', tintOpacity: 0.03 },
      motionCurve: 'energetic_fast',
      transitionConsistency: 'all_cut',
    };
  }

  // Default: cinematic neutral
  return {
    colorGrade: { temperature: 0, contrast: 1.04, saturation: 0.95, brightness: 1.0, tint: '#1E293B', tintOpacity: 0.04 },
    motionCurve: 'smooth_cinematic',
    transitionConsistency: 'motivated_mix',
  };
}

// ── 5. Constraint Checker ─────────────────────────────────────────────────────

export type ConstraintViolation = {
  type: 'safe_zone_overlap' | 'low_contrast' | 'text_too_long' | 'pacing_violation' | 'hierarchy_conflict';
  severity: 'error' | 'warning';
  message: string;
  fix: string;
};

/**
 * Validate the entire scene plan against professional editing constraints.
 */
export function checkConstraints(
  scenes: DirectedScene[],
  kineticText: KineticText[],
  durationSeconds: number,
): ConstraintViolation[] {
  const violations: ConstraintViolation[] = [];

  // Check pacing: no scene >5s without atmospheric intent
  for (const scene of scenes) {
    const sceneDuration = scene.endTime - scene.startTime;
    if (sceneDuration > 5 && scene.intent !== 'establish_atmosphere') {
      violations.push({
        type: 'pacing_violation',
        severity: 'warning',
        message: `Scene ${scene.scene} holds for ${sceneDuration.toFixed(1)}s without atmospheric intent`,
        fix: 'Split into sub-scenes or add visual variation',
      });
    }
  }

  // Check text length: caption >15 words is too dense for one frame
  for (const phrase of kineticText) {
    const wordCount = phrase.text.split(/\s+/).length;
    if (wordCount > 15) {
      violations.push({
        type: 'text_too_long',
        severity: 'warning',
        message: `Phrase "${phrase.text.slice(0, 40)}..." has ${wordCount} words — too dense for single frame`,
        fix: 'Break into multiple kinetic text segments',
      });
    }
  }

  // Check information hierarchy: if text and visual are both "loud"
  for (const phrase of kineticText) {
    if (phrase.importance > 0.8 && phrase.fontSize > 60) {
      const scene = scenes.find((s) => phrase.startTime >= s.startTime && phrase.startTime < s.endTime);
      if (scene && scene.visualType === 'cinematic_landscape') {
        violations.push({
          type: 'hierarchy_conflict',
          severity: 'warning',
          message: `High-importance text competes with cinematic visual at ${phrase.startTime.toFixed(1)}s`,
          fix: 'Darken background or reduce text size to establish clear focal point',
        });
      }
    }
  }

  return violations;
}

// ── 6. Full Director Decision Pipeline ────────────────────────────────────────

/**
 * Run the full Director Brain for a scene: visual mode, density, pacing, hierarchy.
 */
export function makeDirectorDecision(
  scene: DirectedScene,
  sceneText: string,
  textImportance: number,
): DirectorDecision {
  const visualMode = detectVisualMode(sceneText, scene.intent);
  const narrativeDensity = detectNarrativeDensity(sceneText, scene.endTime - scene.startTime);
  const pacing = calculatePacing(narrativeDensity, scene.intent, visualMode);
  const hierarchy = enforceHierarchy(visualMode, textImportance, sceneText.length);

  return {
    sceneId: scene.scene,
    visualMode,
    narrativeDensity,
    pacing,
    focalPoint: hierarchy.focalPoint,
    hierarchyRule: `${hierarchy.focalPoint}_focal:bg=${hierarchy.backgroundTreatment}:textOpacity=${hierarchy.textMaxOpacity}`,
  };
}
