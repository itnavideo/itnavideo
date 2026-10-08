import React from 'react';
import {
  computeResponsiveLayout,
  TypographyLayoutMode,
} from '../../../../services/typography/responsiveLayoutEngine';
import { resolveFont } from '../../../utils/fonts';

export interface ResponsiveTypographyProps {
  text: string;
  mode?: TypographyLayoutMode;
  fontFamily?: string;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
  availableWidth?: number;
  availableHeight?: number;
  accentColor?: string;
  statData?: {
    value?: string;
    label?: string;
  };
  quoteAuthor?: string;
}

/**
 * Universal Responsive Typography component for 1920x1080 (16:9) video.
 * Dynamically calculates font size, container width, line breaks, and hierarchy
 * to guarantee professional readability and prevent overflow or awkward line wrapping.
 */
export function ResponsiveTypography({
  text,
  mode,
  fontFamily = 'Plus Jakarta Sans',
  color = '#FFFFFF',
  className = '',
  style = {},
  availableWidth,
  availableHeight,
  accentColor = '#F59E0B',
  statData,
  quoteAuthor,
}: ResponsiveTypographyProps) {
  const resolvedFont = resolveFont(fontFamily);
  const layout = computeResponsiveLayout(text, {
    modeOverride: mode,
    availableWidth,
    availableHeight,
  });

  const effectiveStatVal = statData?.value || layout.statData?.value;
  const effectiveStatLbl = statData?.label || layout.statData?.label;

  // Stat Mode: Huge Number + Small Explanation
  if (layout.layoutMode === 'stat' && effectiveStatVal) {
    return (
      <div
        className={`flex flex-col items-center justify-center text-center ${className}`}
        style={{
          maxWidth: `${layout.containerWidth}px`,
          margin: '0 auto',
          ...style,
        }}
      >
        <span
          style={{
            fontFamily: resolvedFont,
            fontSize: `${layout.fontSize}px`,
            fontWeight: 900,
            lineHeight: layout.lineHeight,
            letterSpacing: layout.letterSpacing,
            color: accentColor,
            textShadow: '0 8px 30px rgba(0,0,0,0.6)',
            display: 'block',
            textTransform: 'uppercase',
          }}
        >
          {effectiveStatVal}
        </span>
        {effectiveStatLbl && (
          <span
            style={{
              fontFamily: resolvedFont,
              fontSize: `${layout.statData?.labelFontSize || 28}px`,
              fontWeight: 600,
              lineHeight: 1.35,
              color,
              opacity: 0.9,
              marginTop: '16px',
              maxWidth: '850px',
              display: 'block',
            }}
          >
            {effectiveStatLbl}
          </span>
        )}
      </div>
    );
  }

  // Quote Mode: Large Quote + Attribution
  if (layout.layoutMode === 'quote') {
    return (
      <div
        className={`flex flex-col items-center justify-center text-center ${className}`}
        style={{
          maxWidth: `${layout.containerWidth}px`,
          margin: '0 auto',
          ...style,
        }}
      >
        <blockquote
          style={{
            fontFamily: resolvedFont,
            fontSize: `${layout.fontSize}px`,
            fontWeight: 700,
            lineHeight: layout.lineHeight,
            letterSpacing: layout.letterSpacing,
            color,
            fontStyle: 'italic',
            margin: 0,
            padding: 0,
            textShadow: '0 4px 20px rgba(0,0,0,0.5)',
          }}
        >
          &ldquo;{layout.lines.join(' ')}&rdquo;
        </blockquote>
        {(quoteAuthor || layout.quoteAuthor) && (
          <div
            style={{
              marginTop: '24px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              borderRadius: '9999px',
              border: `1px solid ${accentColor}40`,
              backgroundColor: `${accentColor}18`,
              padding: '8px 24px',
              fontSize: '18px',
              fontWeight: 700,
              color: accentColor,
              letterSpacing: '0.05em',
            }}
          >
            <span>&mdash; {quoteAuthor || layout.quoteAuthor}</span>
          </div>
        )}
      </div>
    );
  }

  // Standard Headline, Short Sentence, Body, Paragraph Modes
  return (
    <div
      className={`flex flex-col items-center justify-center text-center ${className}`}
      style={{
        maxWidth: `${layout.containerWidth}px`,
        margin: '0 auto',
        ...style,
      }}
    >
      <div
        style={{
          fontFamily: resolvedFont,
          fontSize: `${layout.fontSize}px`,
          fontWeight: layout.layoutMode === 'headline' ? 900 : layout.layoutMode === 'short_sentence' ? 800 : 600,
          lineHeight: layout.lineHeight,
          letterSpacing: layout.letterSpacing,
          color,
          textShadow: '0 4px 24px rgba(0,0,0,0.6)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: `${Math.round(layout.fontSize * 0.15)}px`,
        }}
      >
        {layout.lines.map((line, idx) => (
          <span key={idx} style={{ display: 'block', maxWidth: '100%' }}>
            {line}
          </span>
        ))}
      </div>
    </div>
  );
}
