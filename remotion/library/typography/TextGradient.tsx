import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface TextGradientProps {
  text?: string;
  gradientAngle?: number;
  fromColor?: string;
  viaColor?: string;
  toColor?: string;
  fontSize?: number;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * TextGradient — Multi-stop chromatic gradient typography.
 * Smoothly interpolates vibrant linear gradient fills across bold headlines.
 */
export function TextGradient({
  text = 'CHROMATIC LUMINESCENCE',
  gradientAngle = 135,
  fromColor = '#f59e0b',
  viaColor = '#ec4899',
  toColor = '#8b5cf6',
  fontSize = 44,
  delay = 0,
  width = '100%',
  height = 160,
}: TextGradientProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const intro = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  // Animated gradient angle rotation
  const angle = (gradientAngle + t * 0.8) % 360;

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
        opacity: intro,
        transform: `translateY(${interpolate(intro, [0, 1], [15, 0])}px)`,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <div
        style={{
          fontSize,
          fontWeight: 900,
          letterSpacing: '-0.02em',
          textAlign: 'center',
          background: `linear-gradient(${angle}deg, ${fromColor}, ${viaColor}, ${toColor})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 10px 24px rgba(0,0,0,0.8))',
        }}
      >
        {text}
      </div>
    </div>
  );
}
