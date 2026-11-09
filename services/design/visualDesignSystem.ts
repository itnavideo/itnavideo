/**
 * Itnavideo Unified Visual Design System Engine
 * Single Source of Truth for visual appearance, typography, colors,
 * backgrounds, SVGs, images, shapes, motion, effects, and depth across all video types.
 *
 * Implements the 12 Core Visual Systems & 3-Tier Resolution Hierarchy:
 * Tier 1: Global Video Theme -> Tier 2: Scene Overrides -> Tier 3: Individual Layer Overrides
 */

// ============================================================================
// SYSTEM 1: COLOR SYSTEM
// ============================================================================

export type ThemeMode = 'light' | 'dark';

export interface ColorPalette {
  id: string;
  name: string;
  mode: ThemeMode;
  /** Primary brand / focus color (e.g. Electric Blue, Emerald, Warm Gold) */
  primary: string;
  /** Secondary supporting color */
  secondary: string;
  /** High-voltage accent for markers, buttons, counters */
  accent: string;
  /** Surface card background */
  surface: string;
  /** Subtle surface for secondary cards & chips */
  surfaceSubtle: string;
  /** Canvas background */
  background: string;
  /** Primary text color with AA/AAA contrast against background/surface */
  text: string;
  /** Muted secondary text color */
  textMuted: string;
  /** Hairline border for cards and dividers */
  border: string;
  /** Strong border for active states */
  borderStrong: string;
  /** Background tint for pill badges */
  badgeBg: string;
  /** Box shadow elevation string */
  shadow: string;
  /** Pill background with subtle alpha */
  pillBg: string;
}

// ============================================================================
// SYSTEM 2: TYPOGRAPHY SYSTEM
// ============================================================================

export type TypographyStyleFamily =
  | 'modern'
  | 'editorial'
  | 'geometric'
  | 'minimal'
  | 'bold'
  | 'professional'
  | 'friendly';

export interface TypographyPair {
  id: TypographyStyleFamily;
  name: string;
  headingFont: string;
  bodyFont: string;
  headingWeight: number | string;
  bodyWeight: number | string;
  bestFor: string;
  letterSpacing: {
    hero: string;
    section: string;
    body: string;
    caption: string;
  };
  lineHeight: {
    hero: number;
    section: number;
    body: number;
    caption: number;
  };
}

export const PREDEFINED_TYPOGRAPHY_PAIRS: Record<TypographyStyleFamily, TypographyPair> = {
  modern: {
    id: 'modern',
    name: 'Modern Clean',
    headingFont: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    bodyFont: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    headingWeight: 700,
    bodyWeight: 400,
    bestFor: 'SaaS, AI, Product explainers',
    letterSpacing: { hero: '-0.03em', section: '-0.02em', body: '-0.01em', caption: '0.04em' },
    lineHeight: { hero: 1.15, section: 1.25, body: 1.45, caption: 1.3 },
  },
  editorial: {
    id: 'editorial',
    name: 'Editorial Magazine',
    headingFont: '"Playfair Display", Georgia, "Times New Roman", serif',
    bodyFont: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    headingWeight: 700,
    bodyWeight: 400,
    bestFor: 'Stories, long-form ideas, personal branding',
    letterSpacing: { hero: '-0.02em', section: '-0.01em', body: '0em', caption: '0.05em' },
    lineHeight: { hero: 1.2, section: 1.3, body: 1.5, caption: 1.3 },
  },
  geometric: {
    id: 'geometric',
    name: 'Geometric Modern',
    headingFont: 'Montserrat, "Plus Jakarta Sans", sans-serif',
    bodyFont: 'Lato, -apple-system, BlinkMacSystemFont, sans-serif',
    headingWeight: 800,
    bodyWeight: 400,
    bestFor: 'Tech explainers, breakdowns, marketing reels',
    letterSpacing: { hero: '-0.02em', section: '-0.01em', body: '0em', caption: '0.06em' },
    lineHeight: { hero: 1.15, section: 1.25, body: 1.45, caption: 1.3 },
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal Corporate',
    headingFont: 'Manrope, -apple-system, BlinkMacSystemFont, sans-serif',
    bodyFont: 'Manrope, -apple-system, BlinkMacSystemFont, sans-serif',
    headingWeight: 700,
    bodyWeight: 400,
    bestFor: 'Business, executive summaries, thought leadership',
    letterSpacing: { hero: '-0.025em', section: '-0.015em', body: '-0.005em', caption: '0.04em' },
    lineHeight: { hero: 1.18, section: 1.26, body: 1.45, caption: 1.3 },
  },
  bold: {
    id: 'bold',
    name: 'Bold Viral Kinetic',
    headingFont: 'Anton, Impact, "Arial Black", sans-serif',
    bodyFont: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    headingWeight: 900,
    bodyWeight: 600,
    bestFor: 'High-retention Shorts, viral hooks, kinetic titles',
    letterSpacing: { hero: '0.02em', section: '0.01em', body: '-0.01em', caption: '0.08em' },
    lineHeight: { hero: 1.05, section: 1.15, body: 1.35, caption: 1.25 },
  },
  professional: {
    id: 'professional',
    name: 'Professional Slate',
    headingFont: '"DM Sans", -apple-system, BlinkMacSystemFont, sans-serif',
    bodyFont: '"DM Sans", -apple-system, BlinkMacSystemFont, sans-serif',
    headingWeight: 700,
    bodyWeight: 400,
    bestFor: 'Finance, real estate, advisory, corporate reports',
    letterSpacing: { hero: '-0.02em', section: '-0.01em', body: '0em', caption: '0.03em' },
    lineHeight: { hero: 1.16, section: 1.28, body: 1.48, caption: 1.3 },
  },
  friendly: {
    id: 'friendly',
    name: 'Friendly Rounded',
    headingFont: 'Nunito, "Plus Jakarta Sans", sans-serif',
    bodyFont: 'Nunito, -apple-system, BlinkMacSystemFont, sans-serif',
    headingWeight: 800,
    bodyWeight: 500,
    bestFor: 'Education, self-help, accessible storytelling, tutorials',
    letterSpacing: { hero: '-0.01em', section: '0em', body: '0.01em', caption: '0.04em' },
    lineHeight: { hero: 1.2, section: 1.3, body: 1.5, caption: 1.35 },
  },
};

