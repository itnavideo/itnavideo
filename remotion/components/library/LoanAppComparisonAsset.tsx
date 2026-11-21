import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface LoanAppItem {
  id: string;
  name: string;
  category: 'Instant Personal' | 'Revolving Credit Line' | 'Student & Pocket';
  accentColor: string;
  maxLimit: string;
  tenure: string;
  incomeProof: string;
  aprRange: string;
  processingFee: string;
  disbursalSpeed: string;
  nbfcPartner: string;
  recommendedFor: string;
}

export interface LoanAppComparisonAssetProps {
  sceneFrame?: number;
  isDark?: boolean;
  scale?: number;
  startDelayFrames?: number;
  featuredApps?: LoanAppItem[];
}

/**
 * LoanAppComparisonAsset
 * Instant Loan Apps & Digital Credit Comparison Matrix (2026-27 Fintech Guide)
 * Compares top digital lending apps without salary slip requirements (Navi, KreditBee, LazyPay, mPokket).
 * Features true APR breakdown, net disbursal deductions, and RBI NBFC verification badges.
 * Learned from bekifaayati (YouTube: phiktXMUyOk).
 */
export const LoanAppComparisonAsset: React.FC<LoanAppComparisonAssetProps> = ({
  sceneFrame,
  isDark = false,
  scale = 1.0,
  startDelayFrames = 5,
  featuredApps,
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

  const defaultApps: LoanAppItem[] = [
    {
      id: 'navi',
      name: 'Navi Personal Loan',
      category: 'Instant Personal',
      accentColor: '#10B981',
      maxLimit: 'Up to ₹20,00,000',
      tenure: '3 to 60 Months',
      incomeProof: 'No Salary Slip (AA / Bank Statement)',
      aprRange: '9.9% - 28.0% APR',
      processingFee: '0% - 2.5% + GST',
      disbursalSpeed: 'Instant (10 Minutes)',
      nbfcPartner: 'Navi Finserv Limited (RBI NBFC)',
      recommendedFor: 'Best for Large Amounts & Quick Disbursal',
    },
    {
      id: 'kreditbee',
      name: 'KreditBee',
      category: 'Instant Personal',
      accentColor: '#2563EB',
      maxLimit: 'Up to ₹5,00,000',
      tenure: '3 to 24 Months',
      incomeProof: 'PAN + Aadhaar + Digital Statement',
      aprRange: '16.0% - 29.9% APR',
      processingFee: '2.5% - 4.0% + GST',
      disbursalSpeed: '15 Minutes to Bank',
      nbfcPartner: 'Krazybee Services Pvt Ltd',
      recommendedFor: 'Best for Salaried & Self-Employed Starters',
    },
    {
      id: 'lazypay',
      name: 'LazyPay Credit Line',
      category: 'Revolving Credit Line',
      accentColor: '#F59E0B',
      maxLimit: 'Up to ₹1,00,000',
      tenure: '3 to 12 Months EMI',
      incomeProof: 'Credit Score & UPI History',
      aprRange: '18.0% - 32.0% APR',
      processingFee: '₹0 (Pay only on drawn cash)',
      disbursalSpeed: 'Instant 1-Click Withdrawal',
      nbfcPartner: 'PayU Finance India Pvt Ltd',
      recommendedFor: 'Best for Emergency Cash Reserve',
    },
    {
      id: 'mpokket',
      name: 'mPokket / Pocketly',
      category: 'Student & Pocket',
      accentColor: '#8B5CF6',
      maxLimit: '₹500 - ₹50,000',
      tenure: '30 to 120 Days',
      incomeProof: 'College ID or Internship Letter',
      aprRange: '24.0% - 36.0% APR',
      processingFee: '₹50 - ₹200 Flat',
      disbursalSpeed: 'Instant Paytm / Bank Transfer',
      nbfcPartner: 'mPokket Financial Services',
      recommendedFor: 'Best for Students & Pocket Borrowing',
    },
  ];

  const apps = featuredApps || defaultApps;

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
      {/* Title & Trust Header */}
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
                background: '#047857',
                color: '#ECFDF5',
              }}
            >
              RBI REGULATED LENDING MATRIX
            </span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: isDark ? '#94A3B8' : '#64748B',
              }}
            >
              No Salary Slip Required • Fast E-KYC
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
            Best Instant Loan Apps (2026-27 Comparison)
          </h2>
        </div>

        {/* RBI Warning Badge */}
        <div
          style={{
            padding: '8px 14px',
            borderRadius: 10,
            background: isDark ? 'rgba(239, 68, 68, 0.12)' : 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ fontSize: 16 }}>⚠️</span>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#DC2626' }}>
              CRITICAL BORROWER RULE
            </div>
            <div style={{ fontSize: 10, color: isDark ? '#FCA5A5' : '#7F1D1D' }}>
              Never grant Contacts/Gallery access • Verify NBFC license on RBI portal
            </div>
          </div>
        </div>
      </div>

      {/* 4-Card Comparison Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 12,
          marginBottom: 16,
        }}
      >
        {apps.map((app, idx) => {
          const cardSpring = spring({
            frame: frame - idx * 4,
            fps,
            config: { damping: 15, stiffness: 130 },
          });

          return (
            <div
              key={app.id}
              style={{
                borderRadius: 14,
                padding: '16px 14px',
                background: isDark ? 'rgba(30, 41, 59, 0.7)' : '#FFFFFF',
                border: `1.5px solid ${app.accentColor}40`,
                boxShadow: isDark
                  ? `0 10px 25px -5px ${app.accentColor}15, 0 4px 6px -4px rgba(0, 0, 0, 0.3)`
                  : '0 10px 25px -5px rgba(0, 0, 0, 0.06), 0 4px 6px -4px rgba(0, 0, 0, 0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                opacity: cardSpring,
                transform: `translateY(${interpolate(cardSpring, [0, 1], [24, 0])}px) scale(${interpolate(cardSpring, [0, 1], [0.95, 1])})`,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Category pill */}
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  padding: '3px 8px',
                  borderRadius: 6,
                  background: `${app.accentColor}18`,
                  color: app.accentColor,
                  alignSelf: 'flex-start',
                  marginBottom: 8,
                }}
              >
                {app.category}
              </div>

              {/* App Name & Max Limit */}
              <div>
                <h3
                  style={{
                    fontSize: 17,
                    fontWeight: 800,
                    color: isDark ? '#F8FAFC' : '#0F172A',
                    margin: '0 0 2px',
                  }}
                >
                  {app.name}
                </h3>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: app.accentColor,
                    marginBottom: 12,
                  }}
                >
                  {app.maxLimit}
                </div>
              </div>

              {/* Feature Metrics Stack */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  fontSize: 11,
                  padding: '10px 0',
                  borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #F1F5F9',
                  borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #F1F5F9',
                  marginBottom: 10,
                }}
              >
                <div>
                  <span style={{ color: isDark ? '#94A3B8' : '#64748B', display: 'block', fontSize: 10 }}>
                    Interest (APR Range)
                  </span>
                  <strong style={{ color: isDark ? '#E2E8F0' : '#1E293B', fontSize: 12 }}>
                    {app.aprRange}
                  </strong>
                </div>

                <div>
                  <span style={{ color: isDark ? '#94A3B8' : '#64748B', display: 'block', fontSize: 10 }}>
                    Processing Fee
                  </span>
                  <span style={{ color: isDark ? '#CBD5E1' : '#334155', fontWeight: 600 }}>
                    {app.processingFee}
                  </span>
                </div>

                <div>
                  <span style={{ color: isDark ? '#94A3B8' : '#64748B', display: 'block', fontSize: 10 }}>
                    Tenure Window
                  </span>
                  <span style={{ color: isDark ? '#CBD5E1' : '#334155', fontWeight: 600 }}>
                    {app.tenure}
                  </span>
                </div>

                <div>
                  <span style={{ color: isDark ? '#94A3B8' : '#64748B', display: 'block', fontSize: 10 }}>
                    Eligibility Proof
                  </span>
                  <span style={{ color: isDark ? '#CBD5E1' : '#334155', fontWeight: 600 }}>
                    {app.incomeProof}
                  </span>
                </div>

                <div>
                  <span style={{ color: isDark ? '#94A3B8' : '#64748B', display: 'block', fontSize: 10 }}>
                    Disbursal Speed
                  </span>
                  <span style={{ color: '#059669', fontWeight: 700 }}>
                    ⚡ {app.disbursalSpeed}
                  </span>
                </div>
              </div>

              {/* NBFC & Best For Badge */}
              <div>
                <div
                  style={{
                    fontSize: 9,
                    color: isDark ? '#64748B' : '#94A3B8',
                    marginBottom: 8,
                    lineHeight: 1.3,
                  }}
                >
                  Reg. Lender: <strong>{app.nbfcPartner}</strong>
                </div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '6px 8px',
                    borderRadius: 6,
                    background: isDark ? 'rgba(15, 23, 42, 0.6)' : '#F8FAFC',
                    color: isDark ? '#E2E8F0' : '#1E293B',
                    textAlign: 'center',
                    border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #E2E8F0',
                  }}
                >
                  🎯 {app.recommendedFor}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ₹50,000 Loan True Cost Audit Banner */}
      <div
        style={{
          borderRadius: 12,
          padding: '12px 18px',
          background: isDark ? 'rgba(15, 23, 42, 0.9)' : '#F1F5F9',
          border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #CBD5E1',
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr 1fr 1fr',
          gap: 16,
          alignItems: 'center',
        }}
      >
        <div>
          <span
            style={{
              fontSize: 10,
              fontWeight: 800,
              color: '#EA580C',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            BEKIFAAYATI HIDDEN COST AUDIT
          </span>
          <div
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: isDark ? '#F8FAFC' : '#0F172A',
            }}
          >
            The ₹50,000 Loan Truth (12 Months)
          </div>
          <div style={{ fontSize: 11, color: isDark ? '#94A3B8' : '#64748B' }}>
            Flat 1.5%/mo vs Reducing APR trap
          </div>
        </div>

        <div style={{ textAlign: 'center', borderRight: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0' }}>
          <div style={{ fontSize: 10, color: isDark ? '#94A3B8' : '#64748B' }}>In-Bank Disbursal</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#DC2626' }}>₹47,050</div>
          <div style={{ fontSize: 10, color: isDark ? '#64748B' : '#94A3B8' }}>-₹2,500 Fee -₹450 GST</div>
        </div>

        <div style={{ textAlign: 'center', borderRight: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0' }}>
          <div style={{ fontSize: 10, color: isDark ? '#94A3B8' : '#64748B' }}>Total Repaid (12 Mo)</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: isDark ? '#F8FAFC' : '#0F172A' }}>₹56,200</div>
          <div style={{ fontSize: 10, color: isDark ? '#64748B' : '#94A3B8' }}>₹4,683 / month EMI</div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: isDark ? '#94A3B8' : '#64748B' }}>Real Effective APR</div>
          <div style={{ fontSize: 17, fontWeight: 900, color: '#D97706' }}>29.4% APR</div>
          <div style={{ fontSize: 10, color: '#16A34A', fontWeight: 600 }}>Always Calculate Net Cash!</div>
        </div>
      </div>
    </div>
  );
};
