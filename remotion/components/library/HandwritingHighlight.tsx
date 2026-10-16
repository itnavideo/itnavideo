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
}

export const HandwritingHighlight: React.FC<HandwritingHighlightProps> = ({
  text,
  variant = 'underline',
  color = '#FFA000',
  fontFamily = 'Caveat, cursive',
  delayFrames = 5,
  drawDurationFrames = 18,
  style,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

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

      {/* SVG Hand-Drawn Stroke Animation */}
      {variant === 'underline' && (
        <svg
          viewBox="0 0 200 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            position: 'absolute',
            bottom: '-10px',
            left: '-4%',
            width: '108%',
            height: '22px',
            pointerEvents: 'none',
            zIndex: 1,
            overflow: 'visible',
          }}
        >
          <path
            d="M 5 14 Q 50 6, 100 13 T 195 9"
            stroke={color}
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={pathLength}
            strokeDashoffset={strokeDashoffset}
            style={{
              filter: `drop-shadow(0 0 6px ${color}88)`,
            }}
          />
        </svg>
      )}

      {variant === 'circle' && (
        <svg
          viewBox="0 0 240 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            position: 'absolute',
            inset: '-12px -16px',
            width: 'calc(100% + 32px)',
            height: 'calc(100% + 24px)',
            pointerEvents: 'none',
            zIndex: 1,
            overflow: 'visible',
          }}
        >
          <path
            d="M 25 40 C 25 15, 110 8, 205 18 C 235 24, 235 58, 175 68 C 95 80, 15 70, 20 42 C 22 28, 60 18, 95 18"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={pathLength * 2}
            strokeDashoffset={pathLength * 2 * (1 - progress)}
            style={{
              filter: `drop-shadow(0 0 8px ${color}88)`,
            }}
          />
        </svg>
      )}

      {variant === 'marker_box' && (
        <span
          style={{
            position: 'absolute',
            inset: '-4px -8px',
            backgroundColor: color,
            opacity: interpolate(progress, [0, 1], [0, 0.28]),
            borderRadius: '6px',
            transform: `scaleX(${progress}) rotate(-0.5deg)`,
            transformOrigin: 'left center',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />
      )}
    </span>
  );
};

export default HandwritingHighlight;
