import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface ScaleTransitionProps {
  children: React.ReactNode;
  fromScale?: number;
  toScale?: number;
  delayFrames?: number;
  springConfig?: { damping?: number; stiffness?: number; mass?: number };
  style?: React.CSSProperties;
}

export const ScaleTransition: React.FC<ScaleTransitionProps> = ({
  children,
  fromScale = 0.5,
  toScale = 1.0,
  delayFrames = 0,
  springConfig = { damping: 13, stiffness: 100 },
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: springConfig,
  });

  const currentScale = interpolate(progress, [0, 1], [fromScale, toScale]);

  return (
    <div
      style={{
        transform: `scale(${currentScale})`,
        opacity: progress,
        transformOrigin: 'center center',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const ScaleIn = ScaleTransition;
