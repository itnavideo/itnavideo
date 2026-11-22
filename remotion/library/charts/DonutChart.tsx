import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface DonutChartSlice {
  label: string;
  value: number;
  color?: string;
}

export interface DonutChartProps {
  title?: string;
  subtitle?: string;
  centerHeadline?: string;
  centerSubline?: string;
  slices?: DonutChartSlice[];
  size?: number;
  strokeWidth?: number;
  theme?: 'dark' | 'light';
  delayFrames?: number;
  showLegend?: boolean;
  style?: React.CSSProperties;
}

const DEFAULT_DONUT_SLICES: DonutChartSlice[] = [
  { label: 'Organic Search', value: 48, color: '#0066FF' },
  { label: 'Direct Referral', value: 28, color: '#10B981' },
  { label: 'Social Video', value: 16, color: '#F59E0B' },
  { label: 'Email Campaigns', value: 8, color: '#8B5CF6' },
];

export const DonutChart: React.FC<DonutChartProps> = ({
  title = 'Conversion Channels',
  subtitle = 'Revenue by acquisition channel',
  centerHeadline = '+84%',
  centerSubline = 'Conversion ROI',
  slices = DEFAULT_DONUT_SLICES,
  size = 280,
  strokeWidth = 32,
  theme = 'dark',
  delayFrames = 5,
  showLegend = true,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isDark = theme === 'dark';
  const bgColor = isDark ? '#111827' : '#FFFFFF';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';
  const borderColor = isDark ? '#1E293B' : '#E2E8F0';
  const trackColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  const items = slices && slices.length > 0 ? slices : DEFAULT_DONUT_SLICES;
  const total = items.reduce((sum, s) => sum + s.value, 0) || 1;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const progressSpring = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping: 16, stiffness: 80 },
  });

  let accumulatedPercent = 0;

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
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
      {/* Title */}
      {(title || subtitle) && (
        <div style={{ textAlign: 'center', marginBottom: '20px', width: '100%' }}>
          {title && (
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: textColor, letterSpacing: '-0.02em' }}>
              {title}
            </h3>
          )}
          {subtitle && (
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', fontWeight: 500, color: textMuted }}>
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Donut SVG */}
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: 'rotate(-90deg)' }}
        >
          {/* Base Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={trackColor}
            strokeWidth={strokeWidth}
          />

          {/* Slices */}
          {items.map((slice, idx) => {
            const slicePercent = slice.value / total;
            const strokeDasharray = `${circumference * slicePercent * progressSpring} ${circumference}`;
            const strokeDashoffset = -circumference * accumulatedPercent * progressSpring;
            accumulatedPercent += slicePercent;

            return (
              <circle
                key={idx}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={slice.color || '#0066FF'}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            );
          })}
        </svg>

        {/* Center Callout */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '16px',
            pointerEvents: 'none',
          }}
        >
          {centerHeadline && (
            <div
              style={{
                fontSize: `${size * 0.16}px`,
                fontWeight: 900,
                color: textColor,
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
              }}
            >
              {centerHeadline}
            </div>
          )}
          {centerSubline && (
            <div
              style={{
                fontSize: `${size * 0.052}px`,
                fontWeight: 600,
                color: textMuted,
                marginTop: '6px',
                maxWidth: `${size * 0.65}px`,
              }}
            >
              {centerSubline}
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      {showLegend && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px 16px',
            marginTop: '24px',
            justifyContent: 'center',
            maxWidth: `${size + 80}px`,
          }}
        >
          {items.map((slice, idx) => {
            const pct = Math.round((slice.value / total) * 100);
            return (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: textColor }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: slice.color || '#0066FF',
                  }}
                />
                <span style={{ fontWeight: 600 }}>{slice.label}</span>
                <span style={{ fontWeight: 800, color: textMuted }}>({pct}%)</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
