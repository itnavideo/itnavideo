import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface GradientStop {
  offset: string | number;
  color: string;
  opacity?: number;
}

export interface SVGGradientProps {
  id: string;
  type?: 'linear' | 'radial';
  stops?: GradientStop[];
  angle?: number;
  animatedAngle?: boolean;
  speed?: number;
  cx?: string;
  cy?: string;
  r?: string;
}

/**
 * SVGGradient — Reusable dynamic SVG gradient generator.
 * Produces animated linear and radial gradients with frame-driven
 * angle rotation and color stop luminescence.
 */
export function SVGGradient({
  id,
  type = 'linear',
  stops = [
    { offset: '0%', color: '#10b981', opacity: 1 },
    { offset: '100%', color: '#6366f1', opacity: 1 },
  ],
  angle = 45,
  animatedAngle = false,
  speed = 1,
  cx = '50%',
  cy = '50%',
  r = '50%',
}: SVGGradientProps) {
  const frame = useCurrentFrame();

  const currentAngle = animatedAngle ? (angle + frame * speed) % 360 : angle;
  const rad = (currentAngle * Math.PI) / 180;

  // Linear gradient angle coordinates
  const x1 = `${(50 - Math.cos(rad) * 50).toFixed(1)}%`;
  const y1 = `${(50 - Math.sin(rad) * 50).toFixed(1)}%`;
  const x2 = `${(50 + Math.cos(rad) * 50).toFixed(1)}%`;
  const y2 = `${(50 + Math.sin(rad) * 50).toFixed(1)}%`;

  if (type === 'radial') {
    return (
      <radialGradient id={id} cx={cx} cy={cy} r={r}>
        {stops.map((stop, index) => (
          <stop
            key={index}
            offset={stop.offset}
            stopColor={stop.color}
            stopOpacity={stop.opacity !== undefined ? stop.opacity : 1}
          />
        ))}
      </radialGradient>
    );
  }

  return (
    <linearGradient id={id} x1={x1} y1={y1} x2={x2} y2={y2}>
      {stops.map((stop, index) => (
        <stop
          key={index}
          offset={stop.offset}
          stopColor={stop.color}
          stopOpacity={stop.opacity !== undefined ? stop.opacity : 1}
        />
      ))}
    </linearGradient>
  );
}
