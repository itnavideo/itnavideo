import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface TextMaskProps {
  text?: string;
  gradientColors?: string[];
  fontSize?: number;
  speed?: number;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * TextMask — Knockout text clipping mask with flowing chromatic mesh background.
 */
export function TextMask({
  text = 'INFINITE VELOCITY',
  gradientColors = ['#ec4899', '#8b5cf6', '#3b82f6', '#10b981'],
  fontSize = 54,
  speed = 1,
  delay = 0,
  width = '100%',
  height = 180,
}: TextMaskProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const intro = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  // Flowing background gradient position
  const bgPos = (t * 2 * speed) % 200;

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
        transform: `scale(${interpolate(intro, [0, 1], [0.92, 1])})`,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <div
        style={{
          fontSize,
          fontWeight: 900,
          letterSpacing: '-0.03em',
          textAlign: 'center',
          background: `linear-gradient(${45 + (t % 360)}deg, ${gradientColors.join(', ')})`,
          backgroundSize: '300% 300%',
          backgroundPosition: `${bgPos}% 50%`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.8))',
        }}
      >
        {text}
      </div>
    </div>
  );
}
