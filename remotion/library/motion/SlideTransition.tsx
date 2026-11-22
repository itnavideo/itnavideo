import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface SlideTransitionProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  delayFrames?: number;
  springConfig?: { damping?: number; stiffness?: number; mass?: number };
  style?: React.CSSProperties;
}

export const SlideTransition: React.FC<SlideTransitionProps> = ({
  children,
  direction = 'up',
  distance = 50,
  delayFrames = 0,
  springConfig = { damping: 14, stiffness: 90 },
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: springConfig,
  });

  let translateX = 0;
  let translateY = 0;

  if (direction === 'up') translateY = (1 - progress) * distance;
  if (direction === 'down') translateY = (1 - progress) * -distance;
  if (direction === 'left') translateX = (1 - progress) * distance;
  if (direction === 'right') translateX = (1 - progress) * -distance;

  return (
    <div
      style={{
        transform: `translate(${translateX}px, ${translateY}px)`,
        opacity: progress,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const SlideIn = SlideTransition;
