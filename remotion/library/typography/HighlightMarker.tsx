import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface HighlightMarkerProps {
  prefix?: string;
  highlightedText?: string;
  suffix?: string;
  markerColor?: string;
  fontSize?: number;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * HighlightMarker — Felt-tip neon highlighter pen sweep animation.
 * Sweeps an organic highlighter background stroke under key emphasis words.
 */
export function HighlightMarker({
  prefix = 'The secret to viral retention is',
  highlightedText = 'VISUAL DENSITY',
  suffix = 'every 3 seconds.',
  markerColor = '#facc15', // Vibrant highlighter yellow
  fontSize = 32,
  delay = 0,
  width = '100%',
  height = 140,
}: HighlightMarkerProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const intro = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  const markerSpr = spring({
    frame: Math.max(0, t - 10),
    fps,
    config: { damping: 14, stiffness: 75 },
  });

  const markerWidth = interpolate(markerSpr, [0, 1], [0, 100]);

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 8,
        padding: 20,
        boxSizing: 'border-box',
        opacity: intro,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <span style={{ fontSize, fontWeight: 700, color: '#ffffff' }}>
        {prefix}
      </span>

      {/* Highlighted Word Container with Expanding Pen Mark */}
      <span
        style={{
          position: 'relative',
          display: 'inline-block',
          fontSize,
          fontWeight: 900,
          color: '#000000',
          padding: '2px 8px',
          zIndex: 1,
        }}
      >
        {/* Animated Highlighter Fill Box */}
        <span
          style={{
            position: 'absolute',
            left: 0,
            top: 2,
            bottom: 2,
            width: `${markerWidth}%`,
            backgroundColor: markerColor,
            borderRadius: 4,
            transform: 'skewX(-4deg)',
            zIndex: -1,
            boxShadow: `0 0 16px ${markerColor}66`,
          }}
        />
        {highlightedText}
      </span>

      <span style={{ fontSize, fontWeight: 700, color: '#ffffff' }}>
        {suffix}
      </span>
    </div>
  );
}
