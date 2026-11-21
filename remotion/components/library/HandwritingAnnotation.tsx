import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface HandwritingAnnotationProps {
  sceneFrame?: number;
  text: string;
  type?: 'arrow-left' | 'arrow-right' | 'arrow-down' | 'arrow-up' | 'circle' | 'underline' | 'bracket';
  color?: string;
  fontSize?: number;
  rotation?: number;
  scale?: number;
  style?: React.CSSProperties;
  startDelayFrames?: number;
}

/**
 * HandwritingAnnotation
 * Reusable handwritten annotations & doodle arrows learned from Ali Abdaal's video editing style.
 * Uses 'Caveat, cursive' font with animated organic vector arrows.
 */
export const HandwritingAnnotation: React.FC<HandwritingAnnotationProps> = ({
  sceneFrame,
  text,
  type = 'arrow-left',
  color = '#EA580C', // Signature flame orange or warm amber
  fontSize = 24,
  rotation = -4,
  scale = 1.0,
  style = {},
  startDelayFrames = 10,
}) => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const activeFrame = (sceneFrame !== undefined ? sceneFrame : currentFrame) - startDelayFrames;
  const frame = Math.max(0, activeFrame);

  // Entrance spring
  const drawSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const arrowLength = 120;
  const strokeDashoffset = interpolate(drawSpring, [0, 1], [arrowLength, 0]);
  const textOpacity = interpolate(frame, [8, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Render Arrow Path based on direction
  const renderArrowSvg = () => {
    switch (type) {
      case 'arrow-right':
        return (
          <svg width="60" height="40" viewBox="0 0 60 40" fill="none" style={{ overflow: 'visible' }}>
            <path
              d="M 5 28 Q 28 8 52 18 L 42 12 M 52 18 L 44 26"
              stroke={color}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={arrowLength}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
        );
      case 'arrow-down':
        return (
          <svg width="40" height="60" viewBox="0 0 40 60" fill="none" style={{ overflow: 'visible' }}>
            <path
              d="M 12 5 Q 32 26 20 52 L 14 42 M 20 52 L 28 44"
              stroke={color}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={arrowLength}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
        );
      case 'circle':
        return (
          <svg width="120" height="60" viewBox="0 0 120 60" fill="none" style={{ overflow: 'visible' }}>
            <path
              d="M 15 30 C 15 12, 105 10, 105 30 C 105 50, 10 52, 18 32"
              stroke={color}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={260}
              strokeDashoffset={interpolate(drawSpring, [0, 1], [260, 0])}
            />
          </svg>
        );
      case 'underline':
        return (
          <svg width="140" height="20" viewBox="0 0 140 20" fill="none" style={{ overflow: 'visible' }}>
            <path
              d="M 5 12 Q 70 18 135 8"
              stroke={color}
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={140}
              strokeDashoffset={interpolate(drawSpring, [0, 1], [140, 0])}
            />
          </svg>
        );
      case 'arrow-left':
      default:
        return (
          <svg width="60" height="40" viewBox="0 0 60 40" fill="none" style={{ overflow: 'visible' }}>
            <path
              d="M 55 28 Q 32 8 8 18 L 18 12 M 8 18 L 16 26"
              stroke={color}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={arrowLength}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
        );
    }
  };

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        transform: `rotate(${rotation}deg) scale(${scale})`,
        pointerEvents: 'none',
        userSelect: 'none',
        zIndex: 35,
        ...style,
      }}
    >
      {type === 'arrow-left' && renderArrowSvg()}

      <span
        style={{
          fontFamily: 'Caveat, "Brush Script MT", cursive',
          fontSize: `${fontSize}px`,
          fontWeight: 700,
          color,
          lineHeight: 1.1,
          opacity: textOpacity,
          textShadow: '0 1px 2px rgba(0,0,0,0.06)',
          whiteSpace: 'nowrap',
        }}
      >
        {text}
      </span>

      {type !== 'arrow-left' && renderArrowSvg()}
    </div>
  );
};

export default HandwritingAnnotation;
