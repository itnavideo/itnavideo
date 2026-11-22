import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface SVGCircleProps {
  cx: number | string;
  cy: number | string;
  r: number;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
  fillOpacity?: number;
  progressPercentage?: number; // 0 - 100 for gauge/radial progress
  pulse?: boolean;
  glow?: boolean;
  delay?: number;
  durationInFrames?: number;
  strokeLinecap?: 'round' | 'butt' | 'square';
  style?: React.CSSProperties;
}

/**
 * SVGCircle — Animated vector circle.
 * Supports progressive circular stroke arc drawing (percentage gauge),
 * elastic spring radius scale pop, and continuous breathing pulse halo.
 */
export function SVGCircle({
  cx = 100,
  cy = 100,
  r = 60,
  stroke = '#10b981',
  strokeWidth = 3,
  fill = 'transparent',
  fillOpacity = 1,
  progressPercentage,
  pulse = false,
  glow = true,
  delay = 0,
  durationInFrames = 40,
  strokeLinecap = 'round',
  style,
}: SVGCircleProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = Math.max(0, frame - delay);

  // Circumference
  const circumference = 2 * Math.PI * r;

  // Spring entrance
  const entrySpr = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
    durationInFrames,
  });

  const progress = interpolate(entrySpr, [0, 1], [0, 1]);

  // Determine dashoffset: percentage or full draw
  let strokeDashoffset = 0;
  if (progressPercentage !== undefined) {
    const targetOffset = circumference * (1 - progressPercentage / 100);
    strokeDashoffset = interpolate(progress, [0, 1], [circumference, targetOffset]);
  } else {
    strokeDashoffset = interpolate(progress, [0, 1], [circumference, 0]);
  }

  // Breathing pulse
  const pulseScale = pulse ? 1 + Math.sin(frame * 0.1) * 0.04 : 1;

  return (
    <g style={{ transformOrigin: `${cx}px ${cy}px`, ...style }}>
      <circle
        cx={cx}
        cy={cy}
        r={r * pulseScale}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap={strokeLinecap}
        fill={fill}
        fillOpacity={fillOpacity * progress}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        transform={`rotate(-90 ${cx} ${cy})`}
        filter={glow ? 'drop-shadow(0px 0px 8px rgba(16, 185, 129, 0.6))' : undefined}
      />
    </g>
  );
}
