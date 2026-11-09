import React, { createContext, useContext, useMemo } from 'react';
import {
  type VideoVisualTheme,
  type DeepPartial,
  MASTER_THEMES,
  resolveVisualTheme,
  calculateSafeArea,
  type SafeAreaBounds,
} from '../../services/design/visualDesignSystem';

export * from '../../services/design/visualDesignSystem';

// Default React Context initialized to modern-saas
export const VideoVisualThemeContext = createContext<VideoVisualTheme>(
  MASTER_THEMES['modern-saas']
);

export interface VideoVisualThemeProviderProps {
  theme?: string | Partial<VideoVisualTheme>;
  sceneOverrides?: DeepPartial<VideoVisualTheme>;
  layerOverrides?: DeepPartial<VideoVisualTheme>;
  children: React.ReactNode;
}

/**
 * Provider that injects the resolved 3-tier visual theme into Remotion compositions and scenes
 */
export const VideoVisualThemeProvider: React.FC<VideoVisualThemeProviderProps> = ({
  theme,
  sceneOverrides,
  layerOverrides,
  children,
}) => {
  const resolved = useMemo(() => {
    return resolveVisualTheme(theme, sceneOverrides, layerOverrides);
  }, [theme, sceneOverrides, layerOverrides]);

  return React.createElement(
    VideoVisualThemeContext.Provider,
    { value: resolved },
    children
  );
};

/**
 * Hook to consume the current visual theme inside any Remotion scene or component
 */
export function useVideoVisualTheme(): VideoVisualTheme {
  const context = useContext(VideoVisualThemeContext);
  return context || MASTER_THEMES['modern-saas'];
}

/**
 * Helper to build card container CSS inline styles from the active theme
 */
export function getThemedCardStyles(
  theme: VideoVisualTheme,
  extra?: React.CSSProperties
): React.CSSProperties {
  const isDark = theme.colors.mode === 'dark';
  const bg =
    theme.shapes.backdrop === 'frosted-glass'
      ? theme.colors.surface + 'EE'
      : theme.shapes.backdrop === 'subtle'
        ? theme.colors.surfaceSubtle
        : theme.colors.surface;

  return {
    backgroundColor: bg,
    backdropFilter: theme.shapes.backdrop === 'frosted-glass' ? 'blur(16px)' : undefined,
    WebkitBackdropFilter: theme.shapes.backdrop === 'frosted-glass' ? 'blur(16px)' : undefined,
    borderRadius: theme.shapes.radiusPx,
    border: theme.shapes.borderStyle,
    boxShadow: theme.shapes.shadowStyle,
    padding: theme.shapes.cardPadding,
    color: theme.colors.text,
    fontFamily: theme.typography.bodyFont,
    ...extra,
  };
}

/**
 * Helper to build pill badge CSS inline styles from the active theme
 */
export function getThemedPillStyles(
  theme: VideoVisualTheme,
  variant: 'default' | 'accent' | 'primary' = 'default',
  extra?: React.CSSProperties
): React.CSSProperties {
  const bg =
    variant === 'accent'
      ? theme.colors.accent + '22'
      : variant === 'primary'
        ? theme.colors.badgeBg
        : theme.colors.pillBg;

  const color =
    variant === 'accent'
      ? theme.colors.accent
      : variant === 'primary'
        ? theme.colors.primary
        : theme.colors.text;

  const border =
    variant === 'accent'
      ? `1px solid ${theme.colors.accent}44`
      : variant === 'primary'
        ? theme.colors.borderStrong
        : theme.colors.border;

  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    backgroundColor: bg,
    color,
    borderRadius: 9999,
    padding: theme.shapes.pillPadding,
    border,
    fontSize: 16,
    fontWeight: 600,
    fontFamily: theme.typography.headingFont,
    ...extra,
  };
}