// ============================================================================
// SYSTEM 3: TEXT STYLING SYSTEM
// ============================================================================

export type TextStyleEffect =
  | 'solid'
  | 'gradient'
  | 'outline'
  | 'shadow'
  | 'glow'
  | 'highlight'
  | 'underline'
  | 'wordHighlight'
  | 'letterSpacingAnim'
  | 'maskReveal'
  | 'extrusion3D'
  | 'multiLineEmphasis'
  | 'animatedCounter';

export interface TextStyleConfig {
  effect: TextStyleEffect;
  gradientAngleDeg?: number;
  gradientColors?: string[];
  outlineWidth?: number;
  outlineColor?: string;
  glowRadius?: number;
  glowColor?: string;
  highlightColor?: string;
  highlightPadding?: string;
  underlineColor?: string;
  underlineHeight?: number;
  extrusionColor?: string;
  extrusionDepth?: number;
}

// ============================================================================
// SYSTEM 4: BACKGROUND SYSTEM
// ============================================================================

export type BackgroundCategory =
  | 'solid'
  | 'gradient'
  | 'grid'
  | 'dots'
  | 'texture'
  | 'abstract'
  | 'geometric'
  | 'animated'
  | 'atmospheric'
  | 'layered';

export interface BackgroundSystemConfig {
  category: BackgroundCategory;
  primaryColor: string;
  secondaryColor?: string;
  accentColor?: string;
  patternOpacity?: number;
  gridSize?: number;
  dotRadius?: number;
  vignetteOpacity?: number;
  glowCenterX?: number;
  glowCenterY?: number;
}

// ============================================================================
// SYSTEM 5: SVG & VECTOR SYSTEM
// ============================================================================

export type SvgStyleFamily =
  | 'minimal-line'
  | 'flat'
  | 'duotone'
  | 'outline'
  | 'geometric'
  | 'isometric'
  | 'hand-drawn'
  | 'filled-icon'
  | 'thin-stroke-icon'
  | 'bold-stroke-icon'
  | 'monochrome'
  | 'multicolor';

export interface SvgVectorConfig {
  family: SvgStyleFamily;
  strokeWidth: number;
  strokeColor: string;
  fillColor: string;
  accentFillColor?: string;
  cornerRadius?: number;
  lineCap?: 'round' | 'butt' | 'square';
  lineJoin?: 'round' | 'miter' | 'bevel';
  renderIsometric?: boolean;
}

// ============================================================================
// SYSTEM 6: IMAGE STYLING SYSTEM
// ============================================================================

export type ImageMaskShape = 'none' | 'circle' | 'squircle' | 'rounded-rect' | 'custom';
export type ImageBorderTreatment = 'none' | 'subtle' | 'prominent' | 'gradient';
export type ImageOverlayTreatment = 'none' | 'scrim' | 'vignette' | 'tint';

export interface ImageStylingConfig {
  maskShape: ImageMaskShape;
  borderRadius: number;
  borderTreatment: ImageBorderTreatment;
  borderColor: string;
  borderWidth: number;
  overlayTreatment: ImageOverlayTreatment;
  overlayOpacity: number;
  dropShadow: string;
  aspectRatio: '1:1' | '16:9' | '9:16' | '4:5' | 'auto';
  objectFit: 'cover' | 'contain';
}

// ============================================================================
// SYSTEM 7: SHAPE & CONTAINER SYSTEM
// ============================================================================

export type ContainerRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type ContainerBackdrop = 'solid' | 'subtle' | 'frosted-glass' | 'outlined-only';

