import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface PaydayProtocolItem {
  id: string;
  stepNumber: string;
  title: string;
  hindiTitle: string;
  subtitle: string;
  badge: string;
  accentColor: string;
  icon: string;
  actionSummary: string;
}

export interface PaydaySalaryProtocolAssetProps {
  sceneFrame?: number;
  isDark?: boolean;
  scale?: number;
  startDelayFrames?: number;
}

/**
 * PaydaySalaryProtocolAsset
 * The 5-Step Payday Wealth Protocol (Salary मिलते ही 5 काम)
 * 1. Emergency Fund (3-6 Months Liquid)
 * 2. High-Interest Debt & Bills (Full Credit Card Clear)
 * 3. Direct Mutual Fund SIP (Low-Cost Index / Direct Plans)
 * 4. Gold ETF Allocation (5-10% Inflation Hedge)
 * 5. Term & Health Safety Net (Pure Protection)
 * Learned from XY- Axis Education (YouTube: VnQpShm3d6M).
 */
export const PaydaySalaryProtocolAsset: React.FC<PaydaySalaryProtocolAssetProps> = ({
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

  const steps: PaydayProtocolItem[] = [
    {
      id: 'emergency-fund',
      stepNumber: '01',
      title: 'Emergency Reserve',
      hindiTitle: 'इमरजेंसी फंड',
      subtitle: '3–6 Months Living Expenses',
      badge: 'SAFETY BUFFER',
      accentColor: '#0284C7',
      icon: '🛡️',
      actionSummary: 'Liquid sweep-in FD or high-interest savings before risky investments.',
    },
    {
      id: 'debt-clearance',
      stepNumber: '02',
      title: 'Debt & Bills First',
      hindiTitle: 'कर्ज व बिल मुक्ति',
      subtitle: 'Zero Credit Card Rollover',
      badge: 'ZERO INTEREST',
      accentColor: '#EF4444',
      icon: '💳',
      actionSummary: 'Pay credit card in full on Day 1 to avoid 40%+ annual finance charges.',
    },
    {
      id: 'direct-sip',
      stepNumber: '03',
      title: 'Direct Mutual Fund SIP',
      hindiTitle: 'डायरेक्ट प्लान SIP',
      subtitle: 'Index & Flexi-Cap Direct',
      badge: 'WEALTH ENGINE',
      accentColor: '#059669',
      icon: '📈',
      actionSummary: 'Automated payday SIP in Direct plans (saves 1.0–1.5% commission fee).',
    },
    {
      id: 'gold-hedge',
      stepNumber: '04',
      title: 'Gold ETF Allocation',
      hindiTitle: 'गोल्ड ETF हेज',
      subtitle: '5%–10% Crisis Cushion',
      badge: 'INFLATION HEDGE',
      accentColor: '#D97706',
      icon: '🪙',
      actionSummary: 'Digital Gold ETF or Sovereign Gold Bonds for currency depreciation protection.',
    },
    {
      id: 'pure-insurance',
      stepNumber: '05',
      title: 'Term & Health Cover',
      hindiTitle: 'सुरक्षा कवच',
      subtitle: 'Pure Term + Super Top-up',
      badge: 'LIFE PROTECTION',
      accentColor: '#8B5CF6',
      icon: '🏥',
      actionSummary: 'Zero-investment pure term cover + adequate family health insurance.',
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
            Salary Day 5-Step Wealth Protocol
          </h3>
          <span style={{ fontSize: 13, color: isDark ? '#A1A1AA' : '#71717A' }}>
            सैलरी मिलते ही ये 5 काम: Pay Yourself First Before Spending ₹1
          </span>
        </div>

        <div
          style={{
            fontFamily: 'Caveat, cursive',
            fontSize: 19,
            fontWeight: 700,
            color: '#EA580C',
            transform: 'rotate(-3deg)',
            backgroundColor: isDark ? 'rgba(234, 88, 12, 0.15)' : '#FFF7ED',
            padding: '4px 12px',
            borderRadius: 8,
            border: '1px dashed #EA580C',
          }}
        >
          Pay yourself first on Day 1!
        </div>
      </div>

      {/* 5 Protocol Columns */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 10,
          marginBottom: 14,
        }}
      >
        {steps.map((st, idx) => {
          const cardSpring = spring({
            frame: Math.max(0, frame - idx * 4),
            fps,
            config: { damping: 14, stiffness: 130 },
          });

          return (
            <div
              key={st.id}
              style={{
                opacity: cardSpring,
                transform: `translateY(${interpolate(cardSpring, [0, 1], [16, 0])}px)`,
                borderRadius: 14,
                backgroundColor: isDark ? 'rgba(24, 24, 27, 0.85)' : '#FFFFFF',
                border: isDark
                  ? `1px solid ${st.accentColor}33`
                  : `1px solid ${st.accentColor}25`,
                boxShadow: isDark
                  ? '0 6px 18px rgba(0, 0, 0, 0.35)'
                  : '0 6px 18px rgba(0, 0, 0, 0.04)',
                padding: '12px 10px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Top Accent Strip */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  backgroundColor: st.accentColor,
                }}
              />

              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      fontFamily: 'Inter, monospace',
                      color: st.accentColor,
                      backgroundColor: isDark ? `${st.accentColor}22` : `${st.accentColor}12`,
                      padding: '2px 5px',
                      borderRadius: 4,
                    }}
                  >
                    STEP {st.stepNumber}
                  </span>
                  <span style={{ fontSize: 13 }}>{st.icon}</span>
                </div>

                <div
                  style={{
                    fontSize: 8.5,
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    color: st.accentColor,
                    marginBottom: 4,
                    textTransform: 'uppercase',
                  }}
                >
                  {st.badge}
                </div>

                <h4
                  style={{
                    margin: '0 0 2px 0',
                    fontSize: 13,
                    fontWeight: 700,
                    color: isDark ? '#FAFAFA' : '#18181B',
                    fontFamily: 'Lora, Georgia, serif',
                    lineHeight: 1.2,
                  }}
                >
                  {st.title}
                </h4>

                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: st.accentColor,
                    marginBottom: 6,
                    lineHeight: 1.25,
                  }}
                >
                  {st.hindiTitle}
                </div>

                <p style={{ margin: 0, fontSize: 10.5, color: isDark ? '#A1A1AA' : '#64748B', lineHeight: 1.35 }}>
                  {st.actionSummary}
                </p>
              </div>

              <div
                style={{
                  marginTop: 8,
                  paddingTop: 6,
                  borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #F1F5F9',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 9.5,
                  color: st.accentColor,
                  fontWeight: 600,
                }}
              >
                <span>✓</span>
                <span>Day 1 Automated</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* The 50:30:20 Wealth Rule Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 14px',
          borderRadius: 10,
          backgroundColor: isDark ? 'rgba(16, 185, 129, 0.12)' : '#F0FDF4',
          border: '1px solid rgba(16, 185, 129, 0.25)',
        }}
      >
        <span style={{ fontSize: 11.5, fontWeight: 700, color: '#059669' }}>
          ★ The Payday Split Rule:
        </span>
        <span style={{ fontSize: 11, color: isDark ? '#E4E4E7' : '#475569' }}>
          50% Needs (Rent, Food, EMI) • 30% Future Freedom (SIP + Buffer + Insurance) • 20% Guilt-Free Lifestyle.
        </span>
      </div>
    </div>
  );
};
