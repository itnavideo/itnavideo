// lib/captions/types.ts
// Core data models and interfaces for the Professional Motion Caption Engine

export type CaptionWordRole = 'hero' | 'secondary' | 'lead' | 'neutral';

export type CaptionPhraseType = 'statement' | 'question' | 'punchline' | 'climax' | 'continuation';

export type SpeechSpeed = 'fast' | 'normal' | 'slow';

export type CaptionAnchorPosition = 'bottom-center' | 'center' | 'top-center' | 'dynamic-safe';

export type LineDistributionMode = 'single-line' | 'stacked-hero' | 'balanced-2line' | 'badge-pill';

export type MotionFamily =
  | 'kinetic-slam'
  | 'editorial-rise'
  | 'cyber-glitch'
  | 'elastic-pop'
  | 'smooth-fade'
  | 'paper-stamp'
  | 'shimmer-drift';

export interface CaptionWordEvent {
  id: string;
  word: string;
  cleanWord: string;
  start: number;
  end: number;
  duration: number;
  role: CaptionWordRole;
  emphasisScore: number; // 0.0 to 1.0
  isEdited?: boolean;
  customColor?: string;
  customScale?: number;
}

export interface CaptionLayoutConfig {
  anchor: CaptionAnchorPosition;
  verticalOffsetPct: number; // e.g., 74 for lower third, 50 for center
  maxLineWidthPx: number;
  lineDistribution: LineDistributionMode;
  safeMarginBottomPct: number;
  textAlign: 'center' | 'left' | 'right';
}

export interface CaptionTypographyConfig {
  heroFont: string;
  leadFont: string;
  heroWeight: number;
  leadWeight: number;
  heroSizePx: number;
  leadSizePx: number;
  letterSpacingEm: number;
  lineHeight: number;
  textTransform: 'uppercase' | 'title' | 'none';
}

export interface CaptionMotionConfig {
  family: MotionFamily;
  mass: number;
  damping: number;
  stiffness: number;
  scaleEntrance: [number, number];
  translateYEntrancePx: [number, number];
  blurEntrancePx: [number, number];
  exitStyle: 'whip-up' | 'fade-out' | 'scale-down' | 'none';
  exitDurationFrames: number;
  wordStaggerFrames?: number;
  glitchJitter?: boolean;
}

export interface CaptionEffectsConfig {
  stylePreset: string;
  textColor: string;
  highlightColor: string;
  accentColor: string;
  textShadow: string;
  textStroke?: string;
  gradient?: string;
  containerBackground?: string;
  containerBorder?: string;
  containerBackdropBlurPx?: number;
  containerTiltDeg?: number;
  badgePadding?: string;
  badgeRadiusPx?: number;
  glowStack?: string[];
}

export interface CaptionLayeringConfig {
  depthTier: 'foreground' | 'behind-subject' | 'ambient';
  occlusionProtection: boolean;
}

export interface CaptionEvent {
  id: string;
  start: number;
  end: number;
  duration: number;
  text: string;
  words: CaptionWordEvent[];
  
  // Semantic classification
  phraseType: CaptionPhraseType;
  speechSpeed: SpeechSpeed;
  
  // Staging layers
  leadText?: string;
  heroText?: string;
  subText?: string;
  
  // Subsystems
  layout: CaptionLayoutConfig;
  typography: CaptionTypographyConfig;
  motion: CaptionMotionConfig;
  effects: CaptionEffectsConfig;
  layering: CaptionLayeringConfig;
}

export interface TranscriptWordItem {
  id: string;
  word: string;
  start: number;
  end: number;
  confidence?: number;
  isEdited?: boolean;
  isInserted?: boolean;
}

export interface TranscriptDocument {
  id: string;
  rawTranscript: string;
  editedTranscript: string;
  words: TranscriptWordItem[];
  language?: string;
  durationSeconds: number;
  version: 'v1-ai' | 'v2-user' | 'v3-approved';
  updatedAt: number;
}

export interface StyleSystemPreset {
  id: string;
  name: string;
  category: 'viral' | 'luxury' | 'cyber' | 'tactile' | 'saas' | 'editorial' | 'industrial';
  description: string;
  defaultTypography: {
    heroFont: string;
    leadFont: string;
    heroWeight: number;
    leadWeight: number;
    letterSpacingEm: number;
    lineHeight: number;
    textTransform: 'uppercase' | 'title' | 'none';
  };
  defaultMotion: CaptionMotionConfig;
  defaultEffects: CaptionEffectsConfig;
  defaultLayout: CaptionLayoutConfig;
}
