import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface StraightConnectorProps {
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  strokeWidth?: number;
  strokeColor?: string;
  showEndpoints?: boolean;
  endpointRadius?: number;
  showArrow?: boolean;
  label?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * StraightConnector — Direct line connector between two diagram coordinates.
 * Supports animated draw-in stroke progression, endpoint docking dots, terminal arrowheads, and center label badges.
 */
export function StraightConnector({
  x1 = 40,
  y1 = 60,
  x2 = 360,
  y2 = 60,
  strokeWidth = 2.5,
  strokeColor = '#3b82f6',
  showEndpoints = true,
  endpointRadius = 4,
  showArrow = true,
  label = 'Data Stream',
  delay = 0,
  width = 400,
  height = 120,
}: StraightConnectorProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const drawSpr = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  const progress = interpolate(drawSpr, [0, 1], [0, 1]);
  const currentX2 = x1 + (x2 - x1) * progress;
  const currentY2 = y1 + (y2 - y1) * progress;

  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  // Arrowhead angle
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const arrowSize = 8;

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
        {/* Connection Line */}
        <line
          x1={x1}
          y1={y1}
          x2={currentX2}
          y2={currentY2}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Start Endpoint Node */}
        {showEndpoints && (
          <circle
            cx={x1}
            cy={y1}
            r={endpointRadius}
            fill={strokeColor}
            opacity={progress > 0.05 ? 1 : 0}
          />
        )}

        {/* Arrowhead at Target */}
        {showArrow && progress >= 0.95 && (
          <polygon
            points={`
              ${x2},${y2} 
              ${x2 - arrowSize * Math.cos(angle - Math.PI / 6)},${y2 - arrowSize * Math.sin(angle - Math.PI / 6)} 
              ${x2 - arrowSize * Math.cos(angle + Math.PI / 6)},${y2 - arrowSize * Math.sin(angle + Math.PI / 6)}
            `}
            fill={strokeColor}
          />
        )}

        {/* End Node Dot (if not arrow) */}
        {showEndpoints && !showArrow && (
          <circle
            cx={currentX2}
            cy={currentY2}
            r={endpointRadius}
            fill={strokeColor}
          />
        )}
      </svg>

      {/* Middle Label Badge */}
      {label && progress > 0.5 && (
        <div
          style={{
            position: 'absolute',
            left: midX,
            top: midY - 18,
            transform: 'translate(-50%, -50%)',
            background: '#18181b',
            border: `1px solid ${strokeColor}44`,
            padding: '2px 8px',
            borderRadius: 6,
            fontSize: 10,
            fontWeight: 700,
            color: '#ffffff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.6)',
            opacity: interpolate(drawSpr, [0.5, 1], [0, 1]),
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
}
