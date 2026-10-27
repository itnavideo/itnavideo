import React from 'react';
import { resolveTheme, ThemeMode, ThemePalette } from './themeTokens';

export interface AdaptiveCardProps {
  children: React.ReactNode;
  theme?: ThemeMode;
  canvasBgColor?: string;
  defaultMode?: 'light' | 'dark';
  variant?: 'flat' | 'elevated' | 'bordered';
  padding?: string | number;
  borderRadius?: string | number;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Universal Card Container that adapts contrast, borders, and shadows
 * to the video canvas background theme.
 */
export const AdaptiveCard: React.FC<AdaptiveCardProps> = ({
  children,
  theme = 'auto',
  canvasBgColor,
  defaultMode = 'dark',
  variant = 'elevated',
  padding = '24px 32px',
  borderRadius = '20px',
  style = {},
  className = '',
}) => {
  const palette: ThemePalette = resolveTheme(theme, canvasBgColor, defaultMode);

  const baseStyle: React.CSSProperties = {
    backgroundColor: palette.surface,
    border: variant === 'flat' ? 'none' : `1px solid ${palette.border}`,
    boxShadow: variant === 'elevated' ? palette.shadow : 'none',
    color: palette.textPrimary,
    padding,
    borderRadius,
    transition: 'all 0.2s ease',
    ...style,
  };

  return (
    <div className={className} style={baseStyle}>
      {children}
    </div>
  );
};

export default AdaptiveCard;
