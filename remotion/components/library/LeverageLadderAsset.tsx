import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface LeverageLadderRung {
  level: number;
  title: string;
  subtitle: string;
  multiplier: string;
  color: string;
  isUnlocked?: boolean;
}

export interface LeverageLadderAssetProps {
  sceneFrame?: number;
  isDark?: boolean;
  scale?: number;
  startDelayFrames?: number;
}

/**
 * LeverageLadderAsset
 * 4-Stage Wealth & Career Leverage Ladder (Employment -> Freelancing -> Productized -> Digital Leverage).
 * Learned from Ali Abdaal's "If You Have a Job, Start Selling Your Skills ASAP" (YouTube: L9GHmwO4-uw).
 */
export const LeverageLadderAsset: React.FC<LeverageLadderAssetProps> = ({
  sceneFrame,
  isDark = false,
  scale = 1.0,
  startDelayFrames = 8,
}) => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const activeFrame = (sceneFrame !== undefined ? sceneFrame : currentFrame) - startDelayFrames;
  const frame = Math.max(0, activeFrame);

  const rungs: LeverageLadderRung[] = [
    {
      level: 1,
      title: 'Time for Money (Employed)',
      subtitle: 'Selling hours to an employer • Capped upside • 1/3 revenue retained',
      multiplier: '1x Base',
      color: '#64748B',
      isUnlocked: true,
    },
    {
      level: 2,
      title: 'Bespoke Services (Freelancing)',
      subtitle: 'High-ticket 1-on-1 problem solving • Keep 100% of revenue • $100-$300/hr',
      multiplier: '3x Upside',
      color: '#0284C7',
      isUnlocked: true,
    },
    {
      level: 3,
      title: 'Productized Agency / Retainers',
      subtitle: 'Standardized scope • Recurring monthly MRR • Delegated execution',
      multiplier: '8x Leverage',
      color: '#D97706',
      isUnlocked: true,
    },
    {
      level: 4,
      title: 'Scalable Media & Software',
      subtitle: 'Code & Content • Asynchronous sales • Zero marginal cost of replication',
      multiplier: '∞ Scalability',
      color: '#059669',
      isUnlocked: true,
    },
  ];

  const headerSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
        width: '100%',
        maxWidth: 780,
        margin: '0 auto',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Title & Badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
          opacity: headerSpring,
          transform: `translateY(${interpolate(headerSpring, [0, 1], [12, 0])}px)`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              backgroundColor: '#EA580C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
          </div>
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: 18,
                fontWeight: 700,
                fontFamily: 'Lora, Georgia, serif',
                color: isDark ? '#F4F4F5' : '#18181B',
                letterSpacing: '-0.01em',
              }}
            >
              The Leverage Ladder
            </h3>
            <span style={{ fontSize: 12, color: isDark ? '#A1A1AA' : '#71717A' }}>
              Escaping the Time-for-Money Salary Trap
            </span>
          </div>
        </div>

        <div
          style={{
            padding: '4px 12px',
            borderRadius: 20,
            backgroundColor: isDark ? 'rgba(234, 88, 12, 0.15)' : 'rgba(234, 88, 12, 0.10)',
            border: '1px solid rgba(234, 88, 12, 0.3)',
            fontSize: 11,
            fontWeight: 700,
            color: '#EA580C',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          4-Stage Blueprint
        </div>
      </div>

      {/* Ladder Rungs Stack (Ascending, bottom to top) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {rungs.map((rung, index) => {
          const itemSpring = spring({
            frame: Math.max(0, frame - index * 6),
            fps,
            config: { damping: 14, stiffness: 130 },
          });

          const translateY = interpolate(itemSpring, [0, 1], [24, 0]);
          const opacity = interpolate(itemSpring, [0, 1], [0, 1]);

          return (
            <div
              key={rung.level}
              style={{
                opacity,
                transform: `translateY(${translateY}px)`,
                backgroundColor: isDark ? 'rgba(24, 24, 27, 0.85)' : '#FFFFFF',
                borderRadius: 14,
                border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
                boxShadow: isDark
                  ? '0 8px 24px -6px rgba(0, 0, 0, 0.5)'
                  : '0 8px 24px -6px rgba(0, 0, 0, 0.06)',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Left Accent Stripe */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 4,
                  backgroundColor: rung.color,
                }}
              />

              {/* Rung Number & Titles */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingLeft: 6 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : '#F4F4F5',
                    color: rung.color,
                    fontSize: 14,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {rung.level}
                </div>

                <div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 650,
                      color: isDark ? '#FAFAFA' : '#18181B',
                      marginBottom: 2,
                    }}
                  >
                    {rung.title}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: isDark ? '#A1A1AA' : '#71717A',
                    }}
                  >
                    {rung.subtitle}
                  </div>
                </div>
              </div>

              {/* Multiplier Tag */}
              <div
                style={{
                  padding: '5px 12px',
                  borderRadius: 8,
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F8FAFC',
                  border: `1px solid ${rung.color}35`,
                  color: rung.color,
                  fontSize: 12,
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                }}
              >
                {rung.multiplier}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

