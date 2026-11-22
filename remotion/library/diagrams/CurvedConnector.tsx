import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface CurvedConnectorProps {
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
  curvature?: number; // Y or X offset for control points
  strokeWidth?: number;
  strokeColor?: string;
  showArrow?: boolean;
  showEnergyPulse?: boolean;
  label?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * CurvedConnector — Smooth Bézier curve routing between diagram nodes.
 * Elegant S-curve or arc flow with traveling energy packet particle and animated path dash.
 */
export function CurvedConnector({
  startX = 40,
  startY = 40,
  endX = 360,
  endY = 160,
  curvature = 60,
  strokeWidth = 2.5,
  strokeColor = '#06b6d4',
  showArrow = true,
  showEnergyPulse = true,
  label = 'Async Dispatch',
  delay = 0,
  width = 400,
  height = 200,
}: CurvedConnectorProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const drawSpr = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 80 },
  });

  const progress = interpolate(drawSpr, [0, 1], [0, 1]);

  // Cubic Bézier control points
  const cp1X = startX + (endX - startX) * 0.5;
  const cp1Y = startY;
  const cp2X = startX + (endX - startX) * 0.5;
  const cp2Y = endY;

  const pathD = `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;

  // Approximate parametric point along curve for energy particle (t from 0 to 1)
  const pulseT = ((t * 0.04) % 1);
  const u = 1 - pulseT;
  const particleX = Math.pow(u, 3) * startX + 3 * Math.pow(u, 2) * pulseT * cp1X + 3 * u * Math.pow(pulseT, 2) * cp2X + Math.pow(pulseT, 3) * endX;
  const particleY = Math.pow(u, 3) * startY + 3 * Math.pow(u, 2) * pulseT * cp1Y + 3 * u * Math.pow(pulseT, 2) * cp2Y + Math.pow(pulseT, 3) * endY;

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
        {/* Glow backdrop path */}
        <path
          d={pathD}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth * 2.5}
          strokeOpacity={0.15}
          strokeLinecap="round"
        />

        {/* Main Animated Path */}
        <path
          d={pathD}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray="600"
          strokeDashoffset={interpolate(progress, [0, 1], [600, 0])}
        />

        {/* Start and End Anchor Dots */}
        <circle cx={startX} cy={startY} r={4} fill={strokeColor} />
        <circle cx={endX} cy={endY} r={4} fill={strokeColor} />

        {/* Traveling Energy Pulse Packet */}
        {showEnergyPulse && progress > 0.8 && (
          <circle
            cx={particleX}
            cy={particleY}
            r={5}
            fill="#ffffff"
            filter="drop-shadow(0 0 6px #ffffff)"
          />
        )}
      </svg>

      {/* Label Badge */}
      {label && progress > 0.6 && (
        <div
          style={{
            position: 'absolute',
            left: (startX + endX) / 2,
            top: (startY + endY) / 2,
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
