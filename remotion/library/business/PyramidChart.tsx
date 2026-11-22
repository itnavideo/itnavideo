import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface PyramidTier {
  level: number;
  label: string;
  description?: string;
  color?: string;
}

export interface PyramidChartProps {
  title?: string;
  subtitle?: string;
  tiers?: PyramidTier[];
  width?: number | string;
  theme?: 'dark' | 'light';
  delayFrames?: number;
  style?: React.CSSProperties;
}

const DEFAULT_PYRAMID_TIERS: PyramidTier[] = [
  { level: 1, label: 'Apex: Category Monopoly', description: 'Self-sustaining viral loop & enterprise dominance', color: '#F59E0B' },
  { level: 2, label: 'Level 2: High Monetization', description: 'Automated video ads, course sales & client retainers', color: '#10B981' },
  { level: 3, label: 'Level 3: Multi-Platform Repurposing', description: 'Extracting 9:16 Shorts from 16:9 widescreen videos', color: '#0066FF' },
  { level: 4, label: 'Foundation: Consistent Output', description: 'Publishing 3-5 high-retention videos daily with zero burnout', color: '#2563EB' },
];

export const PyramidChart: React.FC<PyramidChartProps> = ({
  title = 'Strategic Growth Pyramid',
  subtitle = 'Hierarchical mastery levels from base foundation to category apex',
  tiers = DEFAULT_PYRAMID_TIERS,
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
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';
  const borderColor = isDark ? '#334155' : '#E2E8F0';

  const items = tiers && tiers.length > 0 ? tiers : DEFAULT_PYRAMID_TIERS;

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
        <div style={{ marginBottom: '22px', textAlign: 'center' }}>
          {title && <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: textColor }}>{title}</h3>}
          {subtitle && <p style={{ margin: '4px 0 0 0', fontSize: '13px', fontWeight: 500, color: textMuted }}>{subtitle}</p>}
        </div>
      )}

      {/* Pyramid Tiers Stack (Narrow at top, wide at base) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
        {items.map((tier, idx) => {
          const tierSpring = spring({
            frame: Math.max(0, frame - delayFrames - idx * 4),
            fps,
            config: { damping: 14, stiffness: 95 },
          });

          // Width increases progressively down the pyramid
          const tierWidthPercent = 42 + idx * (58 / (items.length - 1 || 1));
          const currentWidth = interpolate(tierSpring, [0, 1], [0, tierWidthPercent]);
          const tierColor = tier.color || '#0066FF';

          return (
            <div
              key={idx}
              style={{
                width: `${currentWidth}%`,
                minWidth: '220px',
                padding: '14px 20px',
                backgroundColor: cardBg,
                border: `2px solid ${tierColor}`,
                borderRadius: '16px',
                boxShadow: `0 4px 18px ${tierColor}25`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                boxSizing: 'border-box',
                transform: `scale(${tierSpring})`,
                opacity: tierSpring,
              }}
            >
              <div style={{ fontSize: '14px', fontWeight: 800, color: textColor }}>
                {tier.label}
              </div>
              {tier.description && (
                <div style={{ fontSize: '11px', fontWeight: 500, color: textMuted, marginTop: '2px' }}>
                  {tier.description}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
