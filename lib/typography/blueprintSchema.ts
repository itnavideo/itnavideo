/**
 * Advanced Typography Style Blueprint Schema
 *
 * Defines the complete, resolution-independent, machine-readable visual design system
 * reverse-engineered from reference typography motion-graphics videos.
 */

export type PropertyConfidenceLevel = 'DETECTED' | 'ESTIMATED' | 'INFERRED';

export interface ConfidentValue<T> {
  value: T;
  confidence: number; // 0.0 to 1.0
  status: PropertyConfidenceLevel;
  basis?: string; // Evidence basis (e.g., "temporal frame delta", "ocr bounding box", "gemini vision")
}

// ── 1. Style Metadata ─────────────────────────────────────────────────────────

export interface StyleMetadata {
  styleId: string;
  demoVideoId: string;
  name: string;
  category: 'kinetic' | 'depth' | 'luxury' | 'minimal' | 'editorial' | 'social-media' | 'cyber-tech' | 'paper-collage';
  tags: string[];
  sourceVideoUrl: string;
  posterUrl?: string;
  analysisVersion: string;
  analyzedAt: string;
  overallConfidence: number;
}

// ── 2. Style Identity & Temporal Rhythm ───────────────────────────────────────

export type StylePersonality =
  | 'fast-kinetic'
  | 'medium-paced'
  | 'slow-cinematic'
  | 'editorial-luxury'
  | 'minimal-monochrome'
  | 'aggressive-impact'
  | 'energetic-punch'
  | 'cyber-tech'
  | 'paper-collage'
  | 'corporate-clean';

export type RhythmPattern =
  | 'word-slam'
  | 'phrase-stagger'
  | 'step-reveal'
  | 'keynote-hook'
  | 'stacked-block'
  | 'callout-pill'
  | 'continuous-flow';

export interface StylePacingAndRhythm {
  personality: ConfidentValue<StylePersonality>;
  rhythmPattern: ConfidentValue<RhythmPattern>;
  targetWordsPerPhrase: number; // e.g. 1 to 4 words
  averagePhraseDurationSec: number; // e.g. 1.1s to 2.8s
  transitionFrequencyPerMinute: number;
  speechSyncMode: 'word-locked' | 'beat-locked' | 'phrase-cadence';
  motionIntensity: ConfidentValue<'explosive' | 'punchy' | 'smooth-cinematic' | 'minimal-subtle'>;
}

// ── 3. Typography System & Hierarchy ─────────────────────────────────────────

export type FontClassification =
  | 'bold-geometric-sans'
  | 'luxury-serif'
  | 'display-heavy'
  | 'modern-editorial-serif'
  | 'condensed-sans'
  | 'tech-mono'
  | 'handwritten-script'
  | 'clean-grotesque';

export type TextCasing = 'uppercase' | 'capitalize' | 'lowercase' | 'natural';

export interface FontTierTreatment {
  casing: TextCasing;
  fontWeight: number; // 100 to 900
  fontStyle?: 'normal' | 'italic';
  relativeScale: number; // normalized scale ratio (1.0 = standard, 1.8 = hero slam, 0.7 = lead)
  letterSpacingRatio: number; // e.g. -0.04 to 0.15 relative to font size
  lineHeightRatio: number; // e.g. 1.05 to 1.35
  opacity: number;
}

export interface TypographySystem {
  fontCategory: ConfidentValue<FontClassification>;
  fontFamilyEstimate: ConfidentValue<string>;
  heroTreatment: FontTierTreatment;
  leadTreatment: FontTierTreatment;
  subTreatment: FontTierTreatment;
  hierarchyLevels: Array<'hero' | 'lead' | 'sub' | 'badge' | 'watermark' | 'metric'>;
  textDensity: ConfidentValue<'minimal-single-word' | 'compact-phrases' | 'dense-stack'>;
  wordGroupingRule: '1-2-rapid' | '2-4-balanced' | '4-tier-stack' | 'hook-plus-context' | 'step-columns';
  lineBreakPolicy: 'word-wrap' | 'balanced-stack' | 'single-line-clamp';
}

// ── 4. Composition System & Responsive Layout ─────────────────────────────────

export type LayoutStructure =
  | 'single-hero'
  | 'stacked-vertical'
  | 'split-lead-hero'
  | 'pill-capsule'
  | 'framed-quote'
  | 'corner-badge-hero'
  | 'step-columns';

export interface NormalizedAnchor {
  xRatio: number; // 0.0 (left) to 1.0 (right), 0.5 = center
  yRatio: number; // 0.0 (top) to 1.0 (bottom), 0.68 = lower third
  horizontalAlign: 'left' | 'center' | 'right';
  verticalAlign: 'top' | 'center' | 'bottom';
}

