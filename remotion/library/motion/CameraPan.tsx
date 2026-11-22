import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export interface CameraPanProps {
  children: React.ReactNode;
  fromX?: number;
  toX?: number;
  fromY?: number;
  toY?: number;
  delayFrames?: number;
  style?: React.CSSProperties;
}

export const CameraPan: React.FC<CameraPanProps> = ({
  children,
  fromX = -30,
  toX = 30,
  fromY = 0,
  toY = 0,
  delayFrames = 0,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const progress = Math.min(1, Math.max(0, (frame - delayFrames) / (durationInFrames || 1)));
  const currentX = interpolate(progress, [0, 1], [fromX, toX]);
  const currentY = interpolate(progress, [0, 1], [fromY, toY]);

  return (
    <div
      style={{
        transform: `translate(${currentX}px, ${currentY}px)`,
        willChange: 'transform',
        ...style,
      }}
    >
      {children}
    </div>
  );
};