export interface ShapeContainerConfig {
  radius: ContainerRadius;
  radiusPx: number;
  backdrop: ContainerBackdrop;
  borderStyle: string;
  shadowStyle: string;
  pillPadding: string;
  cardPadding: string;
}

// ============================================================================
// SYSTEM 8: COMPOSITION & LAYOUT SYSTEM
// ============================================================================

export type LayoutArchetype =
  | 'center-focus'
  | 'split-screen'
  | 'top-to-bottom'
  | 'left-right'
  | 'circular'
  | 'full-bleed'
  | 'stacked-cards'
  | 'timeline'
  | 'grid'
  | 'floating-elements';

export interface CompositionLayoutConfig {
  archetype: LayoutArchetype;
  aspectRatio: '9:16' | '16:9';
  safeMarginTop: number;
  safeMarginBottom: number;
  safeMarginX: number;
  contentGap: number;
  alignHorizontal: 'left' | 'center' | 'right';
  alignVertical: 'top' | 'center' | 'bottom';
  collisionAvoidance: boolean;
}

// ============================================================================
// SYSTEM 9: MOTION DESIGN SYSTEM
// ============================================================================

export type TransitionStyle = 'whip-pan' | 'zoom-snap' | 'fade' | 'slide' | 'wipe' | 'glitch';
export type EntranceStyle = 'spring-pop' | 'fade-up' | 'scale-bounce' | 'slide-in';
export type ExitStyle = 'fade-down' | 'scale-shrink' | 'wipe-out';

export interface MotionSystemConfig {
  defaultTransition: TransitionStyle;
  defaultEntrance: EntranceStyle;
  defaultExit: ExitStyle;
  springDamping: number;
  springMass: number;
  springStiffness: number;
  staggerDelayFrames: number;
  transitionDurationFrames: number;
}

// ============================================================================
// SYSTEM 10: EFFECTS SYSTEM
// ============================================================================

export interface EffectsSystemConfig {
  filmGrainOpacity: number; // 0.0 - 0.2
  vignetteStrength: number; // 0.0 - 0.8
  ambientGlowRadius: number;
  ambientGlowColor: string;
  ambientGlowOpacity: number;
  chromaticAberrationOffset: number; // 0 - 6px
  lightLeakOpacity: number; // 0.0 - 0.3
}

// ============================================================================
// SYSTEM 11: DEPTH SYSTEM
// ============================================================================

export interface DepthSystemConfig {
  /** Parallax intensity factor (0.0 = flat, 0.3 = subtle, 0.6 = deep 3D) */
  parallaxFactor: number;
  /** Layer stack order reference */
  zIndexStack: {
    background: number;
    patternTexture: number;
    underlays: number;
    mediaVisuals: number;
    graphicsShapes: number;
    textHeadlines: number;
    annotationsCallouts: number;
    captions: number;
    effectsOverlays: number;
    cameraTransitions: number;
  };
}

export const MASTER_DEPTH_STACK: DepthSystemConfig = {
  parallaxFactor: 0.15,
  zIndexStack: {
    background: 10,
    patternTexture: 20,
    underlays: 30,
    mediaVisuals: 40,
    graphicsShapes: 60,
    textHeadlines: 75,
    annotationsCallouts: 85,
    captions: 95,
    effectsOverlays: 100,
    cameraTransitions: 110,
  },
};

// ============================================================================
// SYSTEM 12: CONSISTENCY SYSTEM (MASTER THEME SCHEMA)
// ============================================================================

export interface VideoVisualTheme {
  id: string;
  name: string;
  description: string;
  colors: ColorPalette;
  typography: TypographyPair;
  textStyling: TextStyleConfig;
  background: BackgroundSystemConfig;
  vectors: SvgVectorConfig;
  images: ImageStylingConfig;
  shapes: ShapeContainerConfig;
  composition: CompositionLayoutConfig;
  motion: MotionSystemConfig;
  effects: EffectsSystemConfig;
  depth: DepthSystemConfig;
}

// ============================================================================
// 6 MASTER PREDEFINED VISUAL THEMES
// ============================================================================

