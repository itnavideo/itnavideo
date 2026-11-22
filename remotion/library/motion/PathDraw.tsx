import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface PathDrawProps {
  pathD: string;
  strokeColor?: string;
  strokeWidth?: number;
  approxPathLength?: number;
  delayFrames?: number;
  style?: React.CSSProperties;
}

export const PathDraw: React.FC<PathDrawProps> = ({
  pathD,
  strokeColor = '#0066FF',
  strokeWidth = 3,
  approxPathLength = 1000,
  delayFrames = 0,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping: 15, stiffness: 85 },
  });

  const strokeDashoffset = interpolate(progress, [0, 1], [approxPathLength, 0]);

  return (
    <path
      d={pathD}
      fill="none"
      stroke={strokeColor}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeDasharray={approxPathLength}
      strokeDashoffset={strokeDashoffset}
      style={style}
    />
  );
};
