import React, { useMemo, useState, useEffect } from 'react';
import { interpolate, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { AnimatedSvgProps } from './SvgAnimatedArrow';

export interface AnimatedSvgPathProps extends AnimatedSvgProps {
  viewBox?: string;
  paths: {
    d: string;
    length?: number; // Pre-calculated length is better, fallback to estimating or 1000
    colorKey?: 'primary' | 'accent' | 'highlight' | 'white';
    strokeWidth?: number;
  }[];
  primaryColor?: string;
  accentColor?: string;
  highlightColor?: string;
}

export const AnimatedSvgPath: React.FC<AnimatedSvgPathProps> = ({
  paths,
  viewBox = "0 0 100 100",
  primaryColor = '#ffffff',
  accentColor = '#ff4d4d',
  highlightColor = '#ffeb3b',
  size = 100,
  delay = 0,
  durationInFrames = 30,
  className = '',
  isThumbnail = false,
}) => {
  let frame = 100;
  let fps = 30;

  try {
    frame = useCurrentFrame();
    fps = useVideoConfig().fps;
  } catch (e) {
    // Outside Remotion context
  }

  const progress = isThumbnail ? 1 : interpolate(
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

  const getColor = (key?: string) => {
    switch (key) {
      case 'accent': return accentColor;
      case 'highlight': return highlightColor;
      case 'white': return '#ffffff';
      default: return primaryColor;
    }
  };

  return (
    <div style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }} className={className}>
      <svg
        viewBox={viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: '100%',
          height: '100%',
          transform: `scale(${scale})`,
          opacity: scale > 0.05 ? 1 : 0
        }}
      >
        {(paths || []).filter(Boolean).map((p, i) => {
          // Fallback dash length approximation if not provided
          const pLength = p.length || 1000;
          const offset = interpolate(progress, [0, 1], [pLength, 0]);
          return (
            <path
              key={i}
              d={p.d}
              stroke={getColor(p.colorKey)}
              strokeWidth={p.strokeWidth || 4}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={pLength}
              strokeDashoffset={offset}
            />
          );
        })}
      </svg>
    </div>
  );
};
