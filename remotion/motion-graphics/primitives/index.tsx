import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export const AnimatedLine: React.FC<{
  width: number;
  height?: number;
  color?: string;
  delay?: number;
  duration?: number;
}> = ({ width, height = 4, color = '#ffffff', delay = 0, duration = 30 }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame - delay, [0, duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{ width, height, overflow: 'hidden' }}>
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: color,
          transform: `scaleX(${progress})`,
          transformOrigin: 'left',
        }}
      />
    </div>
  );
};

export const AnimatedText: React.FC<{
  text: string;
  delay?: number;
  duration?: number;
  style?: React.CSSProperties;
}> = ({ text, delay = 0, duration = 20, style }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame - delay, [0, duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const translateY = interpolate(frame - delay, [0, duration], [20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{ ...style, opacity, transform: `translateY(${translateY}px)` }}>
      {text}
    </div>
  );
};
