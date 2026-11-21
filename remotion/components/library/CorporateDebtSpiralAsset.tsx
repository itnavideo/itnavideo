import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface DebtSpiralStepItem {
  id: string;
  stepNumber: string;
  title: string;
  subtitle: string;
  description: string;
  dangerBadge: string;
  accentColor: string;
}

export interface CorporateDebtSpiralAssetProps {
  sceneFrame?: number;
  isDark?: boolean;
  scale?: number;
  startDelayFrames?: number;
  companyName?: string;
  founderName?: string;
  totalDebt?: string;
  peakHolding?: string;
  collapsedHolding?: string;
}

/**
 * CorporateDebtSpiralAsset
 * Rise & Fall of an Empire: Corporate Debt & Share Pledging Death Spiral
 * Analyzes Subhash Chandra & Zee Entertainment's ₹22,000+ Cr Debt Crisis:
 * 1. Cash Cow Diversification (Media → Long-Gestation Infra)
 * 2. Asset-Liability Mismatch (Short-Term Debt for 15-Year Roads)
 * 3. Loan Against Shares (LAS Pledging Trap)
 * 4. Margin Call Meltdown (IL&FS Trigger & Loss of Control from 42% to <4%)
 * Learned from CA Rahul Malodia (YouTube: HYKj8TLwb_w).
 */
