import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface AnimatedBookIllustrationProps {
  src: string;
  strokeColor?: string;
  durationInFrames?: number;
}

export const AnimatedBookIllustration: React.FC<AnimatedBookIllustrationProps> = ({
  src,
  strokeColor = '#333333',
  durationInFrames = 60,
}) => {
  const frame = useCurrentFrame();

  // Custom drawing and reveal effects for Book Summary SVGs
  const drawProgress = interpolate(frame, [0, durationInFrames * 0.7], [0, 1], { extrapolateRight: 'clamp' });
  const fadeProgress = interpolate(frame, [durationInFrames * 0.5, durationInFrames], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const scale = interpolate(frame, [0, durationInFrames], [0.85, 1], { extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: fadeProgress,
        transform: `scale(${scale})`,
      }}
    >
      <img
        src={src}
        alt="Book Illustration"
        style={{
          maxWidth: '80%',
          maxHeight: '80%',
          objectFit: 'contain',
        }}
      />
    </div>
  );
};
