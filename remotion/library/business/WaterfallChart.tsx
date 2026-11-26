import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface WaterfallStep {
  label: string;
  amount: number; // positive or negative
  isTotal?: boolean;
}

export interface WaterfallChartProps {
  title?: string;
  subtitle?: string;
  steps?: WaterfallStep[];
  width?: number | string;
  height?: number;
  theme?: 'dark' | 'light';
  delayFrames?: number;
  style?: React.CSSProperties;
}

const DEFAULT_WATERFALL_STEPS: WaterfallStep[] = [
  { label: 'Gross Sales', amount: 150000 },
  { label: 'Ad Spend', amount: -38000 },
  { label: 'Software APIs', amount: -12000 },
  { label: 'SaaS Upgrades', amount: 24000 },
  { label: 'Payment Fees', amount: -5000 },
  { label: 'Net Profit', amount: 119000, isTotal: true },
];

export const WaterfallChart: React.FC<WaterfallChartProps> = ({
  title = 'Revenue & Expense Waterfall',
  subtitle = 'Breakdown from gross volume to retained net margin',
  steps = DEFAULT_WATERFALL_STEPS,
  width = '100%',
  height = 340,
  theme = 'dark',
  delayFrames = 5,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isDark = theme === 'dark';
  const bgColor = 'transparent';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';
  const borderColor = isDark ? '#334155' : '#E2E8F0';
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  const items = steps && steps.length > 0 ? steps : DEFAULT_WATERFALL_STEPS;

  // Calculate cumulative heights
  let runningTotal = 0;
  const processed = items.map((step) => {
    const start = step.isTotal ? 0 : runningTotal;
    runningTotal = step.isTotal ? step.amount : runningTotal + step.amount;
    const end = runningTotal;
    return {
      ...step,
      start,
      end,
      isPositive: step.amount >= 0,
    };
  });

  const maxVal = Math.max(...processed.map((p) => Math.max(p.start, p.end)), 1) * 1.15;

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

      {/* Waterfall Columns Container */}
      <div
        style={{
          position: 'relative',
          height: `${height - 90}px`,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: '12px',
          paddingTop: '20px',
          paddingBottom: '24px',
          boxSizing: 'border-box',
        }}
      >
        {processed.map((bar, idx) => {
          const barSpring = spring({
            frame: Math.max(0, frame - delayFrames - idx * 4),
            fps,
            config: { damping: 14, stiffness: 95 },
          });

          const bottomPct = (Math.min(bar.start, bar.end) / maxVal) * 100;
          const heightPct = (Math.abs(bar.amount) / maxVal) * 100;
          const animatedHeight = interpolate(barSpring, [0, 1], [0, heightPct]);

          const barColor = bar.isTotal ? '#0066FF' : bar.isPositive ? '#10B981' : '#EF4444';

          return (
            <div
              key={idx}
              style={{
                flex: 1,
                height: '100%',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}
            >
              {/* Value Text Above Bar */}
              <div
                style={{
                  position: 'absolute',
                  bottom: `${bottomPct + animatedHeight + 2}%`,
                  fontSize: '11px',
                  fontWeight: 800,
                  color: barColor,
                  whiteSpace: 'nowrap',
                  opacity: barSpring,
                }}
              >
                {bar.amount > 0 && !bar.isTotal ? `+` : ''}
                {(bar.amount / 1000).toFixed(0)}k
              </div>

              {/* Floating Column Bar */}
              <div
                style={{
                  position: 'absolute',
                  bottom: `${bottomPct}%`,
                  width: '100%',
                  maxWidth: '44px',
                  height: `${animatedHeight}%`,
                  backgroundColor: barColor,
                  borderRadius: '6px',
                  boxShadow: `0 4px 14px ${barColor}33`,
                }}
              />

              {/* X Axis Label */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-22px',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: textMuted,
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '70px',
                }}
              >
                {bar.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
