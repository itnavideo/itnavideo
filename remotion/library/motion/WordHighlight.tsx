import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface WordHighlightProps {
  children: React.ReactNode;
  highlightColor?: string;
  textColor?: string;
  type?: 'marker' | 'badge' | 'box';
  delayFrames?: number;
  style?: React.CSSProperties;
}

export const WordHighlight: React.FC<WordHighlightProps> = ({
  children,
  highlightColor = '#F59E0B',
  textColor = '#000000',
  type = 'marker',
  delayFrames = 5,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping: 14, stiffness: 95 },
  });

  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-block',
        padding: type === 'badge' ? '2px 8px' : '0 4px',
        color: textColor,
        fontWeight: 800,
        zIndex: 1,
        ...style,
      }}
    >
      {/* Background Marker Reveal */}
      <span
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: highlightColor,
          borderRadius: type === 'badge' ? '6px' : '3px',
          transformOrigin: 'left center',
          transform: `scaleX(${progress})`,
          zIndex: -1,
          boxShadow: `0 2px 10px ${highlightColor}66`,
        }}
      />
      {children}
    </span>
  );
};
