import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface FunnelStage {
  label: string;
  countText: string;
  conversionPercent?: string;
  color?: string;
}

export interface FunnelChartProps {
  title?: string;
  subtitle?: string;
  stages?: FunnelStage[];
  width?: number | string;
  theme?: 'dark' | 'light';
  delayFrames?: number;
  style?: React.CSSProperties;
}

const DEFAULT_FUNNEL_STAGES: FunnelStage[] = [
  { label: 'Total Video Views', countText: '100,000', conversionPercent: '100%', color: '#0066FF' },
  { label: 'Hook Retained (>3s)', countText: '45,000', conversionPercent: '45.0%', color: '#2563EB' },
  { label: 'Watched to End', countText: '18,500', conversionPercent: '18.5%', color: '#3B82F6' },
  { label: 'Clicked Profile Bio Link', countText: '3,200', conversionPercent: '3.2%', color: '#10B981' },
  { label: 'Paid Plan Subscriptions', countText: '640', conversionPercent: '0.64%', color: '#F59E0B' },
];

export const FunnelChart: React.FC<FunnelChartProps> = ({
  title = 'Audience Conversion Funnel',
  subtitle = 'From initial impressions to high-value paid conversions',
  stages = DEFAULT_FUNNEL_STAGES,
  width = '100%',
  theme = 'dark',
  delayFrames = 5,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isDark = theme === 'dark';
  const bgColor = 'transparent';
  const cardBg = isDark ? 'rgba(30, 41, 59, 0.42)' : 'rgba(15, 23, 42, 0.04)';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';
  const borderColor = isDark ? '#334155' : '#E2E8F0';

  const items = stages && stages.length > 0 ? stages : DEFAULT_FUNNEL_STAGES;

  return (
    <div
      style={{
        width,
        backgroundColor: 'transparent',
        border: 'none',
        borderRadius: '24px',
        padding: '28px 32px',
        boxShadow: 'none',
        boxSizing: 'border-box',
        fontFamily: 'Inter, system-ui, sans-serif',
        ...style,
      }}
    >
      {(title || subtitle) && (
        <div style={{ marginBottom: '22px' }}>
          {title && <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: textColor }}>{title}</h3>}
          {subtitle && <p style={{ margin: '4px 0 0 0', fontSize: '13px', fontWeight: 500, color: textMuted }}>{subtitle}</p>}
        </div>
      )}

      {/* Funnel Slices */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
        {items.map((stage, idx) => {
          const stageSpring = spring({
            frame: Math.max(0, frame - delayFrames - idx * 4),
            fps,
            config: { damping: 14, stiffness: 95 },
          });

          // Tapered width from 100% down to ~45%
          const baseWidthPercent = 100 - idx * (55 / (items.length - 1 || 1));
          const currentWidth = interpolate(stageSpring, [0, 1], [0, baseWidthPercent]);
          const stageColor = stage.color || '#0066FF';

          return (
            <div
              key={idx}
              style={{
                width: `${currentWidth}%`,
                minWidth: '240px',
                padding: '12px 20px',
                backgroundColor: cardBg,
                border: `1.5px solid ${stageColor}`,
                borderRadius: '14px',
                boxShadow: `0 4px 16px ${stageColor}25`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxSizing: 'border-box',
                transform: `scale(${stageSpring})`,
                opacity: stageSpring,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: stageColor }} />
                <span style={{ fontSize: '13px', fontWeight: 700, color: textColor }}>
                  {stage.label}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '14px', fontWeight: 900, color: stageColor }}>
                  {stage.countText}
                </span>
                {stage.conversionPercent && (
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      backgroundColor: `${stageColor}22`,
                      color: stageColor,
                      fontSize: '11px',
                      fontWeight: 800,
                    }}
                  >
                    {stage.conversionPercent}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
