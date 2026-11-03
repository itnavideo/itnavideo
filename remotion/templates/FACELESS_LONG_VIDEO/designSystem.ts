/**
 * ITNAVIDEO CENTRAL VIDEO DESIGN SYSTEM (`designSystem.ts`)
 * ============================================================================
 * Single source of truth for broadcast-grade visual polish across:
 *   - 16:9 Long-Form Faceless Video (1920×1080, up to 5 min)
 *   - 9:16 Vertical Faceless Shorts (1080×1920, up to 90s)
 *
 * Enforces:
 *   1. Aspect-Ratio-Aware Safe Zones (including bottom subtitle clearance)
 *   2. Strict Optical Typography Scale & Line-Length Discipline
 *   3. Unified Theme-Aware Surface, Border & Elevation Tokens (Light Editorial & Dark Cinema)
 *   4. Choreographed Scene-Local Motion Springs (Zero raw global frame bugs)
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

export interface VideoLayoutGrid {
  width: number;
  height: number;
  isVertical: boolean;
  aspectRatio: '16:9' | '9:16';
  safePaddingTop: number;
  safePaddingBottom: number;
  safePaddingX: number;
  maxContentWidth: number;
  headerMarginBottom: number;
  splitDirection: 'row' | 'column';
  gapSm: number;
  gapMd: number;
  gapLg: number;
  cardRadius: number;
  cardPadding: string;
}

const ACCENT_MAP_LIGHT: Record<AccentTone, AccentTokenSet> = {
  coral: {
    solid: '#EA580C',
    SoftBg: '#FFF7ED',
    border: 'rgba(234, 88, 12, 0.28)',
    textOnSoft: '#C2410C',
    textOnSolid: '#FFFFFF',
    glow: 'rgba(234, 88, 12, 0.12)',
  },
  yellow: {
    solid: '#FFE600',
    SoftBg: '#FEFCE8',
    border: 'rgba(234, 179, 8, 0.45)',
    textOnSoft: '#854D0E',
    textOnSolid: '#0F172A',
    glow: 'rgba(255, 230, 0, 0.22)',
  },
  emerald: {
    solid: '#059669',
    SoftBg: '#ECFDF5',
    border: 'rgba(5, 150, 105, 0.28)',
    textOnSoft: '#047857',
    textOnSolid: '#FFFFFF',
    glow: 'rgba(16, 185, 129, 0.14)',
  },
  rose: {
    solid: '#E11D48',
    SoftBg: '#FFF1F2',
    border: 'rgba(225, 29, 72, 0.26)',
    textOnSoft: '#BE123C',
    textOnSolid: '#FFFFFF',
    glow: 'rgba(225, 29, 72, 0.12)',
  },
  indigo: {
    solid: '#4F46E5',
    SoftBg: '#EEF2FF',
    border: 'rgba(79, 70, 229, 0.26)',
    textOnSoft: '#4338CA',
    textOnSolid: '#FFFFFF',
    glow: 'rgba(79, 70, 229, 0.12)',
  },
  sky: {
    solid: '#0284C7',
    SoftBg: '#F0F9FF',
    border: 'rgba(2, 132, 199, 0.26)',
    textOnSoft: '#0369A1',
    textOnSolid: '#FFFFFF',
    glow: 'rgba(2, 132, 199, 0.12)',
  },
  amber: {
    solid: '#D97706',
    SoftBg: '#FFFBEB',
    border: 'rgba(217, 119, 6, 0.30)',
    textOnSoft: '#B45309',
    textOnSolid: '#FFFFFF',
    glow: 'rgba(245, 158, 11, 0.14)',
  },
  slate: {
    solid: '#0F172A',
    SoftBg: '#F1F5F9',
    border: 'rgba(15, 23, 42, 0.16)',
    textOnSoft: '#334155',
    textOnSolid: '#FFFFFF',
    glow: 'rgba(15, 23, 42, 0.08)',
  },
};

const ACCENT_MAP_DARK: Record<AccentTone, AccentTokenSet> = {
  coral: {
    solid: '#FF5722',
    SoftBg: 'rgba(255, 87, 34, 0.16)',
    border: 'rgba(255, 87, 34, 0.42)',
    textOnSoft: '#FF8A65',
    textOnSolid: '#FFFFFF',
    glow: 'rgba(255, 87, 34, 0.20)',
  },
  yellow: {
    solid: '#FFE600',
    SoftBg: 'rgba(255, 230, 0, 0.16)',
    border: 'rgba(255, 230, 0, 0.42)',
    textOnSoft: '#FFE600',
    textOnSolid: '#0F172A',
    glow: 'rgba(255, 230, 0, 0.20)',
  },
  emerald: {
    solid: '#10B981',
    SoftBg: 'rgba(16, 185, 129, 0.16)',
    border: 'rgba(16, 185, 129, 0.42)',
    textOnSoft: '#34D399',
    textOnSolid: '#064E3B',
    glow: 'rgba(16, 185, 129, 0.22)',
  },
  rose: {
    solid: '#F43F5E',
    SoftBg: 'rgba(244, 63, 94, 0.16)',
    border: 'rgba(244, 63, 94, 0.42)',
    textOnSoft: '#FB7185',
    textOnSolid: '#FFFFFF',
    glow: 'rgba(244, 63, 94, 0.20)',
  },
  indigo: {
    solid: '#6366F1',
    SoftBg: 'rgba(99, 102, 241, 0.18)',
    border: 'rgba(99, 102, 241, 0.42)',
    textOnSoft: '#A5B4FC',
    textOnSolid: '#FFFFFF',
    glow: 'rgba(99, 102, 241, 0.22)',
  },
  sky: {
    solid: '#38BDF8',
    SoftBg: 'rgba(56, 189, 248, 0.16)',
    border: 'rgba(56, 189, 248, 0.42)',
    textOnSoft: '#7DD3FC',
    textOnSolid: '#0F172A',
    glow: 'rgba(56, 189, 248, 0.20)',
  },
  amber: {
    solid: '#F59E0B',
    SoftBg: 'rgba(245, 158, 11, 0.16)',
    border: 'rgba(245, 158, 11, 0.42)',
    textOnSoft: '#FCD34D',
    textOnSolid: '#0F172A',
    glow: 'rgba(245, 158, 11, 0.20)',
  },
  slate: {
    solid: '#E2E8F0',
    SoftBg: 'rgba(148, 163, 184, 0.14)',
    border: 'rgba(148, 163, 184, 0.30)',
    textOnSoft: '#E2E8F0',
    textOnSolid: '#0F172A',
    glow: 'rgba(148, 163, 184, 0.15)',
  },
};

export function resolveSurfaceTokens(palette?: { isDark?: boolean } | null): VideoSurfaceTokens {
  const isDark = palette?.isDark === true;
  if (isDark) {
    return {
      isDark: true,
      canvasBg: 'transparent',
      gridDotColor: 'rgba(255, 255, 255, 0.055)',
      cardBg: 'rgba(15, 23, 42, 0.88)',
      cardBgMuted: 'rgba(30, 41, 59, 0.72)',
      cardBgElevated: 'rgba(15, 23, 42, 0.95)',
      borderSubtle: '1.5px solid rgba(255, 255, 255, 0.11)',
      borderStrong: '1.5px solid rgba(255, 255, 255, 0.22)',
      shadowCard: '0 20px 50px -12px rgba(0, 0, 0, 0.55), 0 4px 16px rgba(0, 0, 0, 0.35)',
      shadowElevated: '0 28px 65px -12px rgba(0, 0, 0, 0.70), 0 0 0 1px rgba(255, 255, 255, 0.08)',
      shadowBadge: '0 6px 18px rgba(0, 0, 0, 0.35)',
      textPrimary: '#F8FAFC',
      textSecondary: '#CBD5E1',
      textMuted: '#94A3B8',
      textInverse: '#0F172A',
    };
  }

  return {
    isDark: false,
    canvasBg: 'transparent',
    gridDotColor: 'rgba(15, 23, 42, 0.045)',
    cardBg: '#FFFFFF',
    cardBgMuted: '#F8FAFC',
    cardBgElevated: '#FFFFFF',
    borderSubtle: '1.5px solid #E2E8F0',
    borderStrong: '1.5px solid #CBD5E1',
    shadowCard: '0 20px 45px -12px rgba(15, 23, 42, 0.07), 0 4px 14px -2px rgba(15, 23, 42, 0.04)',
    shadowElevated: '0 26px 60px -14px rgba(15, 23, 42, 0.10), 0 6px 20px -4px rgba(15, 23, 42, 0.05)',
    shadowBadge: '0 4px 14px rgba(15, 23, 42, 0.05)',
    textPrimary: '#0F172A',
    textSecondary: '#334155',
    textMuted: '#64748B',
    textInverse: '#FFFFFF',
  };
}

export function resolveTypographyScale(isVertical: boolean): VideoTypographyScale {
  if (isVertical) {
    return {
      eyebrow: { fontSize: 13, fontWeight: 800, letterSpacing: '0.13em', lineHeight: 1.2 },
      displayHero: { fontSize: 48, fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1 },
      sceneTitle: { fontSize: 38, fontWeight: 900, letterSpacing: '-0.025em', lineHeight: 1.14 },
      cardTitle: { fontSize: 23, fontWeight: 800, letterSpacing: '-0.015em', lineHeight: 1.24 },
      bodyLg: { fontSize: 20, fontWeight: 500, letterSpacing: '-0.005em', lineHeight: 1.48 },
      bodyMd: { fontSize: 17, fontWeight: 500, letterSpacing: '0em', lineHeight: 1.44 },
      captionMeta: { fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', lineHeight: 1.2 },
      metricHero: { fontSize: 72, fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.0 },
    };
  }

  return {
    eyebrow: { fontSize: 13, fontWeight: 800, letterSpacing: '0.13em', lineHeight: 1.2 },
    displayHero: { fontSize: 60, fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.08 },
    sceneTitle: { fontSize: 46, fontWeight: 900, letterSpacing: '-0.025em', lineHeight: 1.12 },
    cardTitle: { fontSize: 25, fontWeight: 800, letterSpacing: '-0.015em', lineHeight: 1.22 },
    bodyLg: { fontSize: 22, fontWeight: 500, letterSpacing: '-0.005em', lineHeight: 1.5 },
    bodyMd: { fontSize: 17, fontWeight: 500, letterSpacing: '0em', lineHeight: 1.45 },
    captionMeta: { fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', lineHeight: 1.2 },
    metricHero: { fontSize: 92, fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.0 },
  };
}

export function resolveLayoutGrid(width: number, height: number): VideoLayoutGrid {
  const isVertical = height > width;
  if (isVertical) {
    return {
      width,
      height,
      isVertical: true,
      aspectRatio: '9:16',
      safePaddingTop: 120,
      safePaddingBottom: 230, // Leaves generous breathing room above 9:16 karaoke subtitles
      safePaddingX: 56,
      maxContentWidth: 968,
      headerMarginBottom: 28,
      splitDirection: 'column',
      gapSm: 14,
      gapMd: 20,
      gapLg: 28,
      cardRadius: 24,
      cardPadding: '26px 28px',
    };
  }

  return {
    width,
    height,
    isVertical: false,
    aspectRatio: '16:9',
    safePaddingTop: 76,
    safePaddingBottom: 128, // Leaves clean breathing room above 16:9 bottom subtitles
    safePaddingX: 112,
    maxContentWidth: 1620,
    headerMarginBottom: 34,
    splitDirection: 'row',
    gapSm: 16,
    gapMd: 24,
    gapLg: 40,
    cardRadius: 24,
    cardPadding: '32px 36px',
  };
}

export function useVideoDesignSystem(options?: {
  sceneFrame?: number;
  durationSec?: number;
  palette?: { isDark?: boolean } | null;
}) {
  const globalFrame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Always enforce scene-local frame timing so animations trigger at the start of each scene
  const localFrame = options?.sceneFrame !== undefined ? options.sceneFrame : globalFrame;
  const totalFrames = Math.max(30, Math.round((options?.durationSec || 5) * fps));

  const layout = resolveLayoutGrid(width, height);
  const surface = resolveSurfaceTokens(options?.palette);
  const type = resolveTypographyScale(layout.isVertical);
  const accents = surface.isDark ? ACCENT_MAP_DARK : ACCENT_MAP_LIGHT;

  // Choreographed editorial spring hierarchy
  const eyebrowSpring = spring({
    frame: Math.max(0, localFrame),
    fps,
    config: { damping: 16, mass: 0.75, stiffness: 150 },
  });

  const headerSpring = spring({
    frame: Math.max(0, localFrame - 3),
    fps,
    config: { damping: 16, mass: 0.8, stiffness: 135 },
  });

  const contentSpring = spring({
    frame: Math.max(0, localFrame - 7),
    fps,
    config: { damping: 16, mass: 0.85, stiffness: 125 },
  });

  // Subtle ambient camera drift (1.0 -> 1.02) so no scene ever looks like a static slide
  const ambientDrift = interpolate(localFrame, [0, totalFrames], [1.0, 1.02], {
    extrapolateRight: 'clamp',
  });

  const stagger = (index: number, baseDelay = 8, stepFrames = 5) =>
    spring({
      frame: Math.max(0, localFrame - (baseDelay + index * stepFrames)),
      fps,
      config: { damping: 16, mass: 0.8, stiffness: 130 },
    });

  return {
    localFrame,
    fps,
    totalFrames,
    layout,
    surface,
    type,
    accents,
    motion: {
      eyebrowSpring,
      headerSpring,
      contentSpring,
      ambientDrift,
      stagger,
    },
  };
}
