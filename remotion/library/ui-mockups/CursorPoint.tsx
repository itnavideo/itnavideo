import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface CursorPointProps {
  x?: number;
  y?: number;
  isClicking?: boolean;
  color?: string;
  label?: string;
  delayFrames?: number;
  style?: React.CSSProperties;
}

export const CursorPoint: React.FC<CursorPointProps> = ({
  x = 180,
  y = 120,
  isClicking = true,
  color = '#0066FF',
  label = 'Click to Render',
  delayFrames = 5,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cursorSpring = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping: 14, stiffness: 95 },
  });

  const clickSpring = spring({
    frame: Math.max(0, frame - delayFrames - 12),
    fps,
    config: { damping: 12, stiffness: 140 },
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        transform: `translate(${(1 - cursorSpring) * 60}px, ${(1 - cursorSpring) * 60}px)`,
        opacity: cursorSpring,
        pointerEvents: 'none',
        zIndex: 100,
        ...style,
      }}
    >
      {/* Click Ripple Wave */}
      {isClicking && clickSpring > 0 && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: `${color}33`,
            border: `2px solid ${color}`,
            transform: `translate(-50%, -50%) scale(${interpolate(clickSpring, [0, 1], [0.4, 1.8])})`,
            opacity: interpolate(clickSpring, [0, 0.6, 1], [1, 0.7, 0]),
          }}
        />
      )}

      {/* macOS SVG Arrow Pointer */}
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.5))' }}>
        <path
          d="M3 3l7 18 3-7 7-3L3 3z"
          fill="#FFFFFF"
          stroke="#000000"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>

      {/* Action Tooltip Pill */}
      {label && (
        <div
          style={{
            position: 'absolute',
            left: '26px',
            top: '20px',
            padding: '3px 10px',
            borderRadius: '6px',
            backgroundColor: color,
            color: '#FFFFFF',
            fontSize: '11px',
            fontWeight: 800,
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};
