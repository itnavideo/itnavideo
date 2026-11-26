import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface KPIWidgetProps {
  title?: string;
  metric?: string;
  delta?: string; // e.g. "+24.8%"
  deltaIsPositive?: boolean;
  benchmarkText?: string;
  color?: string;
  theme?: 'dark' | 'light';
  delayFrames?: number;
  width?: number | string;
  style?: React.CSSProperties;
}

export const KPIWidget: React.FC<KPIWidgetProps> = ({
  title = 'Monthly Recurring Revenue (MRR)',
  metric = '$148,250',
  delta = '+34.2%',
  deltaIsPositive = true,
  benchmarkText = 'vs $110,400 target',
  color = '#0066FF',
  theme = 'dark',
  delayFrames = 5,
  width = '100%',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isDark = theme === 'dark';
  const bgColor = 'transparent';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';
  const borderColor = isDark ? '#334155' : '#E2E8F0';

  const kpiSpring = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping: 14, stiffness: 95 },
  });

  const deltaColor = deltaIsPositive ? '#10B981' : '#EF4444';

  return (
    <div
      style={{
        width,
        backgroundColor: 'transparent',
        border: 'none',
        borderRadius: '24px',
        padding: '24px 28px',
        boxShadow: 'none',
        boxSizing: 'border-box',
        fontFamily: 'Inter, system-ui, sans-serif',
        position: 'relative',
        overflow: 'hidden',
        transform: `scale(${kpiSpring}) translateY(${(1 - kpiSpring) * 15}px)`,
        opacity: kpiSpring,
        ...style,
      }}
    >
      {/* Top Accent Strip */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${color} 0%, ${color}88 100%)`,
        }}
      />

      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: textMuted }}>
          {title}
        </span>
        {delta && (
          <span
            style={{
              padding: '3px 10px',
              borderRadius: '9999px',
              backgroundColor: `${deltaColor}22`,
              border: `1px solid ${deltaColor}44`,
              color: deltaColor,
              fontSize: '11px',
              fontWeight: 900,
            }}
          >
            {delta}
          </span>
        )}
      </div>

      {/* Big Metric */}
      <div
        style={{
          fontSize: '36px',
          fontWeight: 900,
          color: textColor,
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
        }}
      >
        {metric}
      </div>

      {/* Benchmark Subtext */}
      {benchmarkText && (
        <div style={{ fontSize: '12px', fontWeight: 500, color: textMuted, marginTop: '8px' }}>
          {benchmarkText}
        </div>
      )}
    </div>
  );
};
