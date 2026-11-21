import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface IpoMetricItem {
  id: string;
  label: string;
  value: string;
  subtext: string;
  accentColor: string;
}

export interface IpoPointItem {
  id: string;
  title: string;
  detail: string;
  tag: string;
}

export interface IpoValuationReviewAssetProps {
  sceneFrame?: number;
  isDark?: boolean;
  scale?: number;
  startDelayFrames?: number;
  companyName?: string;
  targetValuation?: string;
  issueSize?: string;
  impliedPe?: string;
}

/**
 * IpoValuationReviewAsset
 * Mega IPO Valuation & Business Breakdown Scorecard (CA Rahul Malodia Forensics)
 * Analyzes Reliance Jio's ₹10 Lakh Crore IPO, ₹27,000 Cr Fresh Issue, 53 Crore User Base,
 * 60% Data Traffic Share, Duopoly Pricing Power vs Capex Risks, and Listing Gains vs Long-Term Verdict.
 * Learned from CA Rahul Malodia (YouTube: sjPHPR4mRt8).
 */
export const IpoValuationReviewAsset: React.FC<IpoValuationReviewAssetProps> = ({
  sceneFrame,
  isDark = false,
  scale = 1.0,
  startDelayFrames = 5,
  companyName = 'Reliance Jio Infocomm',
  targetValuation = '₹10 LAKH CRORE ($120B)',
  issueSize = '₹27,000 Cr Fresh Issue (Debt Reduction)',
  impliedPe = '~34x Implied P/E',
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

  const coreMetrics: IpoMetricItem[] = [
    {
      id: 'subscribers',
      label: 'Active Mobile Users',
      value: '53 Crore+',
      subtext: '#1 Telecom Operator in India',
      accentColor: '#10B981',
    },
    {
      id: 'data-traffic',
      label: 'Wireless Data Traffic',
      value: '60% Share',
      subtext: 'Dominates India’s internet bandwidth',
      accentColor: '#2563EB',
    },
    {
      id: 'ebitda-margin',
      label: 'Operating Profit Margin',
      value: '50%+ EBITDA',
      subtext: 'High recurring cashflow generation',
      accentColor: '#D97706',
    },
    {
      id: 'valuation-multiple',
      label: 'Target Valuation Multiple',
      value: impliedPe,
      subtext: 'Premium valuation vs historical peers',
      accentColor: '#8B5CF6',
    },
  ];

  const moats: IpoPointItem[] = [
    {
      id: 'duopoly-arpu',
      title: 'Duopoly Pricing Power',
      detail: 'Market consolidated to Jio + Airtel; tariff hikes (₹180 → ₹220 → ₹300) flow straight to EBITDA.',
      tag: 'PRICING POWER',
    },
    {
      id: 'beyond-telecom',
      title: 'Beyond Telecom Flywheel',
      detail: 'JioFiber, AirFiber, Enterprise 5G, JioCinema, AI Cloud, and Satellite Broadband monetization.',
      tag: 'DIGITAL ECOSYSTEM',
    },
    {
      id: 'debt-clearance',
      title: '₹27,000 Cr Fresh Issue Deleveraging',
      detail: '100% fresh issue used primarily to slash high-cost spectrum and debt liabilities.',
      tag: 'BALANCE SHEET STRENGTH',
    },
  ];

  const risks: IpoPointItem[] = [
    {
      id: 'capex-intensity',
      title: 'High Capital Intensity (Capex)',
      detail: 'Continuous 5G/6G spectrum auctions, telecom towers, and fiber rollouts demand massive ongoing reinvestment.',
      tag: 'HIGH REINVESTMENT',
    },
    {
      id: 'rich-valuation',
      title: 'Rich Valuation Multiple',
      detail: 'At ₹10 Lakh Cr (~34x P/E), high expectations are already priced in, leaving limited margin of safety.',
      tag: 'VALUATION RISK',
    },
    {
      id: 'mega-supply-drag',
      title: 'Massive Issue Size Supply Drag',
      detail: 'Absorbing ₹27,000 Cr in equity supply dampens explosive 50%+ listing day pops (limited GMP pop).',
      tag: 'SUPPLY OVERHANG',
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
      {/* Title & Valuation Header */}
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
                background: '#2563EB',
                color: '#EFF6FF',
              }}
            >
              MEGA IPO FORENSIC REVIEW
            </span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: isDark ? '#94A3B8' : '#64748B',
              }}
            >
              {issueSize}
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
            {companyName} — IPO Review
          </h2>
        </div>

        {/* Valuation Target Badge */}
        <div
          style={{
            padding: '8px 16px',
            borderRadius: 12,
            background: isDark ? 'rgba(37, 99, 235, 0.15)' : '#EFF6FF',
            border: '1.5px solid #2563EB',
            textAlign: 'right',
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 700, color: '#2563EB', textTransform: 'uppercase' }}>
            Target IPO Valuation
          </div>
          <div style={{ fontSize: 18, fontWeight: 900, color: isDark ? '#F8FAFC' : '#0F172A' }}>
            {targetValuation}
          </div>
        </div>
      </div>

      {/* 4 Key Metrics Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 12,
          marginBottom: 16,
        }}
      >
        {coreMetrics.map((m, idx) => {
          const itemSpring = spring({
            frame: frame - idx * 3,
            fps,
            config: { damping: 15, stiffness: 130 },
          });
          return (
            <div
              key={m.id}
              style={{
                borderRadius: 12,
                padding: '14px 16px',
                background: isDark ? 'rgba(30, 41, 59, 0.7)' : '#FFFFFF',
                border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0',
                boxShadow: isDark
                  ? `0 6px 18px -4px ${m.accentColor}15`
                  : '0 6px 18px -4px rgba(0, 0, 0, 0.04)',
                opacity: itemSpring,
                transform: `translateY(${interpolate(itemSpring, [0, 1], [16, 0])}px)`,
              }}
            >
              <div style={{ fontSize: 11, color: isDark ? '#94A3B8' : '#64748B', marginBottom: 4 }}>
                {m.label}
              </div>
              <div style={{ fontSize: 20, fontWeight: 900, color: m.accentColor, marginBottom: 2 }}>
                {m.value}
              </div>
              <div style={{ fontSize: 10, color: isDark ? '#64748B' : '#94A3B8' }}>
                {m.subtext}
              </div>
            </div>
          );
        })}
      </div>

      {/* Dual Column: 3 Core Moats vs 3 Major Risks */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
          marginBottom: 16,
        }}
      >
        {/* Left: Core Moats */}
        <div
          style={{
            borderRadius: 14,
            padding: '16px',
            background: isDark ? 'rgba(6, 78, 59, 0.15)' : '#ECFDF5',
            border: '1.5px solid #10B981',
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
              3 STRUCTURAL MOATS
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#047857' }}>High Pricing Power</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {moats.map((point, idx) => {
              const pSpring = spring({
                frame: frame - idx * 4 - 4,
                fps,
                config: { damping: 15, stiffness: 130 },
              });
              return (
                <div
                  key={point.id}
                  style={{
                    borderRadius: 10,
                    padding: '10px 12px',
                    background: isDark ? 'rgba(15, 23, 42, 0.7)' : '#FFFFFF',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    opacity: pSpring,
                    transform: `translateX(${interpolate(pSpring, [0, 1], [-12, 0])}px)`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                    <strong style={{ fontSize: 13, color: isDark ? '#F8FAFC' : '#0F172A' }}>
                      {point.title}
                    </strong>
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 800,
                        padding: '2px 6px',
                        borderRadius: 4,
                        background: '#DCFCE7',
                        color: '#15803D',
                      }}
                    >
                      {point.tag}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: 11, color: isDark ? '#CBD5E1' : '#475569', lineHeight: 1.35 }}>
                    {point.detail}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Major Risks */}
        <div
          style={{
            borderRadius: 14,
            padding: '16px',
            background: isDark ? 'rgba(127, 29, 29, 0.15)' : '#FEF2F2',
            border: '1.5px solid #EF4444',
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
              3 CRITICAL RISKS
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#B91C1C' }}>Capital & Multiple</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {risks.map((point, idx) => {
              const pSpring = spring({
                frame: frame - idx * 4 - 6,
                fps,
                config: { damping: 15, stiffness: 130 },
              });
              return (
                <div
                  key={point.id}
                  style={{
                    borderRadius: 10,
                    padding: '10px 12px',
                    background: isDark ? 'rgba(15, 23, 42, 0.7)' : '#FFFFFF',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    opacity: pSpring,
                    transform: `translateX(${interpolate(pSpring, [0, 1], [12, 0])}px)`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                    <strong style={{ fontSize: 13, color: isDark ? '#F8FAFC' : '#0F172A' }}>
                      {point.title}
                    </strong>
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
                      {point.tag}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: 11, color: isDark ? '#CBD5E1' : '#475569', lineHeight: 1.35 }}>
                    {point.detail}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom CA Rahul Malodia Verdict Engine */}
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
            CA RAHUL MALODIA VERDICT ENGINE
          </span>
          <div style={{ fontSize: 16, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
            Listing Gains vs Long-Term?
          </div>
          <div style={{ fontSize: 11, color: '#94A3B8' }}>
            Realistic investor expectations
          </div>
        </div>

        {/* 1. Listing Gains */}
        <div style={{ borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: 10 }}>
          <div style={{ fontSize: 10, color: '#FBBF24', fontWeight: 700 }}>LISTING GAINS (SHORT TERM)</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#FDE68A' }}>⚠️ Moderate (10%–15%)</div>
          <div style={{ fontSize: 10, color: '#94A3B8', lineHeight: 1.3 }}>
            ₹27k Cr mega supply prevents astronomical GMP pops
          </div>
        </div>

        {/* 2. Long Term */}
        <div style={{ borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: 10 }}>
          <div style={{ fontSize: 10, color: '#4ADE80', fontWeight: 700 }}>LONG TERM (3–5+ YEARS)</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#86EFAC' }}>🚀 Compound Wealth</div>
          <div style={{ fontSize: 10, color: '#94A3B8', lineHeight: 1.3 }}>
            Duopoly cash machine; tariff hikes expand free cashflow
          </div>
        </div>

        {/* 3. Retail Rule */}
        <div>
          <div style={{ fontSize: 10, color: '#38BDF8', fontWeight: 700 }}>RETAIL INVESTOR RULE</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#BAE6FD' }}>🎯 Digital Utility Moat</div>
          <div style={{ fontSize: 10, color: '#94A3B8', lineHeight: 1.3 }}>
            Treat like an essential national infrastructure asset
          </div>
        </div>
      </div>
    </div>
  );
};
