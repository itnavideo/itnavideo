import React, { useId } from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { SVGMarker } from './SVGMarker';

export interface SVGArrowProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  curve?: number; // pixel offset for quadratic bezier curve
  color?: string;
  strokeWidth?: number;
  arrowType?: 'arrow-head' | 'stealth-arrow' | 'diamond';
  dashed?: boolean;
  animated?: boolean;
  delay?: number;
  durationInFrames?: number;
  glow?: boolean;
}

/**
 * SVGArrow — Dynamic animated vector arrow.
 * Connects any two spatial coordinates with configurable curvature,
 * progressive stroke drawing, custom arrowheads, and glow halos.
 */
export function SVGArrow({
  x1 = 50,
  y1 = 50,
  x2 = 250,
  y2 = 200,
  curve = 30,
  color = '#10b981',
  strokeWidth = 3,
  arrowType = 'arrow-head',
  dashed = false,
  animated = true,
  delay = 0,
  durationInFrames = 35,
  glow = true,
}: SVGArrowProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const markerId = useId();

  const adjustedFrame = Math.max(0, frame - delay);

  // Progressive draw spring
  const spr = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 15, stiffness: 100, mass: 0.8 },
    durationInFrames,
  });

  const progress = animated ? interpolate(spr, [0, 1], [0, 1]) : 1;
  const pathLen = 1000;
  const dashoffset = interpolate(progress, [0, 1], [pathLen, 0]);

  // Quadratic control point
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  // Normal vector for curve displacement
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;

  const cx = midX + nx * curve;
  const cy = midY + ny * curve;

  const pathD = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;

  return (
    <g>
      <defs>
        <SVGMarker id={`marker-${markerId}`} type={arrowType} color={color} size={strokeWidth * 2.8} />
      </defs>

      <path
        d={pathD}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
        pathLength={pathLen}
        strokeDasharray={dashed ? '8 6' : (animated ? pathLen : undefined)}
        strokeDashoffset={animated && !dashed ? dashoffset : undefined}
        markerEnd={`url(#marker-${markerId})`}
        filter={glow ? 'drop-shadow(0px 0px 6px rgba(16, 185, 129, 0.6))' : undefined}
      />
    </g>
  );
}
