import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export interface FadeTransitionProps {
  children: React.ReactNode;
  type?: 'in' | 'out' | 'in-out';
  durationFrames?: number;
  delayFrames?: number;
  exitDurationFrames?: number;
  exitStartFrame?: number;
  style?: React.CSSProperties;
}

export const FadeTransition: React.FC<FadeTransitionProps> = ({
  children,
  type = 'in',
  durationFrames = 15,
  delayFrames = 0,
  exitDurationFrames = 15,
  exitStartFrame,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  let opacity = 1;

  if (type === 'in' || type === 'in-out') {
    opacity = interpolate(frame, [delayFrames, delayFrames + durationFrames], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  }

  if (type === 'out' || type === 'in-out') {
    const outStart = exitStartFrame ?? durationInFrames - exitDurationFrames;
    const outOpacity = interpolate(frame, [outStart, outStart + exitDurationFrames], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    opacity = Math.min(opacity, outOpacity);
  }

  return (
    <div style={{ opacity, ...style }}>
      {children}
    </div>
  );
};

export const FadeIn: React.FC<Omit<FadeTransitionProps, 'type'>> = (props) => (
  <FadeTransition {...props} type="in" />
);

export const FadeOut: React.FC<Omit<FadeTransitionProps, 'type'>> = (props) => (
  <FadeTransition {...props} type="out" />
);
