/**
 * ITNAVIDEO CENTRAL VIDEO DESIGN SYSTEM (`CentralDesignSystem.ts`)
 * ============================================================================
 * Shared single source of truth for broadcast-grade visual polish across:
 *   - 16:9 Long-Form Faceless Video (1920×1080)
 *   - 9:16 Vertical Faceless Shorts (1080×1920)
 *   - Book Summaries, Image-to-Video, and standard scene-based templates
 *
 * Enforces:
 *   1. Aspect-Ratio-Aware Safe Zones (including bottom subtitle clearance)
 *   2. Strict Optical Typography Scale & Line-Length Discipline
 *   3. Studio White (`#FFFFFF`) default canvas with high-contrast text (`#0F172A`)
 *   4. Choreographed Scene-Local Motion Springs
 */

import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export type AccentTone =
  | 'coral'
  | 'yellow'
  | 'emerald'
  | 'rose'
  | 'indigo'
  | 'sky'
  | 'amber'
  | 'slate';

export interface AccentTokenSet {
  solid: string;
  SoftBg: string;
  border: string;
  textOnSoft: string;
  textOnSolid: string;
  glow: string;
}

export interface VideoSurfaceTokens {
  isDark: boolean;
  canvasBg: string;
  gridDotColor: string;
  cardBg: string;
  cardBgMuted: string;
  cardBgElevated: string;
  borderSubtle: string;
  borderStrong: string;
  shadowCard: string;
  shadowElevated: string;
  shadowBadge: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
}

export interface VideoTypographyScale {
  eyebrow: {
    fontSize: number;
    fontWeight: number;
    letterSpacing: string;
    lineHeight: number;
  };
  displayHero: {
    fontSize: number;
    fontWeight: number;
    letterSpacing: string;
    lineHeight: number;
  };
  sceneTitle: {
    fontSize: number;
    fontWeight: number;
    letterSpacing: string;
    lineHeight: number;
  };
  cardTitle: {
    fontSize: number;
    fontWeight: number;
    letterSpacing: string;
    lineHeight: number;
  };
  bodyLg: {
    fontSize: number;
    fontWeight: number;
    letterSpacing: string;
    lineHeight: number;
  };
  bodyMd: {
    fontSize: number;
    fontWeight: number;
    letterSpacing: string;
    lineHeight: number;
  };
  captionMeta: {
    fontSize: number;
    fontWeight: number;
    letterSpacing: string;
    lineHeight: number;
  };
  metricHero: {
    fontSize: number;
    fontWeight: number;
    letterSpacing: string;
    lineHeight: number;
  };
}

export const ACCENT_PALETTES: Record<AccentTone, AccentTokenSet> = {
  coral: {
    solid: '#FF4757',
    SoftBg: 'rgba(255, 71, 87, 0.08)',
    border: 'rgba(255, 71, 87, 0.28)',
    textOnSoft: '#D92D3E',
    textOnSolid: '#FFFFFF',
    glow: 'rgba(255, 71, 87, 0.16)',
  },
  yellow: {
    solid: '#F59E0B',
    SoftBg: 'rgba(245, 158, 11, 0.10)',
    border: 'rgba(245, 158, 11, 0.32)',
    textOnSoft: '#B45309',
    textOnSolid: '#0F172A',
    glow: 'rgba(245, 158, 11, 0.18)',
  },
  emerald: {
    solid: '#10B981',
    SoftBg: 'rgba(16, 185, 129, 0.09)',
    border: 'rgba(16, 185, 129, 0.30)',
    textOnSoft: '#047857',
    textOnSolid: '#FFFFFF',
    glow: 'rgba(16, 185, 129, 0.16)',
  },
  rose: {
    solid: '#F43F5E',
    SoftBg: 'rgba(244, 63, 94, 0.08)',
    border: 'rgba(244, 63, 94, 0.28)',
    textOnSoft: '#BE123C',
    textOnSolid: '#FFFFFF',
    glow: 'rgba(244, 63, 94, 0.15)',
  },
  indigo: {
    solid: '#6366F1',
    SoftBg: 'rgba(99, 102, 241, 0.08)',
    border: 'rgba(99, 102, 241, 0.28)',
    textOnSoft: '#4338CA',
    textOnSolid: '#FFFFFF',
    glow: 'rgba(99, 102, 241, 0.16)',
  },
  sky: {
    solid: '#0284C7',
    SoftBg: 'rgba(2, 132, 199, 0.08)',
    border: 'rgba(2, 132, 199, 0.28)',
    textOnSoft: '#0369A1',
    textOnSolid: '#FFFFFF',
    glow: 'rgba(2, 132, 199, 0.15)',
  },
  amber: {
    solid: '#D97706',
    SoftBg: 'rgba(217, 119, 6, 0.09)',
    border: 'rgba(217, 119, 6, 0.30)',
    textOnSoft: '#92400E',
    textOnSolid: '#FFFFFF',
    glow: 'rgba(217, 119, 6, 0.16)',
  },
  slate: {
    solid: '#475569',
    SoftBg: 'rgba(71, 85, 105, 0.08)',
    border: 'rgba(71, 85, 105, 0.25)',
    textOnSoft: '#1E293B',
    textOnSolid: '#FFFFFF',
    glow: 'rgba(71, 85, 105, 0.12)',
  },
};

