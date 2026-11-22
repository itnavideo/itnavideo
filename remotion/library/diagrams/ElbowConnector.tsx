import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface ElbowConnectorProps {
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
  cornerRadius?: number;
  midRatio?: number; // 0 to 1 where the bend occurs
  orientation?: 'horizontal-first' | 'vertical-first';
  strokeWidth?: number;
  strokeColor?: string;
  showArrow?: boolean;
  label?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * ElbowConnector — Right-angle orthogonal Manhattan routing connector.
 * Essential for electronic, cloud infrastructure, and enterprise system diagrams.
 * Features rounded bend radii, customizable split points, and directional indicators.
 */
export function ElbowConnector({
  startX = 40,
  startY = 40,
  endX = 360,
  endY = 160,
  cornerRadius = 10,
  midRatio = 0.5,
  orientation = 'horizontal-first',
  strokeWidth = 2.5,
  strokeColor = '#10b981',
  showArrow = true,
  label = 'RPC Request',
  delay = 0,
  width = 400,
  height = 200,
}: ElbowConnectorProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const drawSpr = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  const progress = interpolate(drawSpr, [0, 1], [0, 1]);

  let pathD = '';
  if (orientation === 'horizontal-first') {
    const midX = startX + (endX - startX) * midRatio;
    pathD = `M ${startX} ${startY} L ${midX} ${startY} L ${midX} ${endY} L ${endX} ${endY}`;
  } else {
    const midY = startY + (endY - startY) * midRatio;
    pathD = `M ${startX} ${startY} L ${startX} ${midY} L ${endX} ${midY} L ${endX} ${endY}`;
  }

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
        <path
          d={pathD}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeDasharray="600"
          strokeDashoffset={interpolate(progress, [0, 1], [600, 0])}
        />

        {/* Start Anchor */}
        <circle cx={startX} cy={startY} r={4} fill={strokeColor} />

        {/* End Arrow */}
        {showArrow && progress > 0.9 && (
          <polygon
            points={`${endX},${endY} ${endX - 8},${endY - 5} ${endX - 8},${endY + 5}`}
            fill={strokeColor}
          />
        )}
      </svg>

      {/* Label Badge */}
      {label && progress > 0.5 && (
        <div
          style={{
            position: 'absolute',
            left: (startX + endX) * 0.5,
            top: (startY + endY) * 0.5,
            transform: 'translate(-50%, -50%)',
            background: '#18181b',
            border: `1px solid ${strokeColor}44`,
            padding: '2px 8px',
            borderRadius: 6,
            fontSize: 10,
            fontWeight: 700,
            color: '#ffffff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.6)',
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
}
