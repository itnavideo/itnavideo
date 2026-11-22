import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface TextOutlineProps {
  text?: string;
  strokeWidth?: number;
  strokeColor?: string;
  fillOpacity?: number;
  fontSize?: number;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * TextOutline — Hollow neon wireframe stroked outline typography.
 */
export function TextOutline({
  text = 'TRANSCENDENTAL',
  strokeWidth = 2,
  strokeColor = '#a855f7',
  fillOpacity = 0,
  fontSize = 52,
  delay = 0,
  width = '100%',
  height = 160,
}: TextOutlineProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const intro = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  const pulse = 0.8 + Math.sin(t * 0.1) * 0.2;

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
          color: fillOpacity > 0 ? `rgba(255, 255, 255, ${fillOpacity})` : 'transparent',
          WebkitTextStroke: `${strokeWidth}px ${strokeColor}`,
          letterSpacing: '0.04em',
          textAlign: 'center',
          filter: `drop-shadow(0 0 ${16 * pulse}px ${strokeColor})`,
        }}
      >
        {text}
      </div>
    </div>
  );
}
