import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export interface HandwritingHighlightProps {
  /** The word or text to display with handwriting highlight */
  text?: string;
  /** Style variant of the handwriting draw effect */
  variant?: 'underline' | 'circle' | 'marker_box' | 'text_kalam';
  /** Highlighter color (defaults to vibrant flame orange / neon amber) */
  color?: string;
  /** Custom handwriting font family */
  fontFamily?: string;
  /** Delay in frames before the stroke starts drawing */
  delayFrames?: number;
  /** Duration in frames to complete the drawing animation */
  drawDurationFrames?: number;
  /** Custom inline style overrides */
  style?: React.CSSProperties;
  className?: string;
  /** Optional theme override to adjust contrast when color is not explicitly specified */
  theme?: 'light' | 'dark' | 'auto';
}

export const HandwritingHighlight: React.FC<HandwritingHighlightProps> = ({
  text,
  variant = 'underline',
  color,
  fontFamily = 'Caveat, cursive',
  delayFrames = 5,
  drawDurationFrames = 18,
  style,
  className = '',
  theme = 'auto',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Resolved color: if user explicitly passes color, use it.
  // Otherwise pick contrast-safe default based on theme.
  const resolvedColor = color || (theme === 'light' ? '#EA580C' : '#FFA000');

  const animStart = delayFrames;
  const animEnd = delayFrames + drawDurationFrames;

  // Drawing progress (0 to 1)
  const progress = interpolate(frame, [animStart, animEnd], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const pathLength = 300;
  const strokeDashoffset = pathLength * (1 - progress);

  return (
    <span
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{
        position: 'relative',
        display: 'inline-block',
        ...style,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Kalam:wght@700&display=swap');
      `}</style>

      {/* Text layer */}
      {text && (
        <span
          style={{
            position: 'relative',
            zIndex: 2,
            fontFamily: variant === 'text_kalam' ? 'Kalam, cursive' : undefined,
          }}
        >
          {text}
        </span>
      )}

      {/* SVG Hand-drawn stroke layer */}
      <svg
        className="absolute inset-0 pointer-events-none"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'visible',
          zIndex: 1,
        }}
        viewBox="0 0 100 40"
        preserveAspectRatio="none"
      >
        {variant === 'underline' && (
          <path
            d="M 2,34 Q 30,37 55,33 Q 80,30 98,34 Q 70,36 10,37"
            fill="none"
            stroke={resolvedColor}
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: pathLength,
              strokeDashoffset,
              filter: `drop-shadow(0 2px 8px ${resolvedColor}66)`,
            }}
          />
        )}

        {variant === 'circle' && (
          <ellipse
            cx="50"
            cy="20"
            rx="48"
            ry="18"
            fill="none"
            stroke={resolvedColor}
            strokeWidth="3.5"
            strokeLinecap="round"
            style={{
              strokeDasharray: pathLength,
              strokeDashoffset,
              transform: 'rotate(-2deg)',
              transformOrigin: 'center',
              filter: `drop-shadow(0 2px 8px ${resolvedColor}66)`,
            }}
          />
        )}

        {variant === 'marker_box' && (
          <rect
            x="2"
            y="2"
            width="96"
            height="36"
            rx="6"
            fill={`${resolvedColor}22`}
            stroke={resolvedColor}
            strokeWidth="3"
            strokeLinecap="round"
            style={{
              strokeDasharray: pathLength,
              strokeDashoffset,
              filter: `drop-shadow(0 2px 10px ${resolvedColor}44)`,
            }}
          />
        )}
      </svg>
    </span>
  );
};

export default HandwritingHighlight;
