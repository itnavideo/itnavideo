import React from 'react';

/**
 * Material Design 3 Typography System for 1080x1920 Full HD Video
 * Reference: https://m3.material.io/styles/typography/overview
 */

export const M3_VIDEO_TYPE_SCALE = {
  // Display: Largest text on screen, short high-impact statement words, numbers & stats
  displayHero: {
    fontSize: 120,
    lineHeight: 1.05,
    letterSpacing: '-0.035em',
    fontWeight: 900,
  },
  displayLarge: {
    fontSize: 104,
    lineHeight: 1.08,
    letterSpacing: '-0.03em',
    fontWeight: 900,
  },
  displayMedium: {
    fontSize: 82,
    lineHeight: 1.12,
    letterSpacing: '-0.025em',
    fontWeight: 800,
  },
  displaySmall: {
    fontSize: 64,
    lineHeight: 1.16,
    letterSpacing: '-0.02em',
    fontWeight: 800,
  },

  // Headline: High-emphasis section or clause statements
  headlineLarge: {
    fontSize: 52,
    lineHeight: 1.18,
    letterSpacing: '-0.018em',
    fontWeight: 700,
  },
  headlineMedium: {
    fontSize: 42,
    lineHeight: 1.22,
    letterSpacing: '-0.014em',
    fontWeight: 700,
  },
  headlineSmall: {
    fontSize: 34,
    lineHeight: 1.25,
    letterSpacing: '-0.01em',
    fontWeight: 600,
  },

  // Title: Medium-emphasis tags, subheadings, context markers
  titleLarge: {
    fontSize: 30,
    lineHeight: 1.28,
    letterSpacing: '0.0em',
    fontWeight: 600,
  },
  titleMedium: {
    fontSize: 26,
    lineHeight: 1.32,
    letterSpacing: '0.005em',
    fontWeight: 600,
  },
  titleSmall: {
    fontSize: 22,
    lineHeight: 1.35,
    letterSpacing: '0.01em',
    fontWeight: 600,
  },

  // Label: Functional UI pills, tags, chips, badges (tight uppercase, wider tracking)
  labelLarge: {
    fontSize: 18,
    lineHeight: 1.0,
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    fontWeight: 700,
  },
  labelMedium: {
    fontSize: 15,
    lineHeight: 1.0,
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
    fontWeight: 700,
  },
  labelSmall: {
    fontSize: 13,
    lineHeight: 1.0,
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    fontWeight: 700,
  },

  // Body: Longer descriptive clauses, comfortable reading ratio
  bodyLarge: {
    fontSize: 24,
    lineHeight: 1.45,
    letterSpacing: '0.01em',
    fontWeight: 400,
  },
  bodyMedium: {
    fontSize: 20,
    lineHeight: 1.45,
    letterSpacing: '0.015em',
    fontWeight: 400,
  },
};

/** M3 Emphasized Motion Curves & Springs */
export const M3_TYPOGRAPHY_MOTION = {
  spring: {
    mass: 0.55,
    damping: 14,
    stiffness: 190,
  },
  exitSpring: {
    mass: 0.4,
    damping: 18,
    stiffness: 240,
  },
  emphasizedEasing: 'cubic-bezier(0.05, 0.7, 0.1, 1.0)',
};

/** M3 Tonal Surface Containers */
export const M3_TONAL_SURFACES = {
  pillContainer: {
    background: 'rgba(24, 24, 27, 0.75)',
    border: '1px solid rgba(255, 255, 255, 0.14)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.18)',
    borderRadius: 9999,
  },
  cardContainer: {
    background: 'rgba(18, 18, 22, 0.85)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    backdropFilter: 'blur(28px)',
    WebkitBackdropFilter: 'blur(28px)',
    boxShadow: '0 16px 48px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
    borderRadius: 24,
  },
  accentPill: (accentColor: string) => ({
    background: accentColor + '1A',
    border: '1px solid ' + accentColor + '4D',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    boxShadow: '0 0 24px ' + accentColor + '26, inset 0 1px 0 rgba(255, 255, 255, 0.25)',
    borderRadius: 9999,
  }),
};
