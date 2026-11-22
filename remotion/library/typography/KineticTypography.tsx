import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface KineticTypographyProps {
  phrase?: string;
  subphrase?: string;
  accentColor?: string;
  scaleFactor?: number;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * KineticTypography — High-energy word-burst kinetic typography.
 * Scales, snaps, and rotates bold words in rhythm with high-retention video pacing.
 */
export function KineticTypography({
  phrase = 'EXPLOSIVE GROWTH',
  subphrase = 'WITHOUT SPENDING ON ADS',
  accentColor = '#f59e0b',
  scaleFactor = 1.3,
  delay = 0,
  width = '100%',
  height = 200,
}: KineticTypographyProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const snapSpr = spring({
    frame: t,
    fps,
    config: { damping: 10, stiffness: 140, mass: 0.8 },
  });

  const subSpr = spring({
    frame: Math.max(0, t - 10),
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const scale = interpolate(snapSpr, [0, 0.6, 1], [0.4, scaleFactor, 1]);
  const rotate = interpolate(snapSpr, [0, 1], [-8, 0]);

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 20,
        boxSizing: 'border-box',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <div
        style={{
          fontSize: 48,
          fontWeight: 900,
          color: '#ffffff',
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
          transform: `scale(${scale}) rotate(${rotate}deg)`,
          textShadow: `0 8px 30px rgba(0,0,0,0.8), 0 0 20px ${accentColor}44`,
        }}
      >
        <span style={{ color: accentColor }}>{phrase.split(' ')[0]} </span>
        <span>{phrase.split(' ').slice(1).join(' ')}</span>
      </div>

      <div
        style={{
          fontSize: 14,
          fontWeight: 800,
          color: '#94a3b8',
          letterSpacing: '0.15em',
          marginTop: 10,
          opacity: subSpr,
          transform: `translateY(${interpolate(subSpr, [0, 1], [15, 0])}px)`,
        }}
      >
        {subphrase}
      </div>
    </div>
  );
}
