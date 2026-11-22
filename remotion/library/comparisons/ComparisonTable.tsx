import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface ComparisonFeature {
  featureName: string;
  optionA: boolean | string;
  optionB: boolean | string;
  optionC?: boolean | string;
}

export interface ComparisonTableProps {
  title?: string;
  subtitle?: string;
  columnAHeader?: string;
  columnBHeader?: string;
  columnCHeader?: string;
  highlightColumn?: 'A' | 'B' | 'C';
  features?: ComparisonFeature[];
  width?: number | string;
  theme?: 'dark' | 'light';
  delayFrames?: number;
  style?: React.CSSProperties;
}

const DEFAULT_COMPARISON_FEATURES: ComparisonFeature[] = [
  { featureName: 'Render Speed', optionA: '6-8 Hours', optionB: '< 60 Seconds', optionC: '2-3 Hours' },
  { featureName: 'Auto Word Captions', optionA: false, optionB: true, optionC: true },
  { featureName: 'Cloud Rendering (0% CPU)', optionA: false, optionB: true, optionC: false },
  { featureName: 'Kinetic Karaoke Glow', optionA: 'Manual', optionB: '100% Automated', optionC: 'Limited' },
  { featureName: 'Pricing / Minute', optionA: '$50+/hr Editor', optionB: '1 Credit / Min', optionC: '$29/mo plan' },
];

export const ComparisonTable: React.FC<ComparisonTableProps> = ({
  title = 'Feature & Workflow Matrix',
  subtitle = 'Direct side-by-side capability evaluation',
  columnAHeader = 'Desktop NLEs',
  columnBHeader = 'Itnavideo AI',
  columnCHeader = 'Generic Apps',
  highlightColumn = 'B',
  features = DEFAULT_COMPARISON_FEATURES,
  width = '100%',
  theme = 'dark',
  delayFrames = 5,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isDark = theme === 'dark';
  const bgColor = isDark ? '#111827' : '#FFFFFF';
  const cardBg = isDark ? '#1E293B' : '#F8FAFC';
  const highlightBg = isDark ? 'rgba(0, 102, 255, 0.12)' : 'rgba(0, 102, 255, 0.08)';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';
  const borderColor = isDark ? '#334155' : '#E2E8F0';

  const items = features && features.length > 0 ? features : DEFAULT_COMPARISON_FEATURES;

  const renderValue = (val: boolean | string | undefined, isWinner: boolean) => {
    if (typeof val === 'boolean') {
      return val ? (
        <span style={{ color: '#10B981', fontWeight: 900, fontSize: '18px' }}>✓</span>
      ) : (
        <span style={{ color: '#EF4444', fontWeight: 900, fontSize: '18px' }}>✕</span>
      );
    }
    return (
      <span style={{ fontWeight: isWinner ? 800 : 500, color: isWinner ? '#0066FF' : textColor, fontSize: '13px' }}>
        {val}
      </span>
    );
  };

  return (
    <div
      style={{
        width,
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: '24px',
        padding: '28px 32px',
        boxShadow: isDark ? '0 12px 36px rgba(0,0,0,0.45)' : '0 8px 30px rgba(0,0,0,0.08)',
        boxSizing: 'border-box',
        fontFamily: 'Inter, system-ui, sans-serif',
        ...style,
      }}
    >
      {(title || subtitle) && (
        <div style={{ marginBottom: '20px' }}>
          {title && <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: textColor }}>{title}</h3>}
          {subtitle && <p style={{ margin: '4px 0 0 0', fontSize: '13px', fontWeight: 500, color: textMuted }}>{subtitle}</p>}
        </div>
      )}

      {/* Table Container */}
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${borderColor}` }}>
              <th style={{ padding: '12px 14px', fontSize: '12px', fontWeight: 700, color: textMuted, textTransform: 'uppercase' }}>
                Capability
              </th>
              <th style={{ padding: '12px 14px', fontSize: '13px', fontWeight: 700, color: textColor, textAlign: 'center' }}>
                {columnAHeader}
              </th>
              <th
                style={{
                  padding: '12px 14px',
                  fontSize: '14px',
                  fontWeight: 900,
                  color: '#0066FF',
                  textAlign: 'center',
                  backgroundColor: highlightBg,
                  borderRadius: '12px 12px 0 0',
                }}
              >
                ★ {columnBHeader}
              </th>
              {columnCHeader && (
                <th style={{ padding: '12px 14px', fontSize: '13px', fontWeight: 700, color: textColor, textAlign: 'center' }}>
                  {columnCHeader}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {items.map((row, idx) => {
              const rowSpring = spring({
                frame: Math.max(0, frame - delayFrames - idx * 4),
                fps,
                config: { damping: 14, stiffness: 95 },
              });

              return (
                <tr
                  key={idx}
                  style={{
                    borderBottom: `1px solid ${borderColor}`,
                    opacity: rowSpring,
                    transform: `translateY(${(1 - rowSpring) * 10}px)`,
                  }}
                >
                  <td style={{ padding: '14px', fontSize: '13px', fontWeight: 700, color: textColor }}>
                    {row.featureName}
                  </td>
                  <td style={{ padding: '14px', textAlign: 'center' }}>
                    {renderValue(row.optionA, highlightColumn === 'A')}
                  </td>
                  <td style={{ padding: '14px', textAlign: 'center', backgroundColor: highlightBg }}>
                    {renderValue(row.optionB, highlightColumn === 'B')}
                  </td>
                  {columnCHeader && (
                    <td style={{ padding: '14px', textAlign: 'center' }}>
                      {renderValue(row.optionC, highlightColumn === 'C')}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