export const MASTER_THEMES: Record<string, VideoVisualTheme> = {
  // 1. MODERN SAAS (Blue & White / Dark Slate, Inter/Manrope, fine grid, thin line icons)
  'modern-saas': {
    id: 'modern-saas',
    name: 'Modern SaaS & AI',
    description: 'Clean high-tech blue palette, Inter typography, technical fine grid, and crisp line icons.',
    colors: {
      id: 'modern-saas-palette',
      name: 'Modern Blue',
      mode: 'dark',
      primary: '#3B82F6',
      secondary: '#60A5FA',
      accent: '#38BDF8',
      surface: '#0F172A',
      surfaceSubtle: '#1E293B',
      background: '#090D16',
      text: '#F8FAFC',
      textMuted: '#94A3B8',
      border: 'rgba(255, 255, 255, 0.10)',
      borderStrong: 'rgba(59, 130, 246, 0.40)',
      badgeBg: 'rgba(59, 130, 246, 0.15)',
      shadow: '0 20px 45px -15px rgba(0, 0, 0, 0.7)',
      pillBg: 'rgba(15, 23, 42, 0.90)',
    },
    typography: PREDEFINED_TYPOGRAPHY_PAIRS.modern,
    textStyling: {
      effect: 'solid',
      outlineWidth: 0,
      glowRadius: 15,
      glowColor: 'rgba(59, 130, 246, 0.35)',
      highlightColor: 'rgba(59, 130, 246, 0.25)',
    },
    background: {
      category: 'grid',
      primaryColor: '#090D16',
      secondaryColor: '#0F172A',
      accentColor: '#3B82F6',
      patternOpacity: 0.12,
      gridSize: 48,
    },
    vectors: {
      family: 'thin-stroke-icon',
      strokeWidth: 2,
      strokeColor: '#38BDF8',
      fillColor: 'transparent',
      accentFillColor: 'rgba(56, 189, 248, 0.15)',
      lineCap: 'round',
      lineJoin: 'round',
    },
    images: {
      maskShape: 'rounded-rect',
      borderRadius: 24,
      borderTreatment: 'subtle',
      borderColor: 'rgba(255, 255, 255, 0.15)',
      borderWidth: 1.5,
      overlayTreatment: 'scrim',
      overlayOpacity: 0.2,
      dropShadow: '0 25px 50px rgba(0,0,0,0.5)',
      aspectRatio: 'auto',
      objectFit: 'cover',
    },
    shapes: {
      radius: 'lg',
      radiusPx: 20,
      backdrop: 'frosted-glass',
      borderStyle: '1px solid rgba(255, 255, 255, 0.12)',
      shadowStyle: '0 15px 35px rgba(0,0,0,0.4)',
      pillPadding: '8px 18px',
      cardPadding: '28px 32px',
    },
    composition: {
      archetype: 'center-focus',
      aspectRatio: '9:16',
      safeMarginTop: 140,
      safeMarginBottom: 220,
      safeMarginX: 80,
      contentGap: 24,
      alignHorizontal: 'center',
      alignVertical: 'center',
      collisionAvoidance: true,
    },
    motion: {
      defaultTransition: 'zoom-snap',
      defaultEntrance: 'spring-pop',
      defaultExit: 'fade-down',
      springDamping: 14,
      springMass: 0.8,
      springStiffness: 120,
      staggerDelayFrames: 4,
      transitionDurationFrames: 12,
    },
    effects: {
      filmGrainOpacity: 0.04,
      vignetteStrength: 0.25,
      ambientGlowRadius: 40,
      ambientGlowColor: '#3B82F6',
      ambientGlowOpacity: 0.2,
      chromaticAberrationOffset: 0,
      lightLeakOpacity: 0.05,
    },
    depth: MASTER_DEPTH_STACK,
  },

  // 2. BOLD KINETIC (Black/White/Yellow, Anton/Inter, punchy fast motion, minimal graphics)
  'bold-kinetic': {
    id: 'bold-kinetic',
    name: 'Bold Viral Kinetic',
    description: 'High-contrast dark obsidian canvas with high-voltage yellow accent, Anton typography, and energetic kinetic motion.',
    colors: {
      id: 'bold-kinetic-palette',
      name: 'High-Voltage Yellow',
      mode: 'dark',
      primary: '#FACC15',
      secondary: '#FFFFFF',
      accent: '#FDE047',
      surface: '#111827',
      surfaceSubtle: '#1F2937',
      background: '#05070B',
      text: '#FFFFFF',
      textMuted: '#9CA3AF',
      border: 'rgba(255, 255, 255, 0.16)',
      borderStrong: '#FACC15',
      badgeBg: 'rgba(250, 204, 21, 0.2)',
      shadow: '0 25px 60px rgba(0, 0, 0, 0.85)',
      pillBg: '#111827',
    },
    typography: PREDEFINED_TYPOGRAPHY_PAIRS.bold,
    textStyling: {
      effect: 'highlight',
      outlineWidth: 0,
      glowRadius: 0,
      highlightColor: '#FACC15',
      highlightPadding: '4px 12px',
    },
    background: {
      category: 'solid',
      primaryColor: '#05070B',
      accentColor: '#FACC15',
      patternOpacity: 0.05,
    },
    vectors: {
      family: 'bold-stroke-icon',
      strokeWidth: 4,
      strokeColor: '#FACC15',
      fillColor: 'transparent',
      accentFillColor: '#FACC15',
      lineCap: 'round',
      lineJoin: 'round',
    },
    images: {
      maskShape: 'squircle',
      borderRadius: 28,
      borderTreatment: 'prominent',
      borderColor: '#FACC15',
      borderWidth: 3,
      overlayTreatment: 'vignette',
      overlayOpacity: 0.3,
      dropShadow: '0 30px 60px rgba(0,0,0,0.8)',
      aspectRatio: 'auto',
      objectFit: 'cover',
    },
    shapes: {
      radius: 'md',
      radiusPx: 14,
      backdrop: 'solid',
      borderStyle: '2px solid rgba(255, 255, 255, 0.18)',
      shadowStyle: '0 20px 40px rgba(0,0,0,0.7)',
      pillPadding: '10px 22px',
      cardPadding: '24px 28px',
    },
    composition: {
      archetype: 'center-focus',
      aspectRatio: '9:16',
      safeMarginTop: 140,
      safeMarginBottom: 220,
      safeMarginX: 64,
      contentGap: 28,
      alignHorizontal: 'center',
      alignVertical: 'center',
      collisionAvoidance: true,
    },
    motion: {
      defaultTransition: 'whip-pan',
      defaultEntrance: 'scale-bounce',
      defaultExit: 'scale-shrink',
      springDamping: 10,
      springMass: 0.6,
      springStiffness: 160,
      staggerDelayFrames: 3,
      transitionDurationFrames: 9,
    },
    effects: {
      filmGrainOpacity: 0.08,
      vignetteStrength: 0.45,
      ambientGlowRadius: 25,
      ambientGlowColor: '#FACC15',
      ambientGlowOpacity: 0.25,
      chromaticAberrationOffset: 2,
      lightLeakOpacity: 0.08,
    },
    depth: MASTER_DEPTH_STACK,
  },

  // 3. PREMIUM FINANCE (Navy, Gold, White, DM Sans, refined charts & borders)
  'premium-finance': {
    id: 'premium-finance',
    name: 'Premium Finance & Wealth',
    description: 'Sophisticated deep navy and champagne gold with DM Sans typography, pristine charts, and executive polish.',
    colors: {
      id: 'premium-finance-palette',
      name: 'Navy & Gold',
      mode: 'dark',
      primary: '#D4AF37', // Champagne Gold
      secondary: '#E6C665',
      accent: '#10B981', // Profit Green
      surface: '#0E172E',
      surfaceSubtle: '#17254A',
      background: '#070C1B',
      text: '#F8FAFC',
      textMuted: '#94A3B8',
      border: 'rgba(212, 175, 55, 0.25)',
      borderStrong: 'rgba(212, 175, 55, 0.60)',
      badgeBg: 'rgba(212, 175, 55, 0.12)',
      shadow: '0 25px 50px rgba(0, 0, 0, 0.8)',
      pillBg: 'rgba(14, 23, 46, 0.95)',
    },
    typography: PREDEFINED_TYPOGRAPHY_PAIRS.professional,
    textStyling: {
      effect: 'solid',
      outlineWidth: 0,
      glowRadius: 10,
      glowColor: 'rgba(212, 175, 55, 0.2)',
    },
    background: {
      category: 'gradient',
      primaryColor: '#070C1B',
      secondaryColor: '#0E172E',
      accentColor: '#D4AF37',
      patternOpacity: 0.06,
    },
    vectors: {
      family: 'outline',
      strokeWidth: 2,
      strokeColor: '#D4AF37',
      fillColor: 'transparent',
      accentFillColor: 'rgba(212, 175, 55, 0.15)',
      lineCap: 'round',
      lineJoin: 'round',
    },
    images: {
      maskShape: 'rounded-rect',
      borderRadius: 18,
      borderTreatment: 'subtle',
      borderColor: 'rgba(212, 175, 55, 0.35)',
      borderWidth: 1.5,
      overlayTreatment: 'scrim',
      overlayOpacity: 0.15,
      dropShadow: '0 20px 45px rgba(0,0,0,0.6)',
      aspectRatio: 'auto',
      objectFit: 'cover',
    },
    shapes: {
      radius: 'md',
      radiusPx: 16,
      backdrop: 'frosted-glass',
      borderStyle: '1px solid rgba(212, 175, 55, 0.22)',
      shadowStyle: '0 20px 40px rgba(0,0,0,0.5)',
      pillPadding: '8px 20px',
      cardPadding: '28px 32px',
    },
    composition: {
      archetype: 'top-to-bottom',
      aspectRatio: '9:16',
      safeMarginTop: 140,
      safeMarginBottom: 220,
      safeMarginX: 80,
      contentGap: 24,
      alignHorizontal: 'center',
      alignVertical: 'center',
      collisionAvoidance: true,
    },
    motion: {
      defaultTransition: 'fade',
      defaultEntrance: 'fade-up',
      defaultExit: 'fade-down',
      springDamping: 16,
      springMass: 1.0,
      springStiffness: 100,
      staggerDelayFrames: 5,
      transitionDurationFrames: 14,
    },
    effects: {
      filmGrainOpacity: 0.03,
      vignetteStrength: 0.3,
      ambientGlowRadius: 30,
      ambientGlowColor: '#D4AF37',
      ambientGlowOpacity: 0.15,
      chromaticAberrationOffset: 0,
      lightLeakOpacity: 0.04,
    },
    depth: MASTER_DEPTH_STACK,
  },

  // 4. EDUCATIONAL (Teal, Blue, Coral, Nunito/Inter, friendly flat illustrations)
  'educational': {
    id: 'educational',
    name: 'Educational & Explainer',
    description: 'Approachable teal and warm coral accents, Nunito rounded typography, and clear flat illustrations.',
    colors: {
      id: 'educational-palette',
      name: 'Teal & Coral',
      mode: 'light',
      primary: '#0D9488',
      secondary: '#0284C7',
      accent: '#F43F5E',
      surface: '#FFFFFF',
      surfaceSubtle: '#F0FDFA',
      background: '#F8FAFC',
      text: '#0F172A',
      textMuted: '#64748B',
      border: 'rgba(0, 0, 0, 0.08)',
      borderStrong: '#0D9488',
      badgeBg: 'rgba(13, 148, 136, 0.12)',
      shadow: '0 12px 30px rgba(0, 0, 0, 0.06)',
      pillBg: '#FFFFFF',
    },
    typography: PREDEFINED_TYPOGRAPHY_PAIRS.friendly,
    textStyling: {
      effect: 'solid',
      outlineWidth: 0,
      highlightColor: '#CCFBF1',
      highlightPadding: '4px 10px',
    },
    background: {
      category: 'dots',
      primaryColor: '#F8FAFC',
      secondaryColor: '#E2E8F0',
      accentColor: '#0D9488',
      patternOpacity: 0.1,
      dotRadius: 2,
    },
    vectors: {
      family: 'flat',
      strokeWidth: 2,
      strokeColor: '#0D9488',
      fillColor: 'rgba(13, 148, 136, 0.15)',
      accentFillColor: 'rgba(244, 63, 94, 0.18)',
      lineCap: 'round',
      lineJoin: 'round',
    },
    images: {
      maskShape: 'rounded-rect',
      borderRadius: 24,
      borderTreatment: 'subtle',
      borderColor: 'rgba(13, 148, 136, 0.25)',
      borderWidth: 2,
      overlayTreatment: 'none',
      overlayOpacity: 0,
      dropShadow: '0 15px 35px rgba(0,0,0,0.08)',
      aspectRatio: 'auto',
      objectFit: 'cover',
    },
    shapes: {
      radius: 'xl',
      radiusPx: 24,
      backdrop: 'solid',
      borderStyle: '1.5px solid rgba(0, 0, 0, 0.08)',
      shadowStyle: '0 10px 30px rgba(0,0,0,0.05)',
      pillPadding: '8px 20px',
      cardPadding: '28px 32px',
    },
    composition: {
      archetype: 'stacked-cards',
      aspectRatio: '9:16',
      safeMarginTop: 140,
      safeMarginBottom: 220,
      safeMarginX: 80,
      contentGap: 24,
      alignHorizontal: 'center',
      alignVertical: 'center',
      collisionAvoidance: true,
    },
    motion: {
      defaultTransition: 'slide',
      defaultEntrance: 'spring-pop',
      defaultExit: 'fade-down',
      springDamping: 12,
      springMass: 0.7,
      springStiffness: 130,
      staggerDelayFrames: 4,
      transitionDurationFrames: 12,
    },
    effects: {
      filmGrainOpacity: 0,
      vignetteStrength: 0,
      ambientGlowRadius: 20,
      ambientGlowColor: '#0D9488',
      ambientGlowOpacity: 0.1,
      chromaticAberrationOffset: 0,
      lightLeakOpacity: 0,
    },
    depth: MASTER_DEPTH_STACK,
  },

  // 5. EDITORIAL MINIMAL (Cream, Black, Muted Brown, Playfair Display/Inter)
  'editorial-minimal': {
    id: 'editorial-minimal',
    name: 'Editorial Minimalist',
    description: 'Warm ivory canvas with obsidian typography, Playfair Display serif elegance, and paper-textured calm.',
    colors: {
      id: 'editorial-minimal-palette',
      name: 'Ivory & Charcoal',
      mode: 'light',
      primary: '#18181B',
      secondary: '#52525B',
      accent: '#B45309', // Warm Amber
      surface: '#FFFFFF',
      surfaceSubtle: '#F5F5F0',
      background: '#FAF8F5', // Warm Cream
      text: '#18181B',
      textMuted: '#71717A',
      border: 'rgba(24, 24, 27, 0.10)',
      borderStrong: 'rgba(24, 24, 27, 0.25)',
      badgeBg: 'rgba(180, 83, 9, 0.1)',
      shadow: '0 10px 25px rgba(0, 0, 0, 0.04)',
      pillBg: 'rgba(255, 255, 255, 0.95)',
    },
    typography: PREDEFINED_TYPOGRAPHY_PAIRS.editorial,
    textStyling: {
      effect: 'solid',
      outlineWidth: 0,
      underlineColor: '#B45309',
      underlineHeight: 2,
    },
    background: {
      category: 'texture',
      primaryColor: '#FAF8F5',
      secondaryColor: '#F0ECE4',
      accentColor: '#B45309',
      patternOpacity: 0.08,
    },
    vectors: {
      family: 'minimal-line',
      strokeWidth: 1.5,
      strokeColor: '#18181B',
      fillColor: 'transparent',
      accentFillColor: 'rgba(180, 83, 9, 0.12)',
      lineCap: 'round',
      lineJoin: 'round',
    },
    images: {
      maskShape: 'rounded-rect',
      borderRadius: 14,
      borderTreatment: 'subtle',
      borderColor: 'rgba(24, 24, 27, 0.12)',
      borderWidth: 1,
      overlayTreatment: 'none',
      overlayOpacity: 0,
      dropShadow: '0 12px 30px rgba(0,0,0,0.06)',
      aspectRatio: 'auto',
      objectFit: 'cover',
    },
    shapes: {
      radius: 'sm',
      radiusPx: 12,
      backdrop: 'solid',
      borderStyle: '1px solid rgba(24, 24, 27, 0.09)',
      shadowStyle: '0 8px 25px rgba(0,0,0,0.04)',
      pillPadding: '8px 18px',
      cardPadding: '28px 32px',
    },
    composition: {
      archetype: 'left-right',
      aspectRatio: '9:16',
      safeMarginTop: 140,
      safeMarginBottom: 220,
      safeMarginX: 84,
      contentGap: 24,
      alignHorizontal: 'left',
      alignVertical: 'center',
      collisionAvoidance: true,
    },
    motion: {
      defaultTransition: 'fade',
      defaultEntrance: 'fade-up',
      defaultExit: 'fade-down',
      springDamping: 18,
      springMass: 1.1,
      springStiffness: 90,
      staggerDelayFrames: 6,
      transitionDurationFrames: 15,
    },
    effects: {
      filmGrainOpacity: 0.05,
      vignetteStrength: 0.15,
      ambientGlowRadius: 0,
      ambientGlowColor: '#B45309',
      ambientGlowOpacity: 0,
      chromaticAberrationOffset: 0,
      lightLeakOpacity: 0.02,
    },
    depth: MASTER_DEPTH_STACK,
  },

  // 6. FUTURISTIC TECH (Dark Navy/Obsidian, Cyan, Electric Purple, Glowing vectors)
  'futuristic-tech': {
    id: 'futuristic-tech',
    name: 'Futuristic Cyber Tech',
    description: 'Deep obsidian space with vivid neon cyan and electric violet glow, Space Grotesk typography, and cybernetic effects.',
    colors: {
      id: 'futuristic-tech-palette',
      name: 'Cyber Cyan & Violet',
      mode: 'dark',
      primary: '#06B6D4',
      secondary: '#8B5CF6',
      accent: '#22D3EE',
      surface: '#0A0E1A',
      surfaceSubtle: '#11182B',
      background: '#030712',
      text: '#F3F4F6',
      textMuted: '#9CA3AF',
      border: 'rgba(6, 182, 212, 0.28)',
      borderStrong: '#06B6D4',
      badgeBg: 'rgba(6, 182, 212, 0.18)',
      shadow: '0 25px 65px rgba(6, 182, 212, 0.15), 0 0 1px rgba(6, 182, 212, 0.4)',
      pillBg: 'rgba(10, 14, 26, 0.95)',
    },
    typography: {
      id: 'geometric',
      name: 'Cyber Geometric',
      headingFont: '"Space Grotesk", Montserrat, sans-serif',
      bodyFont: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      headingWeight: 700,
      bodyWeight: 400,
      bestFor: 'AI tools, web3, futuristic technologies, developer reels',
      letterSpacing: { hero: '-0.02em', section: '-0.01em', body: '0em', caption: '0.08em' },
      lineHeight: { hero: 1.15, section: 1.25, body: 1.45, caption: 1.3 },
    },
    textStyling: {
      effect: 'glow',
      glowRadius: 20,
      glowColor: 'rgba(6, 182, 212, 0.5)',
      gradientAngleDeg: 135,
      gradientColors: ['#06B6D4', '#8B5CF6'],
    },
    background: {
      category: 'grid',
      primaryColor: '#030712',
      secondaryColor: '#0A0E1A',
      accentColor: '#06B6D4',
      patternOpacity: 0.15,
      gridSize: 40,
    },
    vectors: {
      family: 'isometric',
      strokeWidth: 2,
      strokeColor: '#06B6D4',
      fillColor: 'rgba(6, 182, 212, 0.08)',
      accentFillColor: 'rgba(139, 92, 246, 0.2)',
      lineCap: 'round',
      lineJoin: 'round',
      renderIsometric: true,
    },
    images: {
      maskShape: 'rounded-rect',
      borderRadius: 20,
      borderTreatment: 'gradient',
      borderColor: '#06B6D4',
      borderWidth: 2,
      overlayTreatment: 'tint',
      overlayOpacity: 0.15,
      dropShadow: '0 25px 50px rgba(6, 182, 212, 0.2)',
      aspectRatio: 'auto',
      objectFit: 'cover',
    },
    shapes: {
      radius: 'md',
      radiusPx: 16,
      backdrop: 'frosted-glass',
      borderStyle: '1px solid rgba(6, 182, 212, 0.35)',
      shadowStyle: '0 15px 40px rgba(0, 0, 0, 0.8), 0 0 20px rgba(6, 182, 212, 0.2)',
      pillPadding: '8px 20px',
      cardPadding: '28px 32px',
    },
    composition: {
      archetype: 'floating-elements',
      aspectRatio: '9:16',
      safeMarginTop: 140,
      safeMarginBottom: 220,
      safeMarginX: 80,
      contentGap: 24,
      alignHorizontal: 'center',
      alignVertical: 'center',
      collisionAvoidance: true,
    },
    motion: {
      defaultTransition: 'glitch',
      defaultEntrance: 'spring-pop',
      defaultExit: 'fade-down',
      springDamping: 11,
      springMass: 0.7,
      springStiffness: 140,
      staggerDelayFrames: 3,
      transitionDurationFrames: 10,
    },
    effects: {
      filmGrainOpacity: 0.06,
      vignetteStrength: 0.4,
      ambientGlowRadius: 45,
      ambientGlowColor: '#06B6D4',
      ambientGlowOpacity: 0.35,
      chromaticAberrationOffset: 3,
      lightLeakOpacity: 0.1,
    },
    depth: MASTER_DEPTH_STACK,
  },
};

