import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Star, Circle, Arrow } from '@remotion/shapes';
import type { BackgroundColorPalette } from '../../../components/backgrounds/BackgroundCatalog';

export interface KineticKitSceneProps {
  heading?: string;
  supportingText?: string;
  badgeText?: string;
  metricValue?: string;
  metricProgress?: number; // 0 to 100
  accentColor?: string;
  headingFont?: string;
  typographyFont?: string;
  palette?: BackgroundColorPalette;
}

/**
 * High-retention Kinetic Kit Scene (inspired by remotion-bits & remotion-kinetic-kit).
 * Combines @remotion/shapes geometric accents, staggered word-by-word spring pop,
 * and an animated metric progress bar.
 */
export const KineticKitScene: React.FC<KineticKitSceneProps> = ({
  heading = 'Unlock Exponential Growth Today',
  supportingText = 'Every word hits with purpose, rhythm, and visual clarity.',
  badgeText = 'KEY TAKEAWAY',
  metricValue = '94%',
  metricProgress = 94,
  accentColor = '#EA580C',
  headingFont = 'Inter, sans-serif',
  typographyFont = 'Inter, sans-serif',
  palette,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isDark = palette?.isDark ?? false;
  const textPrimary = palette?.textPrimary ?? (isDark ? '#FFFFFF' : '#0F172A');
  const textSecondary = palette?.textSecondary ?? (isDark ? '#94A3B8' : '#475569');
  const cardBg = palette?.cardBg ?? (isDark ? 'rgba(15, 23, 42, 0.85)' : '#FFFFFF');
  const cardBorder = palette?.cardBorder ?? (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.1)');
  const accent = accentColor || palette?.accent || '#EA580C';

  const words = (heading || 'Key Takeaway').split(/\s+/).filter(Boolean);
  const floatY = Math.sin((frame / fps) * 2.2) * 10;
  const starRot = (frame / fps) * 24;
  const barFill = interpolate(frame, [12, 46], [0, Math.min(100, Math.max(0, metricProgress))], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 120px',
        textAlign: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Floating @remotion/shapes Geometric Accents */}
      <div
        style={{
          position: 'absolute',
          top: '14%',
          left: '9%',
          transform: `translateY(${floatY}px) rotate(${starRot}deg)`,
          opacity: 0.85,
          pointerEvents: 'none',
        }}
      >
        <Star points={5} innerRadius={18} outerRadius={36} fill={accent} />
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: '18%',
          right: '10%',
          transform: `translateY(${-floatY}px)`,
          opacity: 0.22,
          pointerEvents: 'none',
        }}
      >
        <Circle radius={48} fill={accent} />
      </div>

      <div
        style={{
          position: 'absolute',
          top: '20%',
          right: '13%',
          transform: `translateY(${floatY * 0.7}px) rotate(-18deg)`,
          opacity: 0.7,
          pointerEvents: 'none',
        }}
      >
        <Arrow length={72} fill={accent} />
      </div>

      {/* Badge */}
      <div
        style={{
          padding: '8px 20px',
          borderRadius: '9999px',
          backgroundColor: `${accent}18`,
          border: `1.5px solid ${accent}55`,
          color: accent,
          fontFamily: typographyFont,
          fontSize: '16px',
          fontWeight: 900,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          marginBottom: '26px',
        }}
      >
        {badgeText}
      </div>

      {/* Staggered Word-Pop Kinetic Headline */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '14px 18px',
          maxWidth: '1120px',
          marginBottom: '26px',
        }}
      >
        {words.map((word, idx) => {
          const wordSpring = spring({
            frame: Math.max(0, frame - idx * 3),
            fps,
            config: { damping: 13, stiffness: 180, mass: 0.7 },
          });
          const isHighlightWord = idx === words.length - 1 || idx === 1;
          return (
            <span
              key={`${word}-${idx}`}
              style={{
                display: 'inline-block',
                fontFamily: headingFont,
                fontSize: '66px',
                fontWeight: 900,
                lineHeight: 1.08,
                color: isHighlightWord ? accent : textPrimary,
                opacity: wordSpring,
                transform: `translateY(${interpolate(wordSpring, [0, 1], [30, 0])}px) scale(${interpolate(wordSpring, [0, 1], [0.85, 1])})`,
              }}
            >
              {word}
            </span>
          );
        })}
      </div>

      {supportingText && (
        <p
          style={{
            fontFamily: typographyFont,
            fontSize: '26px',
            fontWeight: 500,
            lineHeight: 1.45,
            color: textSecondary,
            maxWidth: '860px',
            margin: '0 0 34px',
          }}
        >
          {supportingText}
        </p>
      )}

      {/* Animated KPI Progress Pill */}
      <div
        style={{
          width: '460px',
          padding: '16px 24px',
          borderRadius: '20px',
          backgroundColor: cardBg,
          border: `1.5px solid ${cardBorder}`,
          boxShadow: '0 16px 36px rgba(0,0,0,0.08)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
            fontFamily: typographyFont,
            fontSize: '16px',
            fontWeight: 800,
            color: textPrimary,
          }}
        >
          <span>IMPACT SCORE</span>
          <span style={{ color: accent, fontSize: '20px', fontWeight: 900 }}>{metricValue}</span>
        </div>
        <div
          style={{
            width: '100%',
            height: '10px',
            borderRadius: '9999px',
            backgroundColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.08)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${barFill}%`,
              height: '100%',
              borderRadius: '9999px',
              backgroundColor: accent,
            }}
          />
        </div>
      </div>
    </div>
  );
};

