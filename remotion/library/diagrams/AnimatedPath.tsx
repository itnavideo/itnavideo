import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface AnimatedPathProps {
  d?: string;
  strokeWidth?: number;
  strokeColor?: string;
  glowColor?: string;
  speed?: number;
  showTrail?: boolean;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * AnimatedPath — Glowing kinetic energy path with traveling photon particle.
 * Traces complex SVG spline curves with continuous photon loops and luminescence.
 */
export function AnimatedPath({
  d = 'M 30 100 Q 120 20, 200 100 T 370 100',
  strokeWidth = 3,
  strokeColor = '#06b6d4',
  glowColor = '#06b6d466',
  speed = 1,
  showTrail = true,
  delay = 0,
  width = 400,
  height = 160,
}: AnimatedPathProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const intro = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  // Stroke dashoffset animation
  const dashOffset = (t * 2 * speed) % 600;

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: intro,
      }}
    >
      <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
        {/* Soft Ambient Glow Path */}
        <path
          d={d}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth * 3}
          strokeOpacity={0.2}
          strokeLinecap="round"
        />

        {/* Base Static Guide Wire */}
        <path
          d={d}
          fill="none"
          stroke="rgba(255, 255, 255, 0.15)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Moving Laser Energy Segment */}
        <path
          d={d}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth + 1}
          strokeLinecap="round"
          strokeDasharray="60 340"
          strokeDashoffset={-dashOffset}
        />
      </svg>
    </div>
  );
}
