import React, { useId } from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface SVGPathProps {
  d: string;
  stroke?: string;
  strokeWidth?: number;
  strokeLinecap?: 'round' | 'butt' | 'square';
  strokeLinejoin?: 'round' | 'miter' | 'bevel';
  fill?: string;
  fillOpacity?: number;
  drawDuration?: number; // in frames
  delay?: number;
  glow?: boolean;
  glowColor?: string;
  dashed?: boolean;
  dashArray?: string;
  style?: React.CSSProperties;
}

/**
 * SVGPath — Animated vector path with progressive stroke drawing.
 * Employs stroke-dashoffset interpolation to draw intricate vector curves,
 * icons, handwriting, and custom contours with optional neon glow.
 */
export function SVGPath({
  d,
  stroke = '#10b981',
  strokeWidth = 3,
  strokeLinecap = 'round',
  strokeLinejoin = 'round',
  fill = 'transparent',
  fillOpacity = 1,
  drawDuration = 45,
  delay = 0,
  glow = true,
  glowColor,
  dashed = false,
  dashArray = '8 6',
  style,
}: SVGPathProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const filterId = useId();

  const activeGlowColor = glowColor || stroke;
  const adjustedFrame = Math.max(0, frame - delay);

  // Progressive draw progress 0 to 1
  const drawSpring = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 18, stiffness: 90, mass: 0.9 },
    durationInFrames: drawDuration,
  });

  const progress = interpolate(drawSpring, [0, 1], [0, 1]);

  // Dashoffset calculation (approximating 1000 length baseline)
  const pathLength = 1000;
  const dashoffset = interpolate(progress, [0, 1], [pathLength, 0]);

  // Fill opacity fades in after stroke completes
  const fillFade = interpolate(progress, [0.7, 1], [0, fillOpacity], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <g style={style}>
      {glow && (
        <defs>
          <filter id={`glow-${filterId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation={strokeWidth * 1.5} result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      )}

      {/* Main Path Element */}
      <path
        d={d}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap={strokeLinecap}
        strokeLinejoin={strokeLinejoin}
        fill={fill}
        fillOpacity={fillFade}
        pathLength={pathLength}
        strokeDasharray={dashed ? dashArray : pathLength}
        strokeDashoffset={dashed ? undefined : dashoffset}
        filter={glow ? `url(#glow-${filterId})` : undefined}
        style={{
          transition: 'none',
        }}
      />
    </g>
  );
}
