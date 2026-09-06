/**
 * Itnavideo — Material Design 3 (M3) Video Design System
 * Based on Google Material 3 (https://m3.material.io/)
 * Calibrated specifically for 1920x1080 Full HD Broadcast Video & 1080x1920 Reels
 */

import { Easing } from 'remotion';

// ─── 1. M3 Typography Scale (Scaled for 1920x1080 Video) ──────
export interface M3TypographyToken {
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  fontWeight: number | string;
  textTransform?: 'none' | 'uppercase' | 'capitalize';
}

export const M3_TYPE_SCALE = {
  // Hero Display (1-3 words impact / key numbers)
  displayHero: {
    fontSize: 104,
    lineHeight: 1.1,
    letterSpacing: -2,
    fontWeight: 900,
  },
  // Display Large (Stat numbers, punchy statements)
  displayLarge: {
    fontSize: 82,
    lineHeight: 1.15,
    letterSpacing: -1.5,
    fontWeight: 800,
  },
  // Display Medium (Hero chapter titles, 4-8 words headlines)
  displayMedium: {
    fontSize: 64,
    lineHeight: 1.2,
    letterSpacing: -1,
    fontWeight: 700,
  },
  // Headline Large (Primary sentence titles, section intros)
  headlineLarge: {
    fontSize: 48,
    lineHeight: 1.25,
    letterSpacing: -0.5,
    fontWeight: 700,
  },
  // Headline Medium (Secondary headers, card titles)
  headlineMedium: {
    fontSize: 38,
    lineHeight: 1.3,
    letterSpacing: 0,
    fontWeight: 600,
  },
  // Title Large (Lead in, quote body, key takeaway)
  titleLarge: {
    fontSize: 32,
    lineHeight: 1.35,
    letterSpacing: 0,
    fontWeight: 600,
  },
  // Title Medium (Subtitle strip, split-screen heading)
  titleMedium: {
    fontSize: 26,
    lineHeight: 1.4,
    letterSpacing: 0.15,
    fontWeight: 600,
  },
  // Body Large (Clean readable explanation text, max 3 lines)
  bodyLarge: {
    fontSize: 22,
    lineHeight: 1.5,
    letterSpacing: 0.25,
    fontWeight: 400,
  },
  // Body Medium (Captions, footnotes, source citations)
  bodyMedium: {
    fontSize: 18,
    lineHeight: 1.5,
    letterSpacing: 0.25,
    fontWeight: 400,
  },
  // Label Large (Pills, badges, category tags, author stamps)
  labelLarge: {
    fontSize: 16,
    lineHeight: 1.4,
    letterSpacing: 0.75,
    fontWeight: 700,
    textTransform: 'uppercase' as const,
  },
  // Label Small (Timestamp markers, micro metadata)
  labelSmall: {
    fontSize: 13,
    lineHeight: 1.3,
    letterSpacing: 0.5,
    fontWeight: 600,
  },
} as const;

// ─── 2. M3 Motion & Easing Curves ─────────────────────────────
// Source: https://m3.material.io/styles/motion/easing-and-duration/tokens-specs
export const M3_EASING = {
  // Emphasized Decelerate (The premier M3 curve for incoming elements)
  emphasizedDecelerate: Easing.bezier(0.05, 0.7, 0.1, 1.0),
  // Emphasized Accelerate (For quick, clean element dismissals)
  emphasizedAccelerate: Easing.bezier(0.3, 0.0, 0.8, 0.15),
  // Standard Easing (Balanced transition)
  standard: Easing.bezier(0.2, 0.0, 0.0, 1.0),
  // Standard Decelerate (Gentle slowdown)
  standardDecelerate: Easing.bezier(0.0, 0.0, 0.2, 1.0),
  // Standard Accelerate (Smooth ramp up)
  standardAccelerate: Easing.bezier(0.3, 0.0, 1.0, 1.0),
};

// M3 Springs optimized for Remotion spring()
export const M3_SPRINGS = {
  // Crisp, broadcast punch for stat reveals & titles
  snappy: { damping: 14, mass: 0.65, stiffness: 180 },
  // Luxurious, cinematic smooth motion for cards & images
  smooth: { damping: 20, mass: 1.0, stiffness: 130 },
  // Subtle bounce for icons, stickers & pills
  playful: { damping: 11, mass: 0.75, stiffness: 160 },
};

// ─── 3. M3 Surface Elevation System (Dark Cinematic) ─────────
// Elevated surface containers with subtle light reflection borders & frosted glass
export const M3_SURFACES = {
  level0: {
    backgroundColor: 'transparent',
    border: 'none',
    boxShadow: 'none',
  },
  level1: {
    backgroundColor: 'rgba(18, 22, 34, 0.70)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.07)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35)',
  },
  level2: {
    backgroundColor: 'rgba(24, 29, 45, 0.82)',
    backdropFilter: 'blur(24px)',
    border: '1px solid rgba(255, 255, 255, 0.11)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.50)',
  },
  level3: {
    backgroundColor: 'rgba(30, 36, 56, 0.90)',
    backdropFilter: 'blur(32px)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    boxShadow: '0 18px 48px rgba(0, 0, 0, 0.65)',
  },
  level4: {
    backgroundColor: 'rgba(36, 44, 68, 0.95)',
    backdropFilter: 'blur(40px)',
    border: '1px solid rgba(255, 255, 255, 0.20)',
    boxShadow: '0 28px 64px rgba(0, 0, 0, 0.80)',
  },
};

// ─── 4. M3 Tonal Palette (High-Contrast Broadcast Video) ──────
export const M3_COLORS = {
  // Primary (Mint/Teal — energetic, high-contrast)
  primary: '#10B981',
  onPrimary: '#022C22',
  primaryContainer: 'rgba(16, 185, 129, 0.15)',
  // Secondary (Electric Cyan — tech, modern)
  secondary: '#38BDF8',
  onSecondary: '#082F49',
  secondaryContainer: 'rgba(56, 189, 248, 0.15)',
  // Tertiary (Vibrant Purple / Amber for highlights)
  tertiary: '#F59E0B',
  onTertiary: '#451A03',
  tertiaryPurple: '#C084FC',
  // Canvas Surfaces
  surfaceDark: '#0B0F19',
  onSurface: '#F8FAFC',
  onSurfaceVariant: '#94A3B8',
  outline: 'rgba(255, 255, 255, 0.12)',
  outlineVariant: 'rgba(255, 255, 255, 0.06)',
};

// ─── 5. Helper Functions ──────────────────────────────────────
export function getM3TextStyle(role: keyof typeof M3_TYPE_SCALE) {
  const token = M3_TYPE_SCALE[role];
  return {
    fontSize: token.fontSize,
    lineHeight: token.lineHeight,
    letterSpacing: `${token.letterSpacing}px`,
    fontWeight: token.fontWeight,
    textTransform: (token as any).textTransform || 'none',
  };
}

export function getM3SurfaceStyle(level: keyof typeof M3_SURFACES) {
  return M3_SURFACES[level];
}
