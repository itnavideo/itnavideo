import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface RevealAnimationProps {
  children: React.ReactNode;
  direction?: 'left-to-right' | 'top-to-bottom';
  curtainColor?: string;
  delayFrames?: number;
  style?: React.CSSProperties;
}

export const RevealAnimation: React.FC<RevealAnimationProps> = ({
  children,
  direction = 'left-to-right',
  curtainColor = '#0066FF',
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

  const clipPath =
    direction === 'left-to-right'
      ? `inset(0 ${(1 - progress) * 100}% 0 0)`
      : `inset(0 0 ${(1 - progress) * 100}% 0)`;

  return (
    <div
      style={{
        clipPath,
        position: 'relative',
        ...style,
      }}
    >
      {children}
    </div>
  );
};
