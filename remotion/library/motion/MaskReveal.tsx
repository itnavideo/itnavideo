import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface MaskRevealProps {
  children: React.ReactNode;
  shape?: 'circle' | 'polygon';
  delayFrames?: number;
  style?: React.CSSProperties;
}

export const MaskReveal: React.FC<MaskRevealProps> = ({
  children,
  shape = 'circle',
  delayFrames = 0,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping: 16, stiffness: 80 },
  });

  const maskStyle: React.CSSProperties =
    shape === 'circle'
      ? { clipPath: `circle(${progress * 75}% at 50% 50%)` }
      : { clipPath: `polygon(0 0, ${progress * 100}% 0, ${progress * 100}% 100%, 0 100%)` };

  return (
    <div style={{ ...maskStyle, ...style }}>
      {children}
    </div>
  );
};
