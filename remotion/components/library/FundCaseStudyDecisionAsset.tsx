import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface FundPillarItem {
  id: string;
  title: string;
  description: string;
  metric: string;
  status: 'positive' | 'warning' | 'neutral';
  accentColor: string;
}

export interface FundCaseStudyDecisionAssetProps {
  sceneFrame?: number;
  isDark?: boolean;
  scale?: number;
  startDelayFrames?: number;
  fundName?: string;
  category?: string;
  aumSize?: string;
  inflowPeak?: string;
  inflowDip?: string;
}

/**
 * FundCaseStudyDecisionAsset
 * Mutual Fund Case Study & SIP Decision Framework (CA Rahul Malodia Forensics)
 * Analyzes Parag Parikh Flexi Cap Fund (PPFCF) — Winner era vs Recent headwinds,
 * Retail sentiment inflow trap, and the 3-step "Continue vs Stop SIP" decision matrix.
 * Learned from CA Rahul Malodia (YouTube: DlEulH-2zcs).
 */
export const FundCaseStudyDecisionAsset: React.FC<FundCaseStudyDecisionAssetProps> = ({
  sceneFrame,
  isDark = false,
  scale = 1.0,
  startDelayFrames = 5,
  fundName = 'Parag Parikh Flexi Cap Fund',
  category = 'Flexi Cap Equity • Direct Growth',
  aumSize = '₹75,000+ Crore AUM',
  inflowPeak = '₹4,000 Cr / mo (Peak FOMO)',
  inflowDip = '₹1,100 Cr / mo (Panic Drop)',
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

  const outperformancePillars: FundPillarItem[] = [
    {
      id: 'us-tech-alpha',
      title: 'US Tech Equity Alpha',
      description: 'Alphabet, Meta, Microsoft & Amazon gave massive international currency + tech alpha.',
      metric: '~30% Peak US Tech',
      status: 'positive',
      accentColor: '#10B981',
    },
    {
      id: 'value-investing-moat',
      title: 'Strict Value Discipline',
      description: 'Buying high-cashflow, low-debt monopolies rather than chasing market momentum.',
      metric: 'High ROCE / Moat',
      status: 'positive',
      accentColor: '#059669',
    },
    {
      id: 'downside-protection',
      title: 'Superior Crash Defense',
      description: 'Beta < 0.75 and holding 10-15% cash/arbitrage protected investor wealth during corrections.',
      metric: 'Low Beta (0.74)',
      status: 'positive',
      accentColor: '#2563EB',
    },
  ];

  const headwindFactors: FundPillarItem[] = [
    {
      id: 'rbi-overseas-cap',
      title: 'RBI Overseas $7B Limit',
      description: 'Industry-wide overseas cap blocked fresh inflows from buying international stocks (diluted to ~12%).',
      metric: 'US Fresh Buy Halted',
      status: 'warning',
      accentColor: '#EA580C',
    },
    {
      id: 'aum-elephant-drag',
      title: 'Massive AUM Surge Drag',
      description: 'Fund size exploded past ₹75k Cr; massive elephant fund cannot take nimble mid/small cap bets.',
      metric: '₹75,000+ Cr Drag',
      status: 'warning',
      accentColor: '#D97706',
    },
    {
      id: 'value-sector-lag',
      title: 'Private Bank Consolidation',
      description: 'Heavy allocation to HDFC Bank & IT lagged while PSU, Defense, and Smallcap momentum soared.',
      metric: 'Value Cycle Lag',
      status: 'warning',
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
      {/* Top Header Strip */}
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
                background: '#EA580C',
                color: '#FFF7ED',
              }}
            >
              MUTUAL FUND FORENSIC CASE STUDY
            </span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: isDark ? '#94A3B8' : '#64748B',
              }}
            >
              {category} • {aumSize}
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
            {fundName} — Winner या Loser?
          </h2>
        </div>

        {/* Retail Sentiment Trap Badge */}
        <div
          style={{
            padding: '10px 16px',
            borderRadius: 12,
            background: isDark ? 'rgba(30, 41, 59, 0.8)' : '#F1F5F9',
            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #CBD5E1',
            textAlign: 'right',
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 700, color: '#D97706', textTransform: 'uppercase' }}>
            Retail Sentiment Trap
          </div>
          <div style={{ fontSize: 13, fontWeight: 800, color: isDark ? '#F8FAFC' : '#0F172A' }}>
            Inflows: <span style={{ color: '#16A34A' }}>{inflowPeak}</span> ➔ <span style={{ color: '#DC2626' }}>{inflowDip}</span>
          </div>
          <div style={{ fontSize: 10, color: isDark ? '#94A3B8' : '#64748B' }}>
            Retail exits at the bottom of consolidation
          </div>
        </div>
      </div>

      {/* Dual Comparative Engines Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
          marginBottom: 16,
        }}
      >
        {/* Left: Why It Was A WINNER (Alpha Engine) */}
        <div
          style={{
            borderRadius: 14,
            padding: '18px 16px',
            background: isDark ? 'rgba(6, 78, 59, 0.15)' : '#ECFDF5',
            border: '1.5px solid #10B981',
            boxShadow: '0 8px 24px -6px rgba(16, 185, 129, 0.15)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                padding: '4px 8px',
                borderRadius: 6,
                background: '#10B981',
                color: '#FFFFFF',
              }}
            >
              WINNER ERA: 3 ALPHA DRIVERS
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#047857' }}>2013 – 2024 Bull Run</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {outperformancePillars.map((p, idx) => {
              const itemSpring = spring({
                frame: frame - idx * 4,
                fps,
                config: { damping: 15, stiffness: 130 },
              });
              return (
                <div
                  key={p.id}
                  style={{
                    borderRadius: 10,
                    padding: '12px 14px',
                    background: isDark ? 'rgba(15, 23, 42, 0.7)' : '#FFFFFF',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    opacity: itemSpring,
                    transform: `translateX(${interpolate(itemSpring, [0, 1], [-16, 0])}px)`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <strong style={{ fontSize: 14, color: isDark ? '#F8FAFC' : '#0F172A' }}>
                      {p.title}
                    </strong>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: 999,
                        background: '#DCFCE7',
                        color: '#15803D',
                      }}
                    >
                      {p.metric}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: 11.5, color: isDark ? '#CBD5E1' : '#475569', lineHeight: 1.4 }}>
                    {p.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Why It Stagnated / Headwinds (The Lag Factor) */}
        <div
          style={{
            borderRadius: 14,
            padding: '18px 16px',
            background: isDark ? 'rgba(127, 29, 29, 0.15)' : '#FEF2F2',
            border: '1.5px solid #EF4444',
            boxShadow: '0 8px 24px -6px rgba(239, 68, 68, 0.15)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                padding: '4px 8px',
                borderRadius: 6,
                background: '#EF4444',
                color: '#FFFFFF',
              }}
            >
              RECENT FRICTION: 3 HEADWINDS
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#B91C1C' }}>Cyclical Consolidation</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {headwindFactors.map((h, idx) => {
              const itemSpring = spring({
                frame: frame - idx * 4 - 2,
                fps,
                config: { damping: 15, stiffness: 130 },
              });
              return (
                <div
                  key={h.id}
                  style={{
                    borderRadius: 10,
                    padding: '12px 14px',
                    background: isDark ? 'rgba(15, 23, 42, 0.7)' : '#FFFFFF',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    opacity: itemSpring,
                    transform: `translateX(${interpolate(itemSpring, [0, 1], [16, 0])}px)`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <strong style={{ fontSize: 14, color: isDark ? '#F8FAFC' : '#0F172A' }}>
                      {h.title}
                    </strong>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: 999,
                        background: '#FEE2E2',
                        color: '#B91C1C',
                      }}
                    >
                      {h.metric}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: 11.5, color: isDark ? '#CBD5E1' : '#475569', lineHeight: 1.4 }}>
                    {h.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Verdict Engine: SIP Rokhein Ya Chalayein? */}
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
            CA RAHUL MALODIA DECISION ENGINE
          </span>
          <div style={{ fontSize: 16, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
            SIP Rokhein Ya Chalayein?
          </div>
          <div style={{ fontSize: 11, color: '#94A3B8' }}>
            Match your financial temperament
          </div>
        </div>

        {/* 1. Short Horizon */}
        <div style={{ borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: 10 }}>
          <div style={{ fontSize: 10, color: '#F87171', fontWeight: 700 }}>HORIZON &lt; 3 YEARS</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#FCA5A5' }}>❌ Stop / Avoid</div>
          <div style={{ fontSize: 10, color: '#94A3B8', lineHeight: 1.3 }}>
            Value cycle takes 3-5 yrs; short horizon creates exit pain
          </div>
        </div>

        {/* 2. Long Horizon */}
        <div style={{ borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: 10 }}>
          <div style={{ fontSize: 10, color: '#4ADE80', fontWeight: 700 }}>HORIZON &gt; 5-7 YEARS</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#86EFAC' }}>✅ Continue SIP</div>
          <div style={{ fontSize: 10, color: '#94A3B8', lineHeight: 1.3 }}>
            Consolidation buys cheap units; protects wealth in crashes
          </div>
        </div>

        {/* 3. Portfolio Allocation Role */}
        <div>
          <div style={{ fontSize: 10, color: '#FBBF24', fontWeight: 700 }}>PORTFOLIO ALLOCATION</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#FDE68A' }}>⚓ Anchor Fund (35%)</div>
          <div style={{ fontSize: 10, color: '#94A3B8', lineHeight: 1.3 }}>
            Core conservative anchor; pair with high-growth midcaps
          </div>
        </div>
      </div>
    </div>
  );
};
