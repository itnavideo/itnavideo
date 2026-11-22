import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface MorphAnimationProps {
  childrenA: React.ReactNode;
  childrenB: React.ReactNode;
  morphStartFrame?: number;
  durationFrames?: number;
  style?: React.CSSProperties;
}

export const MorphAnimation: React.FC<MorphAnimationProps> = ({
  childrenA,
  childrenB,
  morphStartFrame = 30,
  durationFrames = 20,
  style = {},
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame, [morphStartFrame, morphStartFrame + durationFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{ position: 'relative', display: 'inline-block', ...style }}>
      {/* State A fading/scaling out */}
      <div
        style={{
          opacity: 1 - progress,
          transform: `scale(${1 - progress * 0.1})`,
          position: progress > 0.99 ? 'absolute' : 'relative',
          pointerEvents: progress > 0.5 ? 'none' : 'auto',
        }}
      >
        {childrenA}
      </div>

      {/* State B fading/scaling in */}
      <div
        style={{
          opacity: progress,
          transform: `scale(${0.9 + progress * 0.1})`,
          position: progress < 0.01 ? 'absolute' : 'relative',
          top: 0,
          left: 0,
          pointerEvents: progress < 0.5 ? 'none' : 'auto',
        }}
      >
        {childrenB}
      </div>
    </div>
  );
};
