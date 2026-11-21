import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface IndexInvestingStep {
  stepNumber: string;
  title: string;
  subtitle: string;
  accentColor: string;
  badge: string;
}

export interface IndexInvestingModelAssetProps {
  sceneFrame?: number;
  isDark?: boolean;
  scale?: number;
  startDelayFrames?: number;
}

/**
 * IndexInvestingModelAsset
 * The Beginner Index Investing Blueprint: Inflation Decay vs Compounding S&P 500 Basket
 * Learned from Ali Abdaal's "The Only Investing Video You'll Ever Need (Start With $0)" (YouTube: bfENsVP77VQ).
 */
export const IndexInvestingModelAsset: React.FC<IndexInvestingModelAssetProps> = ({
  sceneFrame,
  isDark = false,
  scale = 1.0,
  startDelayFrames = 5,
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

  const steps: IndexInvestingStep[] = [
    {
      stepNumber: '01',
      title: 'Open Tax-Efficient Account',
      subtitle: 'ISA, Roth IRA, or Low-Fee Brokerage',
      accentColor: '#0284C7',
      badge: 'ACCOUNT SETUP',
    },
    {
      stepNumber: '02',
      title: 'Pick a Broad Index Fund',
      subtitle: 'S&P 500 or FTSE All-World (500+ Companies)',
      accentColor: '#059669',
      badge: 'DIVERSIFICATION',
    },
    {
      stepNumber: '03',
      title: 'Automate Monthly Deposits',
      subtitle: 'Standing order on payday (DCA on Autopilot)',
      accentColor: '#D97706',
      badge: 'AUTOMATION',
    },
  ];

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
        width: '100%',
        maxWidth: 880,
        margin: '0 auto',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Title & Callout Header */}
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
              fontSize: 20,
              fontWeight: 700,
              fontFamily: 'Lora, Georgia, serif',
              color: isDark ? '#FAFAFA' : '#141414',
            }}
          >
            The Index Investing Blueprint
          </h3>
          <span style={{ fontSize: 13, color: isDark ? '#A1A1AA' : '#71717A' }}>
            Start With $0: Beating Inflation Through Passive Compounding
          </span>
        </div>

        <div
          style={{
            fontFamily: 'Caveat, cursive',
            fontSize: 20,
            fontWeight: 700,
            color: '#EA580C',
            transform: 'rotate(-3deg)',
            backgroundColor: isDark ? 'rgba(234, 88, 12, 0.15)' : '#FFF7ED',
            padding: '4px 12px',
            borderRadius: 8,
            border: '1px dashed #EA580C',
          }}
        >
          Buy the whole haystack!
        </div>
      </div>

      {/* Split Comparison Cards: Cash vs Index Fund */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 14,
          marginBottom: 14,
        }}
      >
        {/* Left: Cash in Bank */}
        <div
          style={{
            borderRadius: 14,
            backgroundColor: isDark ? 'rgba(24, 24, 27, 0.85)' : '#FFFFFF',
            border: isDark ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(239, 68, 68, 0.2)',
            padding: '14px 16px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              backgroundColor: '#EF4444',
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#EF4444', textTransform: 'uppercase' }}>
              The Loser: Cash In Savings
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: '#EF4444',
                backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEF2F2',
                padding: '2px 8px',
                borderRadius: 4,
              }}
            >
              -3% / yr (Inflation)
            </span>
          </div>
          <p style={{ margin: 0, fontSize: 12, color: isDark ? '#A1A1AA' : '#64748B', lineHeight: 1.4 }}>
            Money sitting in a traditional low-interest savings account guarantees guaranteed loss of purchasing power over time.
          </p>
        </div>

        {/* Right: S&P 500 Index Basket */}
        <div
          style={{
            borderRadius: 14,
            backgroundColor: isDark ? 'rgba(24, 24, 27, 0.85)' : '#FFFFFF',
            border: isDark ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid rgba(16, 185, 129, 0.25)',
            padding: '14px 16px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              backgroundColor: '#059669',
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#059669', textTransform: 'uppercase' }}>
              The Winner: Broad Index Fund
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: '#059669',
                backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#F0FDF4',
                padding: '2px 8px',
                borderRadius: 4,
              }}
            >
              +8% to +10% / yr Avg
            </span>
          </div>
          <p style={{ margin: 0, fontSize: 12, color: isDark ? '#D4D4D8' : '#334155', lineHeight: 1.4 }}>
            Own a diversified basket of the 500 biggest global corporations. The entire market compounds automatically.
          </p>
        </div>
      </div>

      {/* 3 Step Action Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 12,
        }}
      >
        {steps.map((st, idx) => {
          const stepSpring = spring({
            frame: Math.max(0, frame - idx * 5),
            fps,
            config: { damping: 14, stiffness: 130 },
          });

          return (
            <div
              key={st.stepNumber}
              style={{
                opacity: stepSpring,
                transform: `translateY(${interpolate(stepSpring, [0, 1], [16, 0])}px)`,
                borderRadius: 14,
                backgroundColor: isDark ? 'rgba(24, 24, 27, 0.85)' : '#FFFFFF',
                border: isDark
                  ? `1px solid ${st.accentColor}33`
                  : `1px solid ${st.accentColor}25`,
                boxShadow: isDark
                  ? '0 6px 18px rgba(0, 0, 0, 0.35)'
                  : '0 6px 18px rgba(0, 0, 0, 0.04)',
                padding: '14px 14px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      fontFamily: 'Inter, monospace',
                      color: st.accentColor,
                      backgroundColor: isDark ? `${st.accentColor}22` : `${st.accentColor}12`,
                      padding: '2px 8px',
                      borderRadius: 6,
                    }}
                  >
                    STEP {st.stepNumber}
                  </span>
                  <span style={{ fontSize: 9.5, fontWeight: 700, color: st.accentColor, letterSpacing: '0.04em' }}>
                    {st.badge}
                  </span>
                </div>

                <h4
                  style={{
                    margin: '0 0 4px 0',
                    fontSize: 14.5,
                    fontWeight: 700,
                    color: isDark ? '#FAFAFA' : '#18181B',
                    fontFamily: 'Lora, Georgia, serif',
                    lineHeight: 1.25,
                  }}
                >
                  {st.title}
                </h4>

                <p style={{ margin: 0, fontSize: 11.5, color: isDark ? '#A1A1AA' : '#64748B', lineHeight: 1.4 }}>
                  {st.subtitle}
                </p>
              </div>

              <div
                style={{
                  marginTop: 10,
                  paddingTop: 8,
                  borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #F1F5F9',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 10.5,
                  color: st.accentColor,
                  fontWeight: 600,
                }}
              >
                <span>✓</span>
                <span>Time in Market &gt; Timing</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

