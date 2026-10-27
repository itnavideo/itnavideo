import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { AnimatedSvgProps } from './SvgAnimatedArrow';

export const AnimatedHighlight: React.FC<AnimatedSvgProps & { pathDef?: string, viewBox?: string }> = ({
  color = '#ffeb3b',
  strokeWidth = 15,
  size = 200,
  delay = 0,
  durationInFrames = 20,
  className = '',
  isThumbnail = false,
  pathDef = "M10,50 Q50,40 90,50",
  viewBox = "0 0 100 100"
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

  const pathLength = 150;
  const strokeDashoffset = interpolate(progress, [0, 1], [pathLength, 0]);

  return (
    <div style={{ width: size, height: size/2, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }} className={className}>
      <svg
        viewBox={viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', opacity: 0.7 }}
      >
        <path
          d={pathDef}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={pathLength}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
    </div>
  );
};