// ============================================================================
// 3-TIER RESOLUTION HIERARCHY
// Tier 1: Global Theme -> Tier 2: Scene Overrides -> Tier 3: Layer Overrides
// ============================================================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Resolves a complete, deterministic VideoVisualTheme by layering:
 * 1. Base Master Theme (default: 'modern-saas')
 * 2. Scene-Level Overrides (optional)
 * 3. Individual Layer-Level Overrides (optional)
 */
export function resolveVisualTheme(
  themeInput?: string | Partial<VideoVisualTheme>,
  sceneOverrides?: DeepPartial<VideoVisualTheme>,
  layerOverrides?: DeepPartial<VideoVisualTheme>
): VideoVisualTheme {
  // Determine base theme
  let baseTheme: VideoVisualTheme;

  if (typeof themeInput === 'string' && MASTER_THEMES[themeInput]) {
    baseTheme = JSON.parse(JSON.stringify(MASTER_THEMES[themeInput]));
  } else if (typeof themeInput === 'object' && themeInput !== null && themeInput.id && MASTER_THEMES[themeInput.id]) {
    baseTheme = JSON.parse(JSON.stringify(MASTER_THEMES[themeInput.id]));
  } else {
    // Default fallback
    baseTheme = JSON.parse(JSON.stringify(MASTER_THEMES['modern-saas']));
  }

  // Deep merge Tier 2: Scene Overrides
  if (sceneOverrides) {
    baseTheme = deepMerge(baseTheme, sceneOverrides);
  }

  // Deep merge Tier 3: Layer Overrides
  if (layerOverrides) {
    baseTheme = deepMerge(baseTheme, layerOverrides);
  }

  return baseTheme;
}

