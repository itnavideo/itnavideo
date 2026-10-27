import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { getBackgroundPalette, type BackgroundColorPalette } from '../../../components/backgrounds/BackgroundCatalog';

interface HighlightTextProps {
  text: string;
  highlightedWords?: string[];
  accentColor?: string;
  fontFamily?: string;
  className?: string;
  style?: React.CSSProperties;
  markerColor?: string;
  themeId?: string;
  palette?: BackgroundColorPalette;
  textColor?: string;
}

export function HighlightText({
  text,
  highlightedWords = [],
  accentColor,
  fontFamily = 'Montserrat, Inter, system-ui, sans-serif',
  className = '',
  style = {},
  markerColor,
  themeId,
  palette: customPalette,
  textColor: customTextColor,
}: HighlightTextProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const palette = customPalette || getBackgroundPalette(themeId);
  const resolvedAccent = accentColor || palette.accent;
  const resolvedMarker = markerColor || palette.highlightBg;
  const resolvedTextColor = customTextColor || palette.textPrimary;

  if (!text) return null;

  const words = text.split(/\s+/);
  const highlightSet = new Set(
    (highlightedWords || [])
      .filter(Boolean)
      .map((w) => String(w).toLowerCase().replace(/[^a-zA-Z0-9]/g, ''))
  );

  return (
    <div
      className={`text-2xl font-semibold leading-relaxed ${className}`}
      style={{ fontFamily, color: resolvedTextColor, ...style }}
    >
      {words.map((word, idx) => {
        const clean = String(word || '').toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
        const isHighlighted = highlightSet.has(clean);

        // Staggered marker animation spring
        const wordDelay = Math.min(18, idx * 2);
        const markerSpring = spring({
          frame: Math.max(0, frame - wordDelay),
          fps,
          config: { damping: 12, stiffness: 140 },
        });

        if (isHighlighted) {
          // Detect negative / anti-pattern words (e.g. 'waste', 'trap', 'mistake') for solid Crimson Red box
          const isNegative = /^(waste|trap|mistake|fail|avoid|wrong|stop|danger|never|fake|bad|broke|lose|quit|quitting)$/i.test(clean);
          const isBrandHighlight = /^(money|freedom|rich|success|invest|future|grow|victory|win|goal|power|opportunity)$/i.test(clean);
          const bg = isNegative 
            ? '#EF4444' 
            : isBrandHighlight 
              ? 'linear-gradient(135deg, #FF5722 0%, #FF7043 50%, #FFA000 100%)' 
              : resolvedMarker || 'linear-gradient(135deg, #FF5722 0%, #FFA000 100%)';
          const textColor = '#FFFFFF';

          return (
            <span
              key={idx}
              style={{
                position: 'relative',
                display: 'inline-block',
                margin: '0 5px',
                transform: `scale(${0.92 + markerSpring * 0.08}) rotate(-1deg)`,
                verticalAlign: 'baseline',
              }}
            >
              {/* Top-Tier Documentary Marker Box */}
              <span
                style={{
                  position: 'relative',
                  zIndex: 2,
                  display: 'inline-block',
                  padding: '3px 12px',
                  borderRadius: '6px',
                  background: bg,
                  color: textColor,
                  fontWeight: 900,
                  letterSpacing: '-0.02em',
                  boxShadow: '0 6px 18px rgba(0, 0, 0, 0.45), 0 0 25px rgba(255, 87, 34, 0.4)',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.6)',
                }}
              >
                {word}
              </span>
              {' '}
            </span>
          );
        }

        return (
          <span key={idx}>
            <span style={{ color: resolvedTextColor }}>{word}</span>
            {' '}
          </span>
        );
      })}
    </div>
  );
}
