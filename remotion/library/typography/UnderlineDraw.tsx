import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface UnderlineDrawProps {
  headline?: string;
  strokeColor?: string;
  strokeWidth?: number;
  fontSize?: number;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * UnderlineDraw — Animated organic vector brush underline sweep.
 * Draws an energetic curved or jagged underline emphasizing a headline.
 */
export function UnderlineDraw({
  headline = 'ENGINEERED FOR SUPREMACY',
  strokeColor = '#ef4444',
  strokeWidth = 4,
  fontSize = 38,
  delay = 0,
  width = '100%',
  height = 140,
}: UnderlineDrawProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const intro = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  const drawSpr = spring({
    frame: Math.max(0, t - 8),
    fps,
    config: { damping: 14, stiffness: 75 },
  });

  const progress = interpolate(drawSpr, [0, 1], [0, 1]);

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        boxSizing: 'border-box',
        opacity: intro,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <div
        style={{
          position: 'relative',
          display: 'inline-block',
          fontSize,
          fontWeight: 900,
          color: '#ffffff',
          letterSpacing: '-0.02em',
          textAlign: 'center',
        }}
      >
        {headline}

        {/* SVG Underline Path */}
        <svg
          style={{
            position: 'absolute',
            left: 0,
            bottom: -12,
            width: '100%',
            height: 18,
            overflow: 'visible',
          }}
        >
          <path
            d="M 5 10 Q 150 16, 320 8 Q 450 14, 580 9"
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray="600"
            strokeDashoffset={interpolate(progress, [0, 1], [600, 0])}
            filter={`drop-shadow(0 0 8px ${strokeColor})`}
          />
        </svg>
      </div>
    </div>
  );
}