/**
 * Simple recursive deep merge for theme objects
 */
function deepMerge<T>(target: T, source: any): T {
  if (!source) return target;
  const output = { ...target } as any;

  for (const key of Object.keys(source)) {
    const sourceVal = source[key];
    if (
      sourceVal !== undefined &&
      sourceVal !== null &&
      typeof sourceVal === 'object' &&
      !Array.isArray(sourceVal)
    ) {
      output[key] = deepMerge(output[key] || {}, sourceVal);
    } else if (sourceVal !== undefined) {
      output[key] = sourceVal;
    }
  }

  return output as T;
}

// ============================================================================
// SAFE AREA & CANVAS UTILITIES (1080x1920 Vertical Shorts & 1920x1080 Landscape)
// ============================================================================

export interface SafeAreaBounds {
  top: number;
  bottom: number;
  left: number;
  right: number;
  usableWidth: number;
  usableHeight: number;
}

export function calculateSafeArea(
  aspectRatio: '9:16' | '16:9',
  canvasWidth: number = aspectRatio === '9:16' ? 1080 : 1920,
  canvasHeight: number = aspectRatio === '9:16' ? 1920 : 1080
): SafeAreaBounds {
  if (aspectRatio === '9:16') {
    // Shorts/Reels UI: Top search/status bar (140px), Bottom creator caption/audio pill (260px), Horizontal margins (80px)
    const top = 140;
    const bottom = 260;
    const left = 80;
    const right = 80;
    return {
      top,
      bottom,
      left,
      right,
      usableWidth: canvasWidth - (left + right),
      usableHeight: canvasHeight - (top + bottom),
    };
  } else {
    // Landscape 16:9 YouTube: Top (80px), Bottom progress scrubber (100px), Horizontal (120px)
    const top = 80;
    const bottom = 100;
    const left = 120;
    const right = 120;
    return {
      top,
      bottom,
      left,
      right,
      usableWidth: canvasWidth - (left + right),
      usableHeight: canvasHeight - (top + bottom),
    };
  }
}

