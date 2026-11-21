import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface BankScorecardItem {
  id: string;
  bankName: string;
  tagline: string;
  accentColor: string;
  minBalance: string;
  interestRate: string;
  virtualDebitCard: string;
  kycMethod: string;
  bestForBadge: string;
}

export interface BankComparisonScorecardAssetProps {
  sceneFrame?: number;
  isDark?: boolean;
  scale?: number;
  startDelayFrames?: number;
}

/**
 * BankComparisonScorecardAsset
 * Zero Balance Bank Account Comparison Scorecard (Fintech & Banking Review Guide)
 * Compares Kotak 811, AU Small Finance Bank, and Jupiter/Federal Bank across 5 metrics.
 * Learned from XY- Axis Education (YouTube: J1vuXNKDETc).
 */
export const BankComparisonScorecardAsset: React.FC<BankComparisonScorecardAssetProps> = ({
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

  const accounts: BankScorecardItem[] = [
    {
      id: 'kotak-811',
      bankName: 'Kotak 811',
      tagline: 'Kotak Mahindra Bank',
      accentColor: '#E11D48',
      minBalance: '₹0 (True Zero MAB)',
      interestRate: 'Up to 4.0% p.a.',
      virtualDebitCard: 'Free Virtual Card (₹0)',
      kycMethod: '5-Min Video KYC',
      bestForBadge: 'Best for Students & Daily UPI',
    },
    {
      id: 'au-small-finance',
      bankName: 'AU Small Finance',
      tagline: 'High Yield Savings',
      accentColor: '#D97706',
      minBalance: '₹0 Balance Variant',
      interestRate: 'Up to 7.25% p.a.',
      virtualDebitCard: 'App Digital Visa',
      kycMethod: 'Paperless Aadhaar VKYC',
      bestForBadge: 'Best for High Savings Interest',
    },
    {
      id: 'jupiter-federal',
      bankName: 'Jupiter Money',
      tagline: 'Federal Bank Powered',
      accentColor: '#0284C7',
      minBalance: '₹0 Digital Account',
      interestRate: 'Up to 5.0% in Pots',
      virtualDebitCard: 'Free Virtual VISA',
      kycMethod: 'Instant Bio/Video KYC',
      bestForBadge: 'Best for Budgeting & Smart Pots',
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
            Zero Balance Bank Accounts Compared
          </h3>
          <span style={{ fontSize: 13, color: isDark ? '#A1A1AA' : '#71717A' }}>
            Interest Rates, Virtual Cards &amp; Hidden Charges Breakdown
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
          Check hidden debit card fees!
        </div>
      </div>

      {/* 3 Bank Columns */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 14,
          marginBottom: 14,
        }}
      >
        {accounts.map((acc, idx) => {
          const cardSpring = spring({
            frame: Math.max(0, frame - idx * 5),
            fps,
            config: { damping: 14, stiffness: 130 },
          });

          return (
            <div
              key={acc.id}
              style={{
                opacity: cardSpring,
                transform: `translateY(${interpolate(cardSpring, [0, 1], [18, 0])}px)`,
                borderRadius: 16,
                backgroundColor: isDark ? 'rgba(24, 24, 27, 0.85)' : '#FFFFFF',
                border: isDark
                  ? `1px solid ${acc.accentColor}33`
                  : `1px solid ${acc.accentColor}25`,
                boxShadow: isDark
                  ? '0 8px 24px rgba(0, 0, 0, 0.35)'
                  : '0 8px 24px rgba(0, 0, 0, 0.04)',
                padding: '16px 14px',
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
                  backgroundColor: acc.accentColor,
                }}
              />

              <div>
                {/* Header Row: Bank Name & "Best For" Badge */}
                <div style={{ marginBottom: 10 }}>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      color: acc.accentColor,
                      backgroundColor: isDark ? `${acc.accentColor}22` : `${acc.accentColor}12`,
                      padding: '2px 8px',
                      borderRadius: 4,
                      display: 'inline-block',
                      marginBottom: 6,
                      letterSpacing: '0.04em',
                    }}
                  >
                    {acc.bestForBadge}
                  </div>

                  <h4
                    style={{
                      margin: '0 0 2px 0',
                      fontSize: 16,
                      fontWeight: 700,
                      color: isDark ? '#FAFAFA' : '#18181B',
                      fontFamily: 'Lora, Georgia, serif',
                    }}
                  >
                    {acc.bankName}
                  </h4>
                  <div style={{ fontSize: 11, color: isDark ? '#A1A1AA' : '#64748B' }}>
                    {acc.tagline}
                  </div>
                </div>

                {/* Metrics Stack */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                  {/* Min Balance */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '6px 8px',
                      borderRadius: 6,
                      backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F8FAFC',
                      fontSize: 11.5,
                    }}
                  >
                    <span style={{ color: isDark ? '#A1A1AA' : '#64748B' }}>Min Balance:</span>
                    <span style={{ fontWeight: 700, color: '#059669' }}>{acc.minBalance}</span>
                  </div>

                  {/* Interest Rate */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '6px 8px',
                      borderRadius: 6,
                      backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F8FAFC',
                      fontSize: 11.5,
                    }}
                  >
                    <span style={{ color: isDark ? '#A1A1AA' : '#64748B' }}>Savings Rate:</span>
                    <span style={{ fontWeight: 700, color: acc.accentColor }}>{acc.interestRate}</span>
                  </div>

                  {/* Virtual Debit Card */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '6px 8px',
                      borderRadius: 6,
                      backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F8FAFC',
                      fontSize: 11.5,
                    }}
                  >
                    <span style={{ color: isDark ? '#A1A1AA' : '#64748B' }}>Virtual Card:</span>
                    <span style={{ fontWeight: 600, color: isDark ? '#E4E4E7' : '#1E293B' }}>
                      {acc.virtualDebitCard}
                    </span>
                  </div>

                  {/* Video KYC */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '6px 8px',
                      borderRadius: 6,
                      backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F8FAFC',
                      fontSize: 11.5,
                    }}
                  >
                    <span style={{ color: isDark ? '#A1A1AA' : '#64748B' }}>Onboarding:</span>
                    <span style={{ fontWeight: 600, color: '#0284C7' }}>{acc.kycMethod}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Verification Footer */}
              <div
                style={{
                  paddingTop: 8,
                  borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #F1F5F9',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 10.5,
                  color: acc.accentColor,
                  fontWeight: 600,
                }}
              >
                <span>✓</span>
                <span>100% Paperless Online</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hidden Charges Alert Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 14px',
          borderRadius: 10,
          backgroundColor: isDark ? 'rgba(234, 88, 12, 0.12)' : '#FFF7ED',
          border: '1px solid rgba(234, 88, 12, 0.25)',
        }}
      >
        <span style={{ fontSize: 11.5, fontWeight: 700, color: '#EA580C' }}>
          ⚠️ Hidden Charges Checklist:
        </span>
        <span style={{ fontSize: 11, color: isDark ? '#E4E4E7' : '#475569' }}>
          Avoid ordering unnecessary physical debit cards (₹199 - ₹299/yr). Use free virtual cards for UPI &amp; online shopping.
        </span>
      </div>
    </div>
  );
};
