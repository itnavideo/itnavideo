import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface CrossConnectorProps {
  horizontalY?: number;
  verticalX?: number;
  hopRadius?: number;
  strokeWidth?: number;
  horizontalColor?: string;
  verticalColor?: string;
  label?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * CrossConnector — Non-intersecting wire bridge hop.
 * Classical engineering schematic symbol where one wire jumps over another via a semi-circular arc bridge.
 */
export function CrossConnector({
  horizontalY = 60,
  verticalX = 150,
  hopRadius = 12,
  strokeWidth = 2.5,
  horizontalColor = '#38bdf8',
  verticalColor = '#94a3b8',
  label = 'Isolated Crossing (No Contact)',
  delay = 0,
  width = 300,
  height = 120,
}: CrossConnectorProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const intro = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  // Horizontal line with arc hop over vertical line
  const leftX = verticalX - hopRadius;
  const rightX = verticalX + hopRadius;
  const hopPath = `M 20 ${horizontalY} L ${leftX} ${horizontalY} A ${hopRadius} ${hopRadius} 0 0 1 ${rightX} ${horizontalY} L 280 ${horizontalY}`;

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
        {/* Straight Vertical Background Wire */}
        <line
          x1={verticalX}
          y1={10}
          x2={verticalX}
          y2={110}
          stroke={verticalColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Foreground Horizontal Wire with Arc Hop */}
        <path
          d={hopPath}
          fill="none"
          stroke={horizontalColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      </svg>

      {/* Label Badge */}
      <div
        style={{
          position: 'absolute',
          bottom: 6,
          background: '#18181b',
          border: '1px solid rgba(255,255,255,0.1)',
          padding: '2px 8px',
          borderRadius: 4,
          fontSize: 9,
          fontWeight: 700,
          color: '#cbd5e1',
        }}
      >
        {label}
      </div>
    </div>
  );
}
