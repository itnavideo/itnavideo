import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export type ArrowDirection = 'curve_right_down' | 'curve_left_up' | 'loop_around' | 'direct_pointer';

export interface DynamicCurvedArrowProps {
  /** Direction / trajectory of the drawn arrow */
  direction?: ArrowDirection;
  /** Stroke color (defaults to theme accent or custom) */
  color?: string;
  /** Stroke width in pixels */
  strokeWidth?: number;
  /** Delay in frames before the stroke starts animating */
  delayFrames?: number;
  /** Duration in frames to complete the drawing */
  drawDurationFrames?: number;
  /** Whether to animate drawing or render static */
  animated?: boolean;
  /** Width in pixels or CSS percentage */
  width?: number | string;
  /** Height in pixels or CSS percentage */
  height?: number | string;
  style?: React.CSSProperties;
  className?: string;
}

const ARROW_PATHS: Record<ArrowDirection, { d: string; headD: string; len: number; viewBox: string }> = {
  curve_right_down: {
    d: 'M 10 15 C 60 10, 110 40, 130 95',
    headD: 'M 115 88 L 130 95 L 132 78',
    len: 160,
    viewBox: '0 0 150 110',
  },
  curve_left_up: {
    d: 'M 140 95 C 90 90, 40 60, 20 15',
    headD: 'M 35 22 L 20 15 L 18 32',
    len: 160,
    viewBox: '0 0 150 110',
  },
  loop_around: {
    d: 'M 20 70 C 10 20, 80 10, 110 45 C 130 70, 90 100, 60 85',
    headD: 'M 75 92 L 60 85 L 70 72',
    len: 260,
    viewBox: '0 0 140 110',
  },
  direct_pointer: {
    d: 'M 15 50 Q 70 35 125 50',
    headD: 'M 112 40 L 125 50 L 112 60',
    len: 120,
    viewBox: '0 0 140 100',
  },
};

/**
 * Lightweight SVG animated sketch arrow with organic stroke-dashoffset interpolation.
 */
export const DynamicCurvedArrow: React.FC<DynamicCurvedArrowProps> = ({
  direction = 'curve_right_down',
  color = '#EA580C',
  strokeWidth = 3.5,
  delayFrames = 0,
  drawDurationFrames = 16,
  animated = true,
  width = 120,
  height = 90,
  style = {},
  className = '',
}) => {
  const frame = useCurrentFrame();
  const pathConfig = ARROW_PATHS[direction] || ARROW_PATHS.curve_right_down;

  const progress = animated
    ? interpolate(frame, [delayFrames, delayFrames + drawDurationFrames], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1;

  const strokeDashoffset = pathConfig.len * (1 - progress);
  const headOpacity = animated
    ? interpolate(progress, [0.75, 1], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1;

  return (
    <svg
      viewBox={pathConfig.viewBox}
      className={className}
      style={{
        width,
        height,
        overflow: 'visible',
        display: 'inline-block',
        ...style,
      }}
    >
      {/* Main Curve */}
      <path
        d={pathConfig.d}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: pathConfig.len,
          strokeDashoffset,
        }}
      />
      {/* Arrowhead */}
      <path
        d={pathConfig.headD}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          opacity: headOpacity,
        }}
      />
    </svg>
  );
};

export default DynamicCurvedArrow;
