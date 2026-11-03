import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface CurvedArrowCalloutProps {
  /** Label text placed next to or above the arrow (e.g., "LOOK HERE", "CLICK THROUGH RATE") */
  label?: string;
  /** Start and End coordinates in % or px */
  direction?: 'down-left' | 'down-right' | 'up-right' | 'up-left';
  color?: string;
  triggerFrame?: number;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}

/**
 * Top Creator Animated Curved Arrow with Spring Pop
 * Observed in:
 * - Ali Abdaal / Film Booth ("Thumbnail 81% Better" at 75s)
 * - Vanessa Lau ("$290k Breakdown" at 95s)
 */
export const CurvedArrowCallout: React.FC<CurvedArrowCalloutProps> = ({
  label = '',
  direction = 'down-right',
  color = '#EF4444', // vibrant red / pink
  triggerFrame = 0,
  width = 240,
  height = 180,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relFrame = Math.max(0, frame - triggerFrame);

  // 1. Path Stroke Animation (0 to 1 over 12 frames)
  const drawProgress = interpolate(relFrame, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 2. Arrowhead Spring Pop
  const headSpring = spring({
    frame: Math.max(0, relFrame - 8),
    fps,
    config: { damping: 12, stiffness: 180 },
  });

  // 3. Label Pop
  const labelSpring = spring({
    frame: Math.max(0, relFrame - 4),
    fps,
    config: { damping: 14, stiffness: 150 },
  });

  // Path coordinates based on direction
  let pathD = 'M 20 20 C 140 20, 180 80, 190 140';
  let headX = 190;
  let headY = 140;
  let headRotation = 75;

  if (direction === 'down-left') {
    pathD = 'M 220 20 C 100 20, 60 80, 40 140';
    headX = 40;
    headY = 140;
    headRotation = 105;
  } else if (direction === 'up-right') {
    pathD = 'M 20 160 C 120 160, 160 80, 190 30';
    headX = 190;
    headY = 30;
    headRotation = -60;
  }

  // Float effect after draw
  const floatY = Math.sin(relFrame / 6) * 3;

  return (
    <div
      style={{
        position: 'absolute',
        zIndex: 50,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transform: `translateY(${floatY}px)`,
        ...style,
      }}
    >
      {/* Optional Label Badge */}
      {label && (
        <div
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: 16,
            fontWeight: 900,
            color: '#FFFFFF',
            background: color,
            padding: '5px 14px',
            borderRadius: 9999,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            boxShadow: `0 4px 18px ${color}88`,
            transform: `scale(${labelSpring})`,
            marginBottom: 8,
          }}
        >
          {label}
        </div>
      )}

      {/* SVG Curved Path & Arrow Head */}
      <svg
        width={width}
        height={height}
        viewBox="0 0 240 180"
        style={{ overflow: 'visible' }}
      >
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray="260"
          strokeDashoffset={260 * (1 - drawProgress)}
          style={{
            filter: `drop-shadow(0 4px 12px ${color}99)`,
          }}
        />

        {/* Dynamic Arrowhead */}
        {relFrame >= 7 && (
          <g
            transform={`translate(${headX}, ${headY}) rotate(${headRotation}) scale(${headSpring})`}
          >
            <polygon
              points="0,-12 18,0 0,12"
              fill={color}
              style={{
                filter: `drop-shadow(0 2px 8px ${color}AA)`,
              }}
            />
          </g>
        )}
      </svg>
    </div>
  );
};

