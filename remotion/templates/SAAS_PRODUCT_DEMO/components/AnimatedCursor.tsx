import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface AnimatedCursorProps {
  x: number;
  y: number;
  isClicking?: boolean;
  clickFrame?: number;
}

export const AnimatedCursor: React.FC<AnimatedCursorProps> = ({
  x,
  y,
  isClicking = false,
  clickFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const clickElapsed = Math.max(0, frame - clickFrame);
  const clickSpring = spring({
    frame: clickElapsed,
    fps,
    config: { damping: 14, stiffness: 180 },
  });

  const rippleScale = interpolate(clickElapsed, [0, 16], [0.6, 2.2], {
    extrapolateRight: 'clamp',
  });
  const rippleOpacity = interpolate(clickElapsed, [0, 16], [0.8, 0], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-2px, -2px) scale(${isClicking ? 0.9 : 1})`,
        pointerEvents: 'none',
        zIndex: 100,
        transition: 'transform 0.1s ease-out',
      }}
    >
      {/* Click Ripple Effect */}
      {isClicking && clickElapsed < 18 && (
        <div
          style={{
            position: 'absolute',
            left: -16,
            top: -16,
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: '3px solid #FF5722',
            backgroundColor: 'rgba(255, 87, 34, 0.25)',
            transform: `scale(${rippleScale})`,
            opacity: rippleOpacity,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Modern High-End Cursor SVG */}
      <svg
        width="28"
        height="32"
        viewBox="0 0 28 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.45))',
        }}
      >
        <path
          d="M 2 2 L 11 28 L 16 18 L 26 14 Z"
          fill="#0F172A"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <circle cx="15" cy="17" r="2.5" fill="#FF5722" />
      </svg>
    </div>
  );
};
