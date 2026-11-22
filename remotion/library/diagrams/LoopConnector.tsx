import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface LoopConnectorProps {
  startX?: number;
  startY?: number;
  returnX?: number;
  returnY?: number;
  loopHeight?: number;
  strokeWidth?: number;
  strokeColor?: string;
  label?: string;
  iterationCount?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * LoopConnector — Re-entrant feedback loop routing connector.
 * Routes backwards from a downstream node to an upstream stage with curved arches and iteration badges.
 */
export function LoopConnector({
  startX = 320,
  startY = 80,
  returnX = 80,
  returnY = 80,
  loopHeight = 60,
  strokeWidth = 2.5,
  strokeColor = '#ec4899',
  label = 'Feedback Loop',
  iterationCount = 'Max 3 Retries',
  delay = 0,
  width = 400,
  height = 160,
}: LoopConnectorProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const intro = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  const progress = interpolate(intro, [0, 1], [0, 1]);

  // Overhead arched loop path
  const archY = startY - loopHeight;
  const pathD = `M ${startX} ${startY} C ${startX} ${archY}, ${returnX} ${archY}, ${returnX} ${returnY}`;

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: intro,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
        <path
          d={pathD}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray="500"
          strokeDashoffset={interpolate(progress, [0, 1], [500, 0])}
        />

        {/* Start Anchor */}
        <circle cx={startX} cy={startY} r={4} fill={strokeColor} />

        {/* Return Arrowhead pointing downward into upstream node */}
        {progress > 0.9 && (
          <polygon
            points={`${returnX},${returnY} ${returnX - 5},${returnY - 8} ${returnX + 5},${returnY - 8}`}
            fill={strokeColor}
          />
        )}
      </svg>

      {/* Loop Apex Label Badge */}
      <div
        style={{
          position: 'absolute',
          left: (startX + returnX) / 2,
          top: archY - 10,
          transform: 'translate(-50%, -50%)',
          background: '#18181b',
          border: `1px solid ${strokeColor}55`,
          padding: '3px 10px',
          borderRadius: 6,
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.7)',
        }}
      >
        <div style={{ fontSize: 9, fontWeight: 800, color: strokeColor }}>
          {label}
        </div>
        <div style={{ fontSize: 8, color: '#94a3b8' }}>
          {iterationCount}
        </div>
      </div>
    </div>
  );
}
