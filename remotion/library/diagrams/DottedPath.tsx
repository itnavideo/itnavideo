import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface DottedPathProps {
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
  dotSpacing?: number;
  dotRadius?: number;
  strokeColor?: string;
  label?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * DottedPath — Fine-pitch beaded dot transmission line with sequential illuminating beads.
 */
export function DottedPath({
  startX = 40,
  startY = 50,
  endX = 360,
  endY = 50,
  dotSpacing = 16,
  dotRadius = 2.5,
  strokeColor = '#e11d48',
  label = 'Telemetry Channel',
  delay = 0,
  width = 400,
  height = 100,
}: DottedPathProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const intro = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  const totalDist = Math.hypot(endX - startX, endY - startY);
  const dotCount = Math.floor(totalDist / dotSpacing);

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
        {[...Array(dotCount + 1)].map((_, i) => {
          const ratio = i / dotCount;
          const cx = startX + (endX - startX) * ratio;
          const cy = startY + (endY - startY) * ratio;

          // Sequential wave phase
          const wavePhase = Math.sin(t * 0.15 - i * 0.4);
          const opacity = 0.3 + 0.7 * Math.max(0, wavePhase);

          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={dotRadius}
              fill={strokeColor}
              opacity={opacity}
            />
          );
        })}
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
