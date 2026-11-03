import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface CurvedArrowCalloutProps {
  label?: string;
  direction?: 'down-left' | 'down-right' | 'up-right' | 'up-left';
  color?: string;
  triggerFrame?: number;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}

export const CurvedArrowCallout: React.FC<CurvedArrowCalloutProps> = ({
  label = '',
  direction = 'down-right',
  color = '#EF4444',
  triggerFrame = 0,
  width = 200,
  height = 150,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relFrame = Math.max(0, frame - triggerFrame);

  const drawProgress = interpolate(relFrame, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const headSpring = spring({
    frame: Math.max(0, relFrame - 8),
    fps,
    config: { damping: 12, stiffness: 180 },
  });

  const labelSpring = spring({
    frame: Math.max(0, relFrame - 4),
    fps,
    config: { damping: 14, stiffness: 150 },
  });

  let pathD = 'M 20 20 C 120 20, 150 70, 160 120';
  let headX = 160;
  let headY = 120;
  let headRotation = 75;

  if (direction === 'down-left') {
    pathD = 'M 180 20 C 80 20, 50 70, 40 120';
    headX = 40;
    headY = 120;
    headRotation = 105;
  }

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
      {label && (
        <div
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: 18,
            fontWeight: 900,
            color: '#FFFFFF',
            background: color,
            padding: '6px 16px',
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

      <svg
        width={width}
        height={height}
        viewBox="0 0 200 150"
        style={{ overflow: 'visible' }}
      >
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray="220"
          strokeDashoffset={220 * (1 - drawProgress)}
          style={{
            filter: `drop-shadow(0 4px 12px ${color}99)`,
          }}
        />

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

