import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface HandwritingAnimationProps {
  svgPath?: string;
  authorSignature?: string;
  strokeColor?: string;
  strokeWidth?: number;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * HandwritingAnimation — Cursive script calligraphy & signature drawing animation.
 * Progressively reveals handwritten script paths with authentic fountain-pen stroke dynamics.
 */
export function HandwritingAnimation({
  svgPath = 'M 20 80 Q 60 20, 100 80 T 180 80 T 260 80 Q 320 20, 360 90',
  authorSignature = 'David Vance, Founder',
  strokeColor = '#38bdf8',
  strokeWidth = 3,
  delay = 0,
  width = 400,
  height = 160,
}: HandwritingAnimationProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const intro = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 80 },
  });

  const drawProgress = interpolate(
    spring({
      frame: Math.max(0, t - 6),
      fps,
      config: { damping: 18, stiffness: 50 },
    }),
    [0, 1],
    [0, 1]
  );

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
        fontFamily: 'Caveat, "Dancing Script", cursive, sans-serif',
      }}
    >
      {/* Handwriting SVG Calligraphy Stroke */}
      <svg width="100%" height="90" viewBox="0 0 400 100" style={{ overflow: 'visible' }}>
        <path
          d={svgPath}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="600"
          strokeDashoffset={interpolate(drawProgress, [0, 1], [600, 0])}
          filter={`drop-shadow(0 0 6px ${strokeColor}66)`}
        />
      </svg>

      {/* Typed Subtitle Signature */}
      <div
        style={{
          fontSize: 12,
          fontFamily: 'Inter, system-ui, sans-serif',
          fontWeight: 700,
          color: '#94a3b8',
          letterSpacing: '0.1em',
          marginTop: 6,
          opacity: drawProgress > 0.8 ? 1 : 0,
        }}
      >
        {authorSignature}
      </div>
    </div>
  );
}
