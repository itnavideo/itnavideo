import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { AnimatedSvgProps } from './SvgAnimatedArrow';

export const AnimatedCircle: React.FC<AnimatedSvgProps> = ({
  color = '#4d94ff',
  strokeWidth = 6,
  size = 100,
  delay = 0,
  durationInFrames = 30,
  className = '',
  isThumbnail = false,
}) => {
  let frame = 30;

  try {
    frame = useCurrentFrame();
  } catch (e) {
    frame = 100;
  }

  const progress = isThumbnail ? 1 : interpolate(
    frame - delay,
    [0, durationInFrames],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = interpolate(progress, [0, 1], [circumference, 0]);

  return (
    <div style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }} className={className}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}
      >
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
    </div>
  );
};
