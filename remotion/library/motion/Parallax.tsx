import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export interface ParallaxProps {
  children: React.ReactNode;
  depth?: number; // 1 = foreground (moves faster), 0.2 = far background (slow)
  direction?: 'up' | 'down' | 'left' | 'right';
  maxDistance?: number;
  style?: React.CSSProperties;
}

export const Parallax: React.FC<ParallaxProps> = ({
  children,
  depth = 0.5,
  direction = 'up',
  maxDistance = 60,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const progress = frame / (durationInFrames || 1);
  const distance = progress * maxDistance * depth;

  let translateX = 0;
  let translateY = 0;

  if (direction === 'up') translateY = -distance;
  if (direction === 'down') translateY = distance;
  if (direction === 'left') translateX = -distance;
  if (direction === 'right') translateX = distance;

  return (
    <div
      style={{
        transform: `translate(${translateX}px, ${translateY}px)`,
        willChange: 'transform',
        ...style,
      }}
    >
      {children}
    </div>
  );
};
