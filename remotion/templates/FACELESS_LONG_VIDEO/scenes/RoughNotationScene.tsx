import React, { useMemo } from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import rough from 'roughjs';
import type { BackgroundColorPalette } from '../../../components/backgrounds/BackgroundCatalog';

export type RoughAnnotationType = 'underline' | 'box' | 'circle' | 'highlight' | 'bracket';

export interface RoughNotationSceneProps {
  heading?: string;
  keyPhrase?: string;
  supportingText?: string;
  annotationType?: RoughAnnotationType;
  accentColor?: string;
  headingFont?: string;
  typographyFont?: string;
  palette?: BackgroundColorPalette;
}

/**
 * Deterministic RoughJS-powered hand-drawn annotation scene.
 * Renders crisp SVG strokes animated via strokeDashoffset on useCurrentFrame().
 */
export const RoughNotationScene: React.FC<RoughNotationSceneProps> = ({
  heading = 'The Core Principle',
  keyPhrase = 'Consistency compounds faster than intensity',
  supportingText = 'Small daily improvements create exponential long-term momentum.',
  annotationType = 'underline',
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
  const strokeColor = accentColor || palette?.accent || '#EA580C';

  const cardEntry = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 120 },
  });

  const drawProgress = interpolate(frame, [10, 38], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Deterministic SVG path generation using roughjs generator (no DOM needed)
  const roughPaths = useMemo(() => {
    const gen = rough.generator();
    const opts = {
      seed: 42,
      roughness: 1.8,
      bowing: 1.4,
      stroke: strokeColor,
      strokeWidth: annotationType === 'highlight' ? 28 : 4.5,
    };

    if (annotationType === 'box') {
      const drawable = gen.rectangle(16, 12, 928, 126, opts);
      return gen.toPaths(drawable);
    }
    if (annotationType === 'circle') {
      const drawable = gen.ellipse(480, 75, 920, 130, opts);
      return gen.toPaths(drawable);
    }
    if (annotationType === 'highlight') {
      const drawable = gen.line(24, 82, 936, 78, {
        ...opts,
        stroke: strokeColor,
        strokeWidth: 46,
        roughness: 1.2,
      });
      return gen.toPaths(drawable);
    }
    if (annotationType === 'bracket') {
      const left = gen.linearPath([[42, 16], [16, 16], [16, 134], [42, 134]], opts);
      const right = gen.linearPath([[918, 16], [944, 16], [944, 134], [918, 134]], opts);
      return [...gen.toPaths(left), ...gen.toPaths(right)];
    }

    // Default: double-stroke hand-drawn underline
    const line1 = gen.line(30, 118, 930, 114, opts);
    const line2 = gen.line(48, 130, 912, 127, { ...opts, seed: 99, strokeWidth: 3 });
    return [...gen.toPaths(line1), ...gen.toPaths(line2)];
  }, [annotationType, strokeColor]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 110px',
        textAlign: 'center',
        opacity: cardEntry,
        transform: `translateY(${interpolate(cardEntry, [0, 1], [28, 0])}px)`,
      }}
    >
      <div
        style={{
          fontFamily: typographyFont,
          fontSize: '22px',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.14em',
          color: strokeColor,
          marginBottom: '22px',
        }}
      >
        {heading}
      </div>

      <div
        style={{
          position: 'relative',
          maxWidth: '1020px',
          padding: '28px 44px',
        }}
      >
        <svg
          width="960"
          height="150"
          viewBox="0 0 960 150"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            overflow: 'visible',
            pointerEvents: 'none',
            opacity: annotationType === 'highlight' ? 0.28 : 0.95,
          }}
        >
          {roughPaths.map((p, idx) => {
            const dashLen = 2200;
            return (
              <path
                key={idx}
                d={p.d}
                fill={p.fill || 'none'}
                stroke={p.stroke || strokeColor}
                strokeWidth={p.strokeWidth || 4}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={dashLen}
                strokeDashoffset={dashLen * (1 - drawProgress)}
              />
            );
          })}
        </svg>

        <h2
          style={{
            position: 'relative',
            zIndex: 2,
            fontFamily: headingFont,
            fontSize: '58px',
            fontWeight: 900,
            lineHeight: 1.16,
            color: textPrimary,
            margin: 0,
          }}
        >
          {keyPhrase}
        </h2>
      </div>

      {supportingText && (
        <p
          style={{
            fontFamily: typographyFont,
            fontSize: '26px',
            fontWeight: 500,
            lineHeight: 1.45,
            color: textSecondary,
            maxWidth: '820px',
            marginTop: '28px',
          }}
        >
          {supportingText}
        </p>
      )}
    </div>
  );
};