export const CorporateDebtSpiralAsset: React.FC<CorporateDebtSpiralAssetProps> = ({
  sceneFrame,
  isDark = false,
  scale = 1.0,
  startDelayFrames = 5,
  companyName = 'Zee Entertainment (Essel Group)',
  founderName = 'Subhash Chandra Case Study',
  totalDebt = '₹22,000+ Cr Crisis',
  peakHolding = '42% Peak Holding',
  collapsedHolding = '<4% Post-Crash',
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

  const spiralSteps: DebtSpiralStepItem[] = [
    {
      id: 'step-1-diworseification',
      stepNumber: 'STAGE 01',
      title: 'The "Diworseification" Trap',
      subtitle: 'Bleeding Media for Infrastructure',
      description: 'Profits from high-margin Zee TV were diverted to fund capital-heavy, slow-gestation toll roads, solar, & waste projects.',
      dangerBadge: 'Capital Misallocation',
      accentColor: '#F59E0B',
    },
    {
      id: 'step-2-alm-mismatch',
      stepNumber: 'STAGE 02',
      title: 'Asset-Liability Mismatch (ALM)',
      subtitle: 'Short-Term Debt for 15-Year Assets',
      description: 'Funded 15-to-20-year infrastructure projects using 1-to-3-year commercial paper and short-term debt securities.',
      dangerBadge: 'Liquidity Time Bomb',
      accentColor: '#EA580C',
    },
    {
      id: 'step-3-las-pledging',
      stepNumber: 'STAGE 03',
      title: 'Loan Against Shares (LAS)',
      subtitle: 'Pledging Core Company Equity',
      description: 'Promoters pledged over 60% of their valuable Zee Entertainment shares with mutual funds & NBFCs to borrow more debt.',
      dangerBadge: 'Collateral Roulette',
      accentColor: '#EF4444',
    },
    {
      id: 'step-4-margin-call-crash',
      stepNumber: 'STAGE 04',
      title: 'Margin Call & Loss of Control',
      subtitle: 'IL&FS Freeze & Forced Selling',
      description: '2018 IL&FS crisis froze credit; stock fell, lenders triggered margin calls and dumped pledged shares, collapsing ownership.',
      dangerBadge: 'Hostile Loss of Control',
      accentColor: '#DC2626',
    },
  ];

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 1220,
        margin: '0 auto',
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Title & Crisis Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
          opacity: headerSpring,
          transform: `translateY(${interpolate(headerSpring, [0, 1], [-16, 0])}px)`,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: '4px 10px',
                borderRadius: 999,
                background: '#DC2626',
                color: '#FEF2F2',
              }}
            >
              CORPORATE DEBT CRISIS FORENSICS
            </span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: isDark ? '#94A3B8' : '#64748B',
              }}
            >
              {founderName} • {totalDebt}
            </span>
          </div>
          <h2
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: isDark ? '#F8FAFC' : '#0F172A',
              margin: '6px 0 0',
              letterSpacing: '-0.02em',
            }}
          >
            The Rise & Fall of {companyName}
          </h2>
        </div>

        {/* Ownership Collapse Counter */}
        <div
          style={{
            padding: '8px 16px',
            borderRadius: 12,
            background: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEF2F2',
            border: '1.5px solid #EF4444',
            textAlign: 'right',
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 700, color: '#DC2626', textTransform: 'uppercase' }}>
            Promoter Shareholding Meltdown
          </div>
          <div style={{ fontSize: 15, fontWeight: 900, color: isDark ? '#F8FAFC' : '#0F172A' }}>
            <span style={{ color: '#16A34A' }}>{peakHolding}</span> ➔ <span style={{ color: '#DC2626' }}>{collapsedHolding}</span>
          </div>
          <div style={{ fontSize: 10, color: isDark ? '#94A3B8' : '#64748B' }}>
            Lenders seized & dumped pledged equity
          </div>
        </div>
      </div>

      {/* 4-Stage Horizontal Progression Deck */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 12,
          marginBottom: 16,
        }}
      >
        {spiralSteps.map((step, idx) => {
          const cardSpring = spring({
            frame: frame - idx * 4,
            fps,
            config: { damping: 15, stiffness: 130 },
          });

          return (
            <div
              key={step.id}
              style={{
                borderRadius: 14,
                padding: '16px 14px',
                background: isDark ? 'rgba(30, 41, 59, 0.7)' : '#FFFFFF',
                border: `1.5px solid ${step.accentColor}45`,
                boxShadow: isDark
                  ? `0 10px 25px -5px ${step.accentColor}18, 0 4px 6px -4px rgba(0, 0, 0, 0.3)`
                  : '0 10px 25px -5px rgba(0, 0, 0, 0.06)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                opacity: cardSpring,
                transform: `translateY(${interpolate(cardSpring, [0, 1], [24, 0])}px) scale(${interpolate(cardSpring, [0, 1], [0.95, 1])})`,
                position: 'relative',
              }}
            >
              <div>
                {/* Stage Tag */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      letterSpacing: '0.08em',
                      padding: '3px 8px',
                      borderRadius: 6,
                      background: `${step.accentColor}20`,
                      color: step.accentColor,
                    }}
                  >
                    {step.stepNumber}
                  </span>
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: 4,
                      background: '#FEE2E2',
                      color: '#B91C1C',
                    }}
                  >
                    {step.dangerBadge}
                  </span>
                </div>

                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 800,
                    color: isDark ? '#F8FAFC' : '#0F172A',
                    margin: '0 0 2px',
                  }}
                >
                  {step.title}
                </h3>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: step.accentColor,
                    marginBottom: 10,
                  }}
                >
                  {step.subtitle}
                </div>

                <p
                  style={{
                    margin: 0,
                    fontSize: 11,
                    color: isDark ? '#CBD5E1' : '#475569',
                    lineHeight: 1.4,
                    paddingTop: 8,
                    borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #F1F5F9',
                  }}
                >
                  {step.description}
                </p>
              </div>

              {/* Danger Warning Pill */}
              <div
                style={{
                  marginTop: 12,
                  padding: '6px 8px',
                  borderRadius: 6,
                  background: isDark ? 'rgba(15, 23, 42, 0.6)' : '#F8FAFC',
                  border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #E2E8F0',
                  textAlign: 'center',
                }}
              >
                <span style={{ fontSize: 10, fontWeight: 700, color: step.accentColor }}>
                  ⚠️ Fatal Financial Error
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3 Golden Survival Rules Banner */}
      <div
        style={{
          borderRadius: 12,
          padding: '14px 20px',
          background: isDark ? 'rgba(15, 23, 42, 0.95)' : '#0F172A',
          color: '#FFFFFF',
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr 1fr 1fr',
          gap: 16,
          alignItems: 'center',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div>
          <span
            style={{
              fontSize: 10,
              fontWeight: 800,
              color: '#38BDF8',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            CA RAHUL MALODIA SURVIVAL RULES
          </span>
          <div style={{ fontSize: 16, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
            Corporate Debt Management
          </div>
          <div style={{ fontSize: 11, color: '#94A3B8' }}>
            Lessons every entrepreneur must follow
          </div>
        </div>

        {/* Rule 1: ALM */}
        <div style={{ borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: 10 }}>
          <div style={{ fontSize: 10, color: '#FBBF24', fontWeight: 700 }}>1. ASSET-LIABILITY MATCHING</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#FDE68A' }}>Tenure Synchronization</div>
          <div style={{ fontSize: 10, color: '#94A3B8', lineHeight: 1.3 }}>
            Never fund long-term capex with short-term commercial papers
          </div>
        </div>

        {/* Rule 2: Share Pledging */}
        <div style={{ borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: 10 }}>
          <div style={{ fontSize: 10, color: '#F87171', fontWeight: 700 }}>2. ZERO SHARE PLEDGING</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#FCA5A5' }}>Never Bet Control</div>
          <div style={{ fontSize: 10, color: '#94A3B8', lineHeight: 1.3 }}>
            Pledging stock turns any market crash into a hostile takeover
          </div>
        </div>

        {/* Rule 3: Ringfence */}
        <div>
          <div style={{ fontSize: 10, color: '#4ADE80', fontWeight: 700 }}>3. RING-FENCE CASH COWS</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#86EFAC' }}>Protect Core Moats</div>
          <div style={{ fontSize: 10, color: '#94A3B8', lineHeight: 1.3 }}>
            Never allow experimental ventures to drag down profitable engines
          </div>
        </div>
      </div>
    </div>
  );
};
