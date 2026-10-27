import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface AnimatedSVGProps {
  src: string;
  strokeColor?: string;
  durationInFrames?: number;
}

export const AnimatedSVG: React.FC<AnimatedSVGProps> = ({
  src,
  strokeColor = '#333333',
  durationInFrames = 60,
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const scale = interpolate(frame, [0, durationInFrames], [0.9, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <img
        src={src}
        alt="Animated SVG"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          opacity: progress,
          transform: `scale(${scale})`,
        }}
      />
    </div>
  );
};
