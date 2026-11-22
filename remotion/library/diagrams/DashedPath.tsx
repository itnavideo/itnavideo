import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface DashedPathProps {
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
  dashLength?: number;
  dashGap?: number;
  strokeWidth?: number;
  strokeColor?: string;
  animateFlow?: boolean;
  label?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * DashedPath — Marching-ants dashed transmission wire.
 * Standard visual representation for asynchronous queues, loose coupling, and optional conditions.
 */
export function DashedPath({
  startX = 40,
  startY = 50,
  endX = 360,
  endY = 50,
  dashLength = 8,
  dashGap = 6,
  strokeWidth = 2,
  strokeColor = '#f59e0b',
  animateFlow = true,
  label = 'Async Queue',
  delay = 0,
  width = 400,
  height = 100,
}: DashedPathProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const intro = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  const dashOffset = animateFlow ? (t * 1.5) % (dashLength + dashGap) : 0;

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
        <line
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={`${dashLength} ${dashGap}`}
          strokeDashoffset={-dashOffset}
          strokeLinecap="round"
        />

        <circle cx={startX} cy={startY} r={4} fill={strokeColor} />
        <circle cx={endX} cy={endY} r={4} fill={strokeColor} />
      </svg>

      {label && (
        <div
          style={{
            position: 'absolute',
            left: (startX + endX) / 2,
            top: (startY + endY) / 2 - 16,
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