export function getSurfaceTokens(isDark: boolean = false): VideoSurfaceTokens {
  if (isDark) {
    return {
      isDark: true,
      canvasBg: '#0B0F19',
      gridDotColor: 'rgba(255, 255, 255, 0.06)',
      cardBg: '#131927',
      cardBgMuted: '#1A2234',
      cardBgElevated: '#202B40',
      borderSubtle: 'rgba(255, 255, 255, 0.10)',
      borderStrong: 'rgba(255, 255, 255, 0.20)',
      shadowCard: '0 12px 36px -8px rgba(0, 0, 0, 0.50)',
      shadowElevated: '0 20px 48px -10px rgba(0, 0, 0, 0.65)',
      shadowBadge: '0 4px 14px rgba(0,0,0,0.30)',
      textPrimary: '#F8FAFC',
      textSecondary: '#CBD5E1',
      textMuted: '#94A3B8',
      textInverse: '#0F172A',
    };
  }

  // DEFAULT STUDIO WHITE (Founder Directive)
  return {
    isDark: false,
    canvasBg: '#FFFFFF',
    gridDotColor: 'rgba(15, 23, 42, 0.05)',
    cardBg: '#F8FAFC',
    cardBgMuted: '#F1F5F9',
    cardBgElevated: '#FFFFFF',
    borderSubtle: 'rgba(15, 23, 42, 0.08)',
    borderStrong: 'rgba(15, 23, 42, 0.16)',
    shadowCard: '0 12px 32px -8px rgba(15, 23, 42, 0.06)',
    shadowElevated: '0 20px 48px -10px rgba(15, 23, 42, 0.10)',
    shadowBadge: '0 4px 12px rgba(15, 23, 42, 0.06)',
    textPrimary: '#0F172A',
    textSecondary: '#334155',
    textMuted: '#64748B',
    textInverse: '#FFFFFF',
  };
}

export function getTypographyScale(isVertical: boolean): VideoTypographyScale {
  if (isVertical) {
    // 9:16 Vertical Shorts Scale
    return {
      eyebrow: { fontSize: 22, fontWeight: 800, letterSpacing: '0.12em', lineHeight: 1.2 },
      displayHero: { fontSize: 58, fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.08 },
      sceneTitle: { fontSize: 44, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.15 },
      cardTitle: { fontSize: 30, fontWeight: 800, letterSpacing: '-0.01em', lineHeight: 1.22 },
      bodyLg: { fontSize: 26, fontWeight: 600, letterSpacing: '0em', lineHeight: 1.35 },
      bodyMd: { fontSize: 22, fontWeight: 500, letterSpacing: '0em', lineHeight: 1.4 },
      captionMeta: { fontSize: 18, fontWeight: 700, letterSpacing: '0.05em', lineHeight: 1.3 },
      metricHero: { fontSize: 80, fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.0 },
    };
  }

  // 16:9 Widescreen Scale
  return {
    eyebrow: { fontSize: 18, fontWeight: 800, letterSpacing: '0.14em', lineHeight: 1.2 },
    displayHero: { fontSize: 62, fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.08 },
    sceneTitle: { fontSize: 46, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.15 },
    cardTitle: { fontSize: 28, fontWeight: 800, letterSpacing: '-0.01em', lineHeight: 1.25 },
    bodyLg: { fontSize: 24, fontWeight: 600, letterSpacing: '0em', lineHeight: 1.38 },
    bodyMd: { fontSize: 20, fontWeight: 500, letterSpacing: '0em', lineHeight: 1.42 },
    captionMeta: { fontSize: 16, fontWeight: 700, letterSpacing: '0.06em', lineHeight: 1.3 },
    metricHero: { fontSize: 88, fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.0 },
  };
}

export function useVideoDesignSystem({
  sceneFrame,
  durationSec = 5,
  palette,
}: {
  sceneFrame?: number;
  durationSec?: number;
  palette?: { isDark?: boolean } | null;
}) {
  const currentFrame = useCurrentFrame();
  const videoConfig = useVideoConfig();

  const activeFrame = sceneFrame !== undefined ? sceneFrame : currentFrame;
  const isVertical = videoConfig.width < videoConfig.height;
  const isDark = Boolean(palette?.isDark);

  const surface = getSurfaceTokens(isDark);
  const typeScale = getTypographyScale(isVertical);

  // Choreographed Springs
  const enterSpring = spring({
    frame: activeFrame,
    fps: videoConfig.fps,
    config: { damping: 14, stiffness: 120, mass: 0.7 },
  });

  const enterScale = interpolate(enterSpring, [0, 1], [0.94, 1.0]);
  const enterOpacity = interpolate(enterSpring, [0, 1], [0, 1]);
  const enterY = interpolate(enterSpring, [0, 1], [24, 0]);

  // Exit transition
  const totalFrames = Math.max(30, Math.round((durationSec || 5) * videoConfig.fps));
  const exitFrames = 12;
  const exitProgress = interpolate(
    activeFrame,
    [totalFrames - exitFrames, totalFrames],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);
  const exitY = interpolate(exitProgress, [0, 1], [0, -16]);

  const safePaddingTop = isVertical ? 110 : 80;
  const safePaddingBottom = isVertical ? 240 : 100; // bottom subtitle safe zone clearance
  const safePaddingX = isVertical ? 56 : 96;

  return {
    isVertical,
    isDark,
    activeFrame,
    fps: videoConfig.fps,
    surface,
    typeScale,
    accents: ACCENT_PALETTES,
    layout: {
      width: videoConfig.width,
      height: videoConfig.height,
      safePaddingTop,
      safePaddingBottom,
      safePaddingX,
      isVertical,
    },
    motion: {
      enterSpring,
      enterScale,
      enterOpacity,
      enterY,
      exitProgress,
      exitOpacity,
      exitY,
      style: {
        opacity: enterOpacity * exitOpacity,
        transform: `translateY(${enterY + exitY}px) scale(${enterScale})`,
      },
    },
  };
}
