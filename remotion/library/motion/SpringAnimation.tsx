import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface SpringAnimationProps {
  children: React.ReactNode;
  damping?: number;
  stiffness?: number;
  mass?: number;
  delayFrames?: number;
  style?: React.CSSProperties;
}

export const SpringAnimation: React.FC<SpringAnimationProps> = ({
  children,
  damping = 12,
  stiffness = 100,
  mass = 0.8,
  delayFrames = 0,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping, stiffness, mass },
  });

  return (
    <div
      style={{
        transform: `scale(${progress}) translateY(${(1 - progress) * 20}px)`,
        opacity: progress,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