export interface AspectRatioAdaptation {
  yRatio: number;
  xRatio: number;
  scaleMultiplier: number;
  maxLineWidthRatio: number; // fraction of canvas width (e.g. 0.88)
  alignment: 'left' | 'center' | 'right';
}

export interface CompositionSystem {
  layoutStructure: ConfidentValue<LayoutStructure>;
  anchor: NormalizedAnchor;
  safeZoneMargins: {
    topRatio: number;
    bottomRatio: number;
    leftRatio: number;
    rightRatio: number;
  };
  aspectRatioAdaptation: {
    portrait_9_16: AspectRatioAdaptation;
    landscape_16_9: AspectRatioAdaptation;
    square_1_1: AspectRatioAdaptation;
  };
  negativeSpaceRatio: number;
  isEdgeToEdge: boolean;
}

// ── 5. Subject-Aware Relationship & Depth Layering ────────────────────────────

export type SubjectAwarenessMode =
  | 'avoids-face'
  | 'depth-behind-subject'
  | 'foreground-floating'
  | 'anchored-to-speaker'
  | 'full-canvas-hero';

export type LayerPlacement = 'behind-subject' | 'in-front-subject' | 'sandwich' | 'background-only';

export interface SubjectRelationship {
  awarenessMode: ConfidentValue<SubjectAwarenessMode>;
  layerPlacement: ConfidentValue<LayerPlacement>;
  collisionAvoidance: {
    enabled: boolean;
    headroomSafetyRatio: number;
    faceAvoidanceWeight: number; // 0.0 to 1.0
  };
  speakerPositionTracking: boolean;
  hasPillBackdropAroundSubject: boolean;
  requiresSubjectCutout: boolean;
}

// ── 6. Motion & Animation System ──────────────────────────────────────────────

export type EntranceMotionType =
  | 'slam-scale'
  | 'rise-fade'
  | 'pop-spring'
  | 'glow-pulse'
  | 'slide-mask'
  | 'typewriter'
  | 'smooth-fade'
  | 'torn-paper-slap'
  | 'step-reveal'
  | 'kinetic-whip';

export type MotionEasing =
  | 'spring-bouncy'
  | 'ease-out-expo'
  | 'linear-kinetic'
  | 'smooth-bezier'
  | 'elastic-snap';

export interface MotionParameters {
  type: ConfidentValue<EntranceMotionType>;
  easing: ConfidentValue<MotionEasing>;
  durationSeconds: number; // e.g. 0.18s to 0.42s
  delaySeconds?: number;
  scaleRange: [number, number]; // e.g. [0.8, 1.0] or [1.35, 1.0]
  opacityRange: [number, number]; // e.g. [0.0, 1.0]
  translateYRangeRatio?: [number, number]; // e.g. [0.06, 0.0]
  rotationRangeDeg?: [number, number]; // e.g. [-4, 0]
}

export interface ActiveMotionBehavior {
  type: 'subtle-breathe' | 'shimmer-sweep' | 'glow-flicker' | 'none';
  intensity: number; // 0.0 to 1.0
}

export interface ExitMotionBehavior {
  type: 'quick-fade' | 'scale-down' | 'slide-out' | 'none';
  durationSeconds: number;
}

export interface AnimationSystem {
  entrance: MotionParameters;
  active: ActiveMotionBehavior;
  exit: ExitMotionBehavior;
  wordByWordStagger: boolean;
  staggerDelaySeconds: number;
  motionIntensity: 'explosive' | 'punchy' | 'smooth-cinematic' | 'minimal-subtle';
}

// ── 7. Color & Visual Treatment ───────────────────────────────────────────────

export interface VisualEffects {
  hasStroke: boolean;
  strokeColor?: string;
  strokeWidthRatio?: number; // relative to font size

  hasGlow: boolean;
  glowColor?: string;
  glowRadiusPx?: number;

  hasDropShadow: boolean;
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;

  hasGlassBackdrop: boolean;
  glassBlurPx?: number;
  backdropColor?: string;

  hasTapeBadge: boolean;
  tapeBadgeColor?: string;
  tapeBadgeRotationDeg?: number;

  hasGradientShimmer: boolean;
  gradientColors?: string[];
}

export interface ColorSystem {
  primaryTextColor: ConfidentValue<string>;
  secondaryTextColor: ConfidentValue<string>;
  accentColor: ConfidentValue<string>;
  secondaryAccentColor: ConfidentValue<string>;
  backgroundColor: string;
  colorGrade: {
    name: string;
    filter: string;
    contrast: number;
    saturation: number;
    brightness: number;
  };
  effects: VisualEffects;
  contrastRatioEstimate: number;
}

