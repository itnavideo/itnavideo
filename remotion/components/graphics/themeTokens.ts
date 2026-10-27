/**
 * Centralized Design System Tokens for Itnavideo Motion Graphics
 * Supports Adaptive Dual-Theme (Clean White Editorial & Dark Slate)
 * Reference: docs/ITNAVIDEO_PROJECT_CONTEXT.md & Section 9 of AGENTS.md
 */

export type ThemeMode = 'light' | 'dark' | 'auto';

export interface ThemePalette {
  mode: 'light' | 'dark';
  /** Card & surface background */
  surface: string;
  /** Secondary card background */
  surfaceSubtle: string;
  /** High contrast foreground text */
  textPrimary: string;
  /** Secondary subtitle / caption text */
  textMuted: string;
  /** Border outline */
  border: string;
  /** Stronger border outline for active / selected elements */
  borderStrong: string;
  /** Primary signature accent (Flame orange / amber) */
  accent: string;
  /** Subtle background wash for badges and tags */
  badgeBg: string;
  /** Box shadow elevation */
  shadow: string;
  /** Subtitle / pill container background */
  pillBg: string;
}

export const LIGHT_THEME: ThemePalette = {
  mode: 'light',
  surface: '#FFFFFF',
  surfaceSubtle: '#F8FAFC',
  textPrimary: '#0F172A',
  textMuted: '#64748B',
  border: 'rgba(0, 0, 0, 0.08)',
  borderStrong: 'rgba(0, 0, 0, 0.16)',
  accent: '#EA580C', // Flame orange
  badgeBg: 'rgba(234, 88, 12, 0.08)',
  shadow: '0 20px 40px -15px rgba(0, 0, 0, 0.07), 0 0 1px rgba(0, 0, 0, 0.1)',
  pillBg: 'rgba(255, 255, 255, 0.95)',
};

export const DARK_THEME: ThemePalette = {
  mode: 'dark',
  surface: '#0F172A',
  surfaceSubtle: '#1E293B',
  textPrimary: '#FFFFFF',
  textMuted: '#94A3B8',
  border: 'rgba(255, 255, 255, 0.12)',
  borderStrong: 'rgba(255, 255, 255, 0.22)',
  accent: '#FF5722', // Neon amber / flame orange
  badgeBg: 'rgba(255, 87, 34, 0.12)',
  shadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 1px rgba(255, 255, 255, 0.15)',
  pillBg: 'rgba(15, 23, 42, 0.92)',
};

/**
 * Calculates perceived brightness from hex or rgb color string.
 * Returns true if light background, false if dark.
 */
function isLightColor(colorStr: string): boolean {
  if (!colorStr) return false;
  const hex = colorStr.replace('#', '').trim();
  if (hex.length === 6) {
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    // Relative luminance formula per ITU-R BT.709
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luminance > 140;
  }
  return false;
}

/**
 * Predictable Theme Resolver
 * Explicit light/dark takes top priority.
 * Fallback to canvas background luminance if valid hex, else documented default (dark).
 */
export function resolveTheme(
  preference?: ThemeMode,
  canvasBgColor?: string,
  defaultMode: 'light' | 'dark' = 'dark'
): ThemePalette {
  if (preference === 'light') return LIGHT_THEME;
  if (preference === 'dark') return DARK_THEME;
  if (preference === 'auto' && canvasBgColor) {
    return isLightColor(canvasBgColor) ? LIGHT_THEME : DARK_THEME;
  }
  return defaultMode === 'light' ? LIGHT_THEME : DARK_THEME;
}
