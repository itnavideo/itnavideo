import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface DoubleArrowProps {
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
  strokeWidth?: number;
  strokeColor?: string;
  label?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * DoubleArrow — Bidirectional reciprocal flow connector with dual arrowheads.
 * Perfect for full-duplex WebSocket channels, two-way database replication, and bidirectional sync.
 */
export function DoubleArrow({
  startX = 40,
  startY = 60,
  endX = 360,
  endY = 60,
  strokeWidth = 2.5,
  strokeColor = '#a855f7',
  label = 'Full-Duplex Sync',
  delay = 0,
  width = 400,
  height = 120,
}: DoubleArrowProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const intro = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  const arrowSize = 8;
  const angle = Math.atan2(endY - startY, endX - startX);

  // Reciprocal ping-pong energy dot
  const pingPong = Math.abs(Math.sin(t * 0.08));
  const dotX = startX + (endX - startX) * pingPong;
  const dotY = startY + (endY - startY) * pingPong;

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
        {/* Main Line */}
        <line
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Start Arrowhead (pointing backwards towards start) */}
        <polygon
          points={`
            ${startX},${startY} 
            ${startX + arrowSize * Math.cos(angle - Math.PI / 6)},${startY + arrowSize * Math.sin(angle - Math.PI / 6)} 
            ${startX + arrowSize * Math.cos(angle + Math.PI / 6)},${startY + arrowSize * Math.sin(angle + Math.PI / 6)}
          `}
          fill={strokeColor}
        />

        {/* End Arrowhead (pointing forward towards end) */}
        <polygon
          points={`
            ${endX},${endY} 
            ${endX - arrowSize * Math.cos(angle - Math.PI / 6)},${endY - arrowSize * Math.sin(angle - Math.PI / 6)} 
            ${endX - arrowSize * Math.cos(angle + Math.PI / 6)},${endY - arrowSize * Math.sin(angle + Math.PI / 6)}
          `}
          fill={strokeColor}
        />

        {/* Bidirectional Pulse Particle */}
        <circle cx={dotX} cy={dotY} r={4.5} fill="#ffffff" filter="drop-shadow(0 0 6px #ffffff)" />
      </svg>

      {/* Center Protocol Label */}
      {label && (
        <div
          style={{
            position: 'absolute',
            left: (startX + endX) / 2,
            top: (startY + endY) / 2 - 18,
            transform: 'translate(-50%, -50%)',
            background: '#18181b',
            border: `1px solid ${strokeColor}55`,
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
