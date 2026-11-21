import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface OneThousandLadderStep {
  missionNumber: number;
  revenueTarget: string;
  title: string;
  coreStrategy: string;
  badge: string;
  color: string;
  isUnlocked?: boolean;
}

export interface OneThousandLadderAssetProps {
  sceneFrame?: number;
  isDark?: boolean;
  scale?: number;
  startDelayFrames?: number;
  activeMission?: number;
}

/**
 * OneThousandLadderAsset
 * The "1K Ladder" Framework for Making Your First $1,000 Online ($1 -> $10 -> $100 -> $1,000).
 * Learned from Ali Abdaal's "How to make your first $1,000 online" (YouTube: CzDTaLqozlQ).
 */
export const OneThousandLadderAsset: React.FC<OneThousandLadderAssetProps> = ({
  sceneFrame,
  isDark = false,
  scale = 1.0,
  startDelayFrames = 5,
  activeMission = 2,
}) => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const activeFrame = (sceneFrame !== undefined ? sceneFrame : currentFrame) - startDelayFrames;
  const frame = Math.max(0, activeFrame);

  const headerSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const steps: OneThousandLadderStep[] = [
    {
      missionNumber: 1,
      revenueTarget: '$1',
      title: 'Psychological Proof',
      coreStrategy: 'Overcome the mental barrier • Stripe / Gumroad link to 1 friend',
      badge: 'Mission 1',
      color: '#64748B',
      isUnlocked: true,
    },
    {
      missionNumber: 2,
      revenueTarget: '$10',
      title: 'The Kickstarter Pre-Sell',
      coreStrategy: 'Pre-sell a $9 digital template BEFORE building it • Zero wasted time',
      badge: 'Mission 2: Validation',
      color: '#EA580C',
      isUnlocked: activeMission >= 2,
    },
    {
      missionNumber: 3,
      revenueTarget: '$100',
      title: 'Market Traction (10 Sales)',
      coreStrategy: 'Validate beyond friends • 10 organic sales to complete strangers',
      badge: 'Mission 3: Traction',
      color: '#0284C7',
      isUnlocked: activeMission >= 3,
    },
    {
      missionNumber: 4,
      revenueTarget: '$1,000',
      title: 'Price vs People Matrix',
      coreStrategy: '$100 × 10 buyers OR $500 × 2 client audits • The 1K Milestone',
      badge: 'Mission 4: 1K Milestone',
      color: '#059669',
      isUnlocked: activeMission >= 4,
    },
  ];

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
      {/* Title */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
          opacity: headerSpring,
          transform: `translateY(${interpolate(headerSpring, [0, 1], [14, 0])}px)`,
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 700,
              fontFamily: 'Lora, Georgia, serif',
              color: isDark ? '#FAFAFA' : '#141414',
            }}
          >
            The 1K Income Ladder
          </h3>
          <span style={{ fontSize: 12, color: isDark ? '#A1A1AA' : '#71717A' }}>
            First $1 $\rightarrow$ $10 $\rightarrow$ $100 $\rightarrow$ $1,000 Online
          </span>
        </div>

        <div
          style={{
            fontFamily: 'Caveat, cursive',
            fontSize: 18,
            fontWeight: 700,
            color: '#EA580C',
            transform: 'rotate(-4deg)',
            backgroundColor: isDark ? 'rgba(234, 88, 12, 0.15)' : '#FFF7ED',
            padding: '3px 10px',
            borderRadius: 8,
            border: '1px dashed #EA580C',
          }}
        >
          Pre-sell before you build!
        </div>
      </div>

      {/* 4 Steps Vertical Stack */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {steps.map((step, idx) => {
          const rowSpring = spring({
            frame: Math.max(0, frame - idx * 5),
            fps,
            config: { damping: 14, stiffness: 130 },
          });

          const isCurrent = activeMission === step.missionNumber;

          return (
            <div
              key={step.revenueTarget}
              style={{
                opacity: rowSpring,
                transform: `translateX(${interpolate(rowSpring, [0, 1], [-16, 0])}px)`,
                padding: '14px 18px',
                borderRadius: 14,
                backgroundColor: isDark ? 'rgba(24, 24, 27, 0.90)' : '#FFFFFF',
                border: isCurrent
                  ? `2px solid ${step.color}`
                  : isDark
                  ? '1px solid rgba(255, 255, 255, 0.08)'
                  : '1px solid rgba(0, 0, 0, 0.07)',
                boxShadow: isCurrent
                  ? `0 10px 30px -8px ${step.color}35`
                  : '0 4px 12px rgba(0, 0, 0, 0.04)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Left Accent Bar */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 4,
                  backgroundColor: step.color,
                }}
              />

              <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingLeft: 6 }}>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 10,
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : '#F4F4F5',
                    color: step.color,
                    fontSize: 16,
                    fontWeight: 900,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'Lora, serif',
                  }}
                >
                  {step.revenueTarget}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <span
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: isDark ? '#FFFFFF' : '#18181B',
                      }}
                    >
                      {step.title}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: isDark ? '#A1A1AA' : '#64748B',
                    }}
                  >
                    {step.coreStrategy}
                  </div>
                </div>
              </div>

              <div
                style={{
                  padding: '4px 12px',
                  borderRadius: 20,
                  backgroundColor: isCurrent
                    ? step.color
                    : isDark
                    ? 'rgba(255, 255, 255, 0.06)'
                    : '#F4F4F5',
                  color: isCurrent ? '#FFFFFF' : step.color,
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  whiteSpace: 'nowrap',
                }}
              >
                {step.badge}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

