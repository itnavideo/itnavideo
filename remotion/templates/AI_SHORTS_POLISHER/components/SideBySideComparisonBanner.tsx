import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface ComparisonSide {
  tag: string;
  title: string;
  description?: string;
  isWinner?: boolean;
}

export interface SideBySideComparisonBannerProps {
  left: ComparisonSide;
  right: ComparisonSide;
  triggerFrame?: number;
  style?: React.CSSProperties;
}

export const SideBySideComparisonBanner: React.FC<SideBySideComparisonBannerProps> = ({
  left,
  right,
  triggerFrame = 0,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relFrame = Math.max(0, frame - triggerFrame);

  const leftSpring = spring({ frame: relFrame, fps, config: { damping: 14, stiffness: 160 } });
  const rightSpring = spring({ frame: Math.max(0, relFrame - 8), fps, config: { damping: 12, stiffness: 170 } });

  return (
    <div
      style={{
        position: 'absolute',
        top: 240,
        left: '6%',
        right: '6%',
        zIndex: 42,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: 16,
        pointerEvents: 'none',
        ...style,
      }}
    >
      {/* Top: Standard / Avoid */}
      <div
        style={{
          transform: `scale(${leftSpring})`,
          background: 'rgba(15, 23, 42, 0.92)',
          backdropFilter: 'blur(16px)',
          borderRadius: 22,
          padding: '20px 24px',
          border: '1.5px solid rgba(239, 68, 68, 0.45)',
          boxShadow: '0 16px 36px rgba(0, 0, 0, 0.6)',
        }}
      >
        <span
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: 13,
            fontWeight: 900,
            color: '#EF4444',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          {left.tag}
        </span>
        <div
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: 24,
            fontWeight: 800,
            color: '#FFFFFF',
            lineHeight: 1.2,
            marginTop: 4,
          }}
        >
          {left.title}
        </div>
      </div>

      {/* Bottom: Pro / Winner */}
      <div
        style={{
          transform: `scale(${rightSpring})`,
          background: 'linear-gradient(145deg, rgba(16, 185, 129, 0.18) 0%, rgba(15, 23, 42, 0.95) 100%)',
          backdropFilter: 'blur(16px)',
          borderRadius: 22,
          padding: '20px 24px',
          border: '2.5px solid #10B981',
          boxShadow: '0 20px 45px rgba(16, 185, 129, 0.3), 0 16px 36px rgba(0, 0, 0, 0.7)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: 13,
              fontWeight: 900,
              color: '#10B981',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            {right.tag}
          </span>
          <span
            style={{
              background: '#10B981',
              color: '#064E3B',
              fontSize: 10,
              fontWeight: 900,
              padding: '2px 6px',
              borderRadius: 6,
              textTransform: 'uppercase',
            }}
          >
            PRO
          </span>
        </div>
        <div
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: 24,
            fontWeight: 800,
            color: '#FFFFFF',
            lineHeight: 1.2,
            marginTop: 4,
          }}
        >
          {right.title}
        </div>
      </div>
    </div>
  );
};

