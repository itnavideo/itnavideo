import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface ComparisonRow {
  parameter: string;
  hindiParameter: string;
  realEstateValue: string;
  realEstateNote: string;
  equityValue: string;
  equityNote: string;
  winner: 'equity' | 'real-estate' | 'neutral';
}

export interface RealEstateVsEquityMatrixAssetProps {
  sceneFrame?: number;
  isDark?: boolean;
  scale?: number;
  startDelayFrames?: number;
}

/**
 * RealEstateVsEquityMatrixAsset
 * Real Estate vs Mutual Funds Ground Reality Matrix (जमीन खरीदकर अमीर बनने का सपना)
 * Compares Land / Physical Property vs Equity Mutual Funds across Liquidity, Ticket Size, Risk, and CAGR.
 * Learned from XY- Axis Education (YouTube: 4g59c16bNjE).
 */
export const RealEstateVsEquityMatrixAsset: React.FC<RealEstateVsEquityMatrixAssetProps> = ({
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

  const rows: ComparisonRow[] = [
    {
      parameter: 'Entry Ticket Size',
      hindiParameter: 'शुरुआती निवेश',
      realEstateValue: '₹10 Lakhs – ₹1 Crore+',
      realEstateNote: 'High capital barrier; forces loans/EMIs',
      equityValue: 'Start with ₹500 / month',
      equityNote: 'Accessible to all; scalable SIP',
      winner: 'equity',
    },
    {
      parameter: 'Emergency Liquidity',
      hindiParameter: 'तुरंत पैसा मिलना',
      realEstateValue: '6 to 18 Months',
      realEstateNote: 'Illiquid; distress sales lead to heavy losses',
      equityValue: 'T+2 Days (Instant)',
      equityNote: 'Funds credited directly to bank account',
      winner: 'equity',
    },
    {
      parameter: 'Disputes & Kabza Risk',
      hindiParameter: 'कानूनी व कब्जा जोखिम',
      realEstateValue: 'High Litigation Risk',
      realEstateNote: 'Title frauds, registry disputes, boundary encroachment',
      equityValue: 'Zero Kabza Risk',
      equityNote: '100% digital, SEBI regulated & transparent',
      winner: 'equity',
    },
    {
      parameter: 'Long-Term Compounding',
      hindiParameter: 'ऐतिहासिक रिटर्न (CAGR)',
      realEstateValue: '7% – 10% CAGR Avg',
      realEstateNote: 'Rental yield only 2%–3%; heavy stamp duty & maintenance',
      equityValue: '12% – 15% CAGR Avg',
      equityNote: 'Historical index compounding with zero maintenance cost',
      winner: 'equity',
    },
    {
      parameter: 'Fractional Exit',
      hindiParameter: 'टुकड़ों में बेचना',
      realEstateValue: 'Impossible (All or None)',
      realEstateNote: 'Cannot sell 1 square foot when you need ₹50,000',
      equityValue: '100% Flexible Units',
      equityNote: 'Redeem exact required amount anytime',
      winner: 'equity',
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
            Real Estate vs Mutual Funds Reality Matrix
          </h3>
          <span style={{ fontSize: 13, color: isDark ? '#A1A1AA' : '#71717A' }}>
            जमीन खरीदकर अमीर बनने का सपना? Liquidity, Legal Traps &amp; Real Returns
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
          Never put 100% savings in illiquid land!
        </div>
      </div>

      {/* Dual Column Headers */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1.4fr 1.4fr',
          gap: 12,
          marginBottom: 8,
          padding: '0 4px',
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 700, color: isDark ? '#71717A' : '#94A3B8', textTransform: 'uppercase' }}>
          Decision Metric (मापदंड)
        </div>
        <div
          style={{
            fontSize: 11.5,
            fontWeight: 700,
            color: '#D97706',
            backgroundColor: isDark ? 'rgba(217, 119, 6, 0.15)' : '#FFFBEB',
            padding: '4px 10px',
            borderRadius: 6,
            border: '1px solid rgba(217, 119, 6, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>🏠 Land &amp; Property (जमीन)</span>
          <span style={{ fontSize: 10, fontWeight: 600 }}>Illiquid Asset</span>
        </div>
        <div
          style={{
            fontSize: 11.5,
            fontWeight: 700,
            color: '#059669',
            backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#F0FDF4',
            padding: '4px 10px',
            borderRadius: 6,
            border: '1px solid rgba(16, 185, 129, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>📈 Equity Mutual Funds (SIP)</span>
          <span style={{ fontSize: 10, fontWeight: 600 }}>Liquid Compounding</span>
        </div>
      </div>

      {/* Comparison Rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
        {rows.map((row, idx) => {
          const rowSpring = spring({
            frame: Math.max(0, frame - idx * 4),
            fps,
            config: { damping: 14, stiffness: 130 },
          });

          return (
            <div
              key={row.parameter}
              style={{
                opacity: rowSpring,
                transform: `translateY(${interpolate(rowSpring, [0, 1], [14, 0])}px)`,
                display: 'grid',
                gridTemplateColumns: '1.2fr 1.4fr 1.4fr',
                gap: 12,
                borderRadius: 12,
                backgroundColor: isDark ? 'rgba(24, 24, 27, 0.85)' : '#FFFFFF',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
                boxShadow: isDark
                  ? '0 4px 14px rgba(0, 0, 0, 0.25)'
                  : '0 4px 14px rgba(0, 0, 0, 0.03)',
                padding: '10px 12px',
                alignItems: 'center',
              }}
            >
              {/* Metric Title */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: isDark ? '#FAFAFA' : '#1E293B' }}>
                  {row.parameter}
                </div>
                <div style={{ fontSize: 10, color: isDark ? '#A1A1AA' : '#64748B' }}>
                  {row.hindiParameter}
                </div>
              </div>

              {/* Real Estate Side */}
              <div
                style={{
                  padding: '6px 10px',
                  borderRadius: 8,
                  backgroundColor: isDark ? 'rgba(217, 119, 6, 0.08)' : '#FFFBEB',
                  border: '1px solid rgba(217, 119, 6, 0.2)',
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 700, color: '#D97706', marginBottom: 2 }}>
                  {row.realEstateValue}
                </div>
                <div style={{ fontSize: 10, color: isDark ? '#A1A1AA' : '#64748B', lineHeight: 1.3 }}>
                  {row.realEstateNote}
                </div>
              </div>

              {/* Mutual Fund Side */}
              <div
                style={{
                  padding: '6px 10px',
                  borderRadius: 8,
                  backgroundColor: isDark ? 'rgba(16, 185, 129, 0.08)' : '#F0FDF4',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 700, color: '#059669', marginBottom: 2 }}>
                  ✓ {row.equityValue}
                </div>
                <div style={{ fontSize: 10, color: isDark ? '#A1A1AA' : '#64748B', lineHeight: 1.3 }}>
                  {row.equityNote}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Smart Asset Allocation Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 14px',
          borderRadius: 10,
          backgroundColor: isDark ? 'rgba(2, 132, 199, 0.12)' : '#F0F9FF',
          border: '1px solid rgba(2, 132, 199, 0.25)',
        }}
      >
        <span style={{ fontSize: 11.5, fontWeight: 700, color: '#0284C7' }}>
          ★ Smart Portfolio Allocation:
        </span>
        <span style={{ fontSize: 11, color: isDark ? '#E4E4E7' : '#475569' }}>
          Never lock 100% of wealth into illiquid property. Build liquid equity compounding alongside physical safety.
        </span>
      </div>
    </div>
  );
};
