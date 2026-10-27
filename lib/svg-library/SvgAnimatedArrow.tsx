import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface AnimatedSvgProps {
  color?: string;
  strokeWidth?: number;
  size?: number;
  delay?: number;
  durationInFrames?: number;
  className?: string;
  isThumbnail?: boolean;
}

export const AnimatedArrow: React.FC<AnimatedSvgProps> = ({
  color = '#ff4d4d',
  strokeWidth = 6,
  size = 100,
  delay = 0,
  durationInFrames = 30,
  className = '',
  isThumbnail = false,
}) => {
  let frame = 30;
  let fps = 30;

  try {
    frame = useCurrentFrame();
    fps = useVideoConfig().fps;
  } catch (e) {
    // Fallback for rendering outside Remotion Player
    frame = 100;
  }

  const rawProgress = isThumbnail ? 1 : interpolate(
    frame - delay,
    [0, durationInFrames],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const scale = isThumbnail ? 1 : spring({
    fps,
    frame: frame - delay,
    config: { damping: 12 },
    durationInFrames: 20
  });

  const pathLength = 100;
  const strokeDashoffset = interpolate(rawProgress, [0, 1], [pathLength, 0]);

  return (
    <div style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }} className={className}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: '100%',
          height: '100%',
          transform: `scale(${scale})`,
          opacity: scale > 0.05 ? 1 : 0
        }}
      >
        <path
          d="M10,50 L80,50"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={pathLength}
          strokeDashoffset={strokeDashoffset}
        />
        <path
          d="M60,30 L85,50 L60,70"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={pathLength}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
    </div>
  );
};
