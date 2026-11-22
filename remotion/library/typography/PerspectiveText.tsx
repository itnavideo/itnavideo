import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface PerspectiveTextProps {
  headline?: string;
  tagline?: string;
  tiltAngle?: number;
  accentColor?: string;
  fontSize?: number;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * PerspectiveText — Angled 3D floor/ceiling perspective plane projection.
 * Projects text along an inclined geometric plane with vanishing point depth.
 */
export function PerspectiveText({
  headline = 'THE NEXT GENERATION',
  tagline = 'OF VIRAL VIDEO PRODUCTION',
  tiltAngle = 45,
  accentColor = '#f59e0b',
  fontSize = 38,
  delay = 0,
  width = '100%',
  height = 180,
}: PerspectiveTextProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const intro = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

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
        perspective: 600,
        opacity: intro,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <div
        style={{
          transform: `rotateX(${tiltAngle}deg) scale(${interpolate(intro, [0, 1], [0.8, 1])})`,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize,
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: '0.08em',
            textShadow: `0 10px 20px rgba(0,0,0,0.8), 0 0 30px ${accentColor}44`,
          }}
        >
          {headline}
        </div>
        <div
          style={{
            fontSize: fontSize * 0.45,
            fontWeight: 700,
            color: accentColor,
            letterSpacing: '0.22em',
            marginTop: 4,
          }}
        >
          {tagline}
        </div>
      </div>
    </div>
  );
}
