import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface ComparisonSide {
  tag: string; // e.g. "MOST CREATORS" or "AVERAGE RETURN"
  title: string; // e.g. "Single Thumbnail" or "FD: 6.5%"
  description?: string;
  isWinner?: boolean;
}

export interface SideBySideComparisonBannerProps {
  left: ComparisonSide;
  right: ComparisonSide;
  triggerFrame?: number;
  style?: React.CSSProperties;
}

/**
 * Top Creator Side-By-Side Visual Comparison Split
 * Observed in:
 * - Film Booth ("Thumbnails 81% Better" at 180s: MOST OF US vs WINNER)
 * - Ankur Warikoo / Finance breakdown ("FD vs SIP" at 65s)
 */
export const SideBySideComparisonBanner: React.FC<SideBySideComparisonBannerProps> = ({
  left,
  right,
  triggerFrame = 0,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relFrame = Math.max(0, frame - triggerFrame);

  // Springs for Left (Bad/Standard) and Right (Pro/Winner)
  const leftSpring = spring({ frame: relFrame, fps, config: { damping: 14, stiffness: 160 } });
  const rightSpring = spring({ frame: Math.max(0, relFrame - 8), fps, config: { damping: 12, stiffness: 170 } });

  // Divider expansion
  const dividerHeight = interpolate(relFrame, [4, 18], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: 60,
        left: '8%',
        right: '8%',
        zIndex: 42,
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'center',
        gap: 24,
        pointerEvents: 'none',
        ...style,
      }}
    >
      {/* Left Column: Standard / Avoid */}
      <div
        style={{
          flex: 1,
          transform: `scale(${leftSpring})`,
          background: 'rgba(15, 23, 42, 0.88)',
          backdropFilter: 'blur(16px)',
          borderRadius: 24,
          padding: '24px 32px',
          border: '1.5px solid rgba(239, 68, 68, 0.4)',
          boxShadow: '0 16px 36px rgba(0, 0, 0, 0.6)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        <span
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: 14,
            fontWeight: 900,
            color: '#EF4444',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          {left.tag}
        </span>
        <div
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: 28,
            fontWeight: 800,
            color: '#FFFFFF',
            lineHeight: 1.2,
          }}
        >
          {left.title}
        </div>
        {left.description && (
          <div
            style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: 16,
              color: '#94A3B8',
              marginTop: 8,
            }}
          >
            {left.description}
          </div>
        )}
      </div>

      {/* VS / Split Divider Indicator */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 2,
            height: `${dividerHeight}%`,
            background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.4), transparent)',
          }}
        />
        <div
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: 14,
            fontWeight: 900,
            color: '#64748B',
            background: '#090D16',
            padding: '6px 12px',
            borderRadius: 9999,
            border: '1px solid rgba(255,255,255,0.15)',
            margin: '8px 0',
          }}
        >
          VS
        </div>
        <div
          style={{
            width: 2,
            height: `${dividerHeight}%`,
            background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.4), transparent)',
          }}
        />
      </div>

      {/* Right Column: Pro / Winner */}
      <div
        style={{
          flex: 1,
          transform: `scale(${rightSpring})`,
          background: 'linear-gradient(145deg, rgba(16, 185, 129, 0.15) 0%, rgba(15, 23, 42, 0.92) 100%)',
          backdropFilter: 'blur(16px)',
          borderRadius: 24,
          padding: '24px 32px',
          border: '2px solid #10B981',
          boxShadow: '0 20px 45px rgba(16, 185, 129, 0.25), 0 16px 36px rgba(0, 0, 0, 0.7)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 8,
          }}
        >
          <span
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: 14,
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
              fontSize: 11,
              fontWeight: 900,
              padding: '2px 8px',
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
            fontSize: 28,
            fontWeight: 800,
            color: '#FFFFFF',
            lineHeight: 1.2,
          }}
        >
          {right.title}
        </div>
        {right.description && (
          <div
            style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: 16,
              color: '#A7F3D0',
              marginTop: 8,
            }}
          >
            {right.description}
          </div>
        )}
      </div>
    </div>
  );
};

