import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface DynamicArrowProps {
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
  baseThickness?: number;
  accentColor?: string;
  glowColor?: string;
  label?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * DynamicArrow — Adaptive kinetic vector arrow with flared terminal head and pulsating energy body.
 */
export function DynamicArrow({
  startX = 30,
  startY = 50,
  endX = 370,
  endY = 50,
  baseThickness = 4,
  accentColor = '#6366f1',
  glowColor = '#6366f155',
  label = 'Kinetic Flux Vector',
  delay = 0,
  width = 400,
  height = 100,
}: DynamicArrowProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const intro = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  const pulse = 1 + Math.sin(t * 0.1) * 0.15;
  const currentThickness = baseThickness * pulse;

  const angle = Math.atan2(endY - startY, endX - startX);
  const headLength = 16;

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
        {/* Glow */}
        <line
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          stroke={accentColor}
          strokeWidth={currentThickness * 2}
          strokeOpacity={0.25}
          strokeLinecap="round"
        />

        {/* Dynamic Arrow Shaft */}
        <line
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          stroke={accentColor}
          strokeWidth={currentThickness}
          strokeLinecap="round"
        />

        {/* Dynamic Flared Arrowhead */}
        <polygon
          points={`
            ${endX},${endY}
            ${endX - headLength * Math.cos(angle - Math.PI / 5)},${endY - headLength * Math.sin(angle - Math.PI / 5)}
            ${endX - (headLength * 0.6) * Math.cos(angle)},${endY - (headLength * 0.6) * Math.sin(angle)}
            ${endX - headLength * Math.cos(angle + Math.PI / 5)},${endY - headLength * Math.sin(angle + Math.PI / 5)}
          `}
          fill={accentColor}
        />
      </svg>

      {label && (
        <div
          style={{
            position: 'absolute',
            left: (startX + endX) / 2,
            top: (startY + endY) / 2 - 18,
            transform: 'translate(-50%, -50%)',
            background: '#18181b',
            border: `1px solid ${accentColor}44`,
            padding: '2px 8px',
            borderRadius: 6,
            fontSize: 10,
            fontWeight: 800,
            color: '#ffffff',
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
}
