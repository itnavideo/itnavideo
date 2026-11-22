import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface RotateAnimationProps {
  children: React.ReactNode;
  mode?: 'spin' | 'spring-enter';
  fromDegrees?: number;
  toDegrees?: number;
  spinSpeedSeconds?: number;
  delayFrames?: number;
  style?: React.CSSProperties;
}

export const RotateAnimation: React.FC<RotateAnimationProps> = ({
  children,
  mode = 'spring-enter',
  fromDegrees = -180,
  toDegrees = 0,
  spinSpeedSeconds = 4,
  delayFrames = 0,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  let deg = 0;

  if (mode === 'spin') {
    deg = ((frame / fps) / spinSpeedSeconds) * 360;
  } else {
    const rotSpring = spring({
      frame: Math.max(0, frame - delayFrames),
      fps,
      config: { damping: 14, stiffness: 85 },
    });
    deg = interpolate(rotSpring, [0, 1], [fromDegrees, toDegrees]);
  }

  return (
    <div
      style={{
        transform: `rotate(${deg}deg)`,
        transformOrigin: 'center center',
        ...style,
      }}
    >
      {children}
    </div>
  );
};
