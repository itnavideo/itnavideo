import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface SVGLineProps {
  x1: number | string;
  y1: number | string;
  x2: number | string;
  y2: number | string;
  stroke?: string;
  strokeWidth?: number;
  strokeLinecap?: 'round' | 'butt' | 'square';
  dashed?: boolean;
  dashArray?: string;
  animated?: boolean;
  pulsePacket?: boolean;
  packetColor?: string;
  delay?: number;
  durationInFrames?: number;
  style?: React.CSSProperties;
}

/**
 * SVGLine — Dynamic animated vector line with progressive draw
 * and animated high-velocity data packet pulse traversing the line.
 */
export function SVGLine({
  x1 = 0,
  y1 = 0,
  x2 = 200,
  y2 = 200,
  stroke = '#10b981',
  strokeWidth = 2.5,
  strokeLinecap = 'round',
  dashed = false,
  dashArray = '6 6',
  animated = true,
  pulsePacket = false,
  packetColor = '#38bdf8',
  delay = 0,
  durationInFrames = 30,
  style,
}: SVGLineProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = Math.max(0, frame - delay);

  // Progressive draw
  const spr = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 15, stiffness: 100, mass: 0.8 },
    durationInFrames,
  });

  const progress = animated ? interpolate(spr, [0, 1], [0, 1]) : 1;
  const lineLength = 1000;
  const dashoffset = interpolate(progress, [0, 1], [lineLength, 0]);

  // Pulse packet traveling along line
  const packetProgress = (frame % 45) / 45;

  const numX1 = typeof x1 === 'number' ? x1 : parseFloat(x1);
  const numY1 = typeof y1 === 'number' ? y1 : parseFloat(y1);
  const numX2 = typeof x2 === 'number' ? x2 : parseFloat(x2);
  const numY2 = typeof y2 === 'number' ? y2 : parseFloat(y2);

  const packetX = numX1 + (numX2 - numX1) * packetProgress;
  const packetY = numY1 + (numY2 - numY1) * packetProgress;

  return (
    <g style={style}>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap={strokeLinecap}
        strokeDasharray={dashed ? dashArray : (animated ? lineLength : undefined)}
        strokeDashoffset={animated && !dashed ? dashoffset : undefined}
        pathLength={lineLength}
      />

      {pulsePacket && (
        <circle
          cx={packetX}
          cy={packetY}
          r={strokeWidth * 1.6}
          fill={packetColor}
          filter="drop-shadow(0px 0px 6px #38bdf8)"
        />
      )}
    </g>
  );
}