// ── 8. Emphasis & Semantic Triggers ───────────────────────────────────────────

export type EmphasisTrigger =
  | 'power-words'
  | 'metrics-numbers'
  | 'questions'
  | 'cta'
  | 'quotes'
  | 'contrast-keywords';

export type EmphasisVisualTreatment =
  | 'contrast-color'
  | 'scale-pop'
  | 'tape-badge'
  | 'glowing-box'
  | '3d-pill'
  | 'sparkle-icon'
  | 'underline-draw';

export interface EmphasisRule {
  trigger: EmphasisTrigger;
  visualTreatment: EmphasisVisualTreatment;
  scaleMultiplier: number;
  accentColorOverride?: string;
  iconType?: 'sparkle' | 'star' | 'checkmark' | 'speedometer' | 'question' | 'none';
}

// ── 9. Style Variants (Multiple Visual States in One Demo) ────────────────────

export type VisualStateSceneRole = 'hook' | 'statement' | 'emphasis' | 'keyword' | 'transition' | 'conclusion';

export interface StyleVariantRule {
  role: VisualStateSceneRole;
  scaleMultiplier: number;
  entranceOverride?: EntranceMotionType;
  positionOverride?: NormalizedAnchor;
  highlightTreatment?: EmphasisVisualTreatment;
  casingOverride?: TextCasing;
}

// ── 10. Sound Sync & Audio Cues ───────────────────────────────────────────────

export type SfxPersonality =
  | 'heavy-thud-pop'
  | 'crisp-whoosh'
  | 'gold-luxury-chime'
  | 'cyber-data-scan'
  | 'paper-flip'
  | 'soft-bubble';

export interface SoundCueSystem {
  personality: SfxPersonality;
  primaryHitType: string;
  secondaryHitType: string;
  defaultVolume: number;
  duckingEnabled: boolean;
}

// ── 11. Temporal Typography Events (Tracked Elements across Time) ─────────────

export interface TransitionRamp {
  startSec: number;
  endSec: number;
  durationSec: number;
  deltaScale: number;
  deltaOpacity: number;
  deltaYRatio: number;
  inferredEasing: MotionEasing;
}

export interface TypographyEvent {
  id: string;
  startTime: number;
  endTime: number;
  duration: number;
  text: string;
  heroKeyword?: string;
  hierarchy: 'hero' | 'lead' | 'sub' | 'badge' | 'metric';
  styleRole: VisualStateSceneRole;
  emphasisType: EmphasisVisualTreatment;
  entrance: {
    type: EntranceMotionType;
    ramp: TransitionRamp;
  };
  activeMotion: 'subtle-breathe' | 'shimmer-sweep' | 'glow-flicker' | 'static-hold';
  exit: {
    type: 'quick-fade' | 'scale-down' | 'slide-out' | 'none';
    durationSec: number;
  };
  normalizedBoundingBox: {
    xRatio: number;
    yRatio: number;
    widthRatio: number;
    heightRatio: number;
  };
  detectedColors: string[];
  layerPlacement: LayerPlacement;
}

// ── 12. Frame Detections & Validation ─────────────────────────────────────────

export interface KeyframeDetection {
  timestampSeconds: number;
  frameIndex: number;
  detectedText: string;
  primaryHeroWord?: string;
  visualStateDescription: string;
  ocrConfidence: number;
  detectedColors: string[];
  boundingBox?: {
    xRatio: number;
    yRatio: number;
    widthRatio: number;
    heightRatio: number;
  };
  visualStateRole?: VisualStateSceneRole;
  isTransitionPeak?: boolean;
}

export interface BlueprintValidationReport {
  typographyConsistencyScore: number; // 0 to 100
  motionConsistencyScore: number; // 0 to 100
  colorConsistencyScore: number; // 0 to 100
  compositionScore: number; // 0 to 100
  distinctivenessScore: number; // 0 to 100 (uniqueness vs other styles)
  status: 'valid' | 'flagged_for_review' | 're_analyzed';
  notes: string[];
}

// ── Complete Master Style Blueprint ───────────────────────────────────────────

export interface AdvancedStyleBlueprint {
  metadata: StyleMetadata;
  pacingAndRhythm: StylePacingAndRhythm;
  typography: TypographySystem;
  composition: CompositionSystem;
  subjectRelationship: SubjectRelationship;
  animation: AnimationSystem;
  color: ColorSystem;
  emphasisRules: EmphasisRule[];
  styleVariants: Record<VisualStateSceneRole, StyleVariantRule>;
  soundSync: SoundCueSystem;
  trackedEvents: TypographyEvent[];
  sampleKeyframes: KeyframeDetection[];
  validation: BlueprintValidationReport;
}
