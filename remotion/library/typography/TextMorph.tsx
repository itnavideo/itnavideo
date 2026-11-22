import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface TextMorphProps {
  phraseA?: string;
  phraseB?: string;
  morphFrame?: number;
  accentColor?: string;
  fontSize?: number;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * TextMorph — Interpolated phrase-to-phrase metamorphic transition.
 * Morphs one statement into another via synchronized blur filtration and character displacement.
 */
export function TextMorph({
  phraseA = 'MANUAL VIDEO EDITING',
  phraseB = 'AI COMPUTATIONAL CREATION',
  morphFrame = 35,
  accentColor = '#3b82f6',
  fontSize = 36,
  delay = 0,
  width = '100%',
  height = 140,
}: TextMorphProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const morphSpr = spring({
    frame: Math.max(0, t - morphFrame),
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  const isB = t >= morphFrame;
  const blurA = interpolate(morphSpr, [0, 1], [0, 12]);
  const opacityA = interpolate(morphSpr, [0, 0.7, 1], [1, 0.2, 0]);

  const blurB = interpolate(morphSpr, [0, 1], [12, 0]);
  const opacityB = interpolate(morphSpr, [0, 0.3, 1], [0, 0.8, 1]);
  const scaleB = interpolate(morphSpr, [0, 1], [0.9, 1]);

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        boxSizing: 'border-box',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Phrase A */}
      <div
        style={{
          position: 'absolute',
          fontSize,
          fontWeight: 900,
          color: '#ef4444',
          opacity: opacityA,
          filter: `blur(${blurA}px)`,
          textAlign: 'center',
          letterSpacing: '-0.02em',
        }}
      >
        {phraseA}
      </div>

      {/* Phrase B */}
      <div
        style={{
          position: 'absolute',
          fontSize,
          fontWeight: 900,
          color: accentColor,
          opacity: opacityB,
          filter: `blur(${blurB}px)`,
          transform: `scale(${scaleB})`,
          textAlign: 'center',
          letterSpacing: '-0.02em',
          textShadow: `0 0 20px ${accentColor}66`,
        }}
      >
        {phraseB}
      </div>
    </div>
  );
}
