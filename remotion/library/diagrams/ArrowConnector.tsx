import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface ArrowConnectorProps {
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
  strokeWidth?: number;
  strokeColor?: string;
  arrowSize?: number;
  label?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * ArrowConnector — Directional vector arrow connector with dynamic draw-in animation and high-impact arrowhead.
 */
export function ArrowConnector({
  startX = 40,
  startY = 50,
  endX = 360,
  endY = 50,
  strokeWidth = 3,
  strokeColor = '#f59e0b',
  arrowSize = 10,
  label = 'Flow Path',
  delay = 0,
  width = 400,
  height = 100,
}: ArrowConnectorProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const drawSpr = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  const progress = interpolate(drawSpr, [0, 1], [0, 1]);
  const curX2 = startX + (endX - startX) * progress;
  const curY2 = startY + (endY - startY) * progress;

  const angle = Math.atan2(endY - startY, endX - startX);

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
        <line
          x1={startX}
          y1={startY}
          x2={curX2}
          y2={curY2}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Start Anchor Ring */}
        <circle cx={startX} cy={startY} r={5} fill="#09090b" stroke={strokeColor} strokeWidth={2} />

        {/* Target Arrowhead */}
        {progress > 0.9 && (
          <polygon
            points={`
              ${endX},${endY} 
              ${endX - arrowSize * Math.cos(angle - Math.PI / 6)},${endY - arrowSize * Math.sin(angle - Math.PI / 6)} 
              ${endX - arrowSize * Math.cos(angle + Math.PI / 6)},${endY - arrowSize * Math.sin(angle + Math.PI / 6)}
            `}
            fill={strokeColor}
          />
        )}
      </svg>

      {/* Label Badge */}
      {label && progress > 0.5 && (
        <div
          style={{
            position: 'absolute',
            left: (startX + endX) / 2,
            top: (startY + endY) / 2 - 18,
            transform: 'translate(-50%, -50%)',
            background: '#18181b',
            border: `1px solid ${strokeColor}44`,
            padding: '2px 8px',
            borderRadius: 6,
            fontSize: 10,
            fontWeight: 700,
            color: '#ffffff',
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
}
