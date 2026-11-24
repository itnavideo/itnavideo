import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface PieChartSlice {
  label: string;
  value: number;
  color?: string;
}

export interface PieChartProps {
  title?: string;
  subtitle?: string;
  slices?: PieChartSlice[];
  size?: number;
  theme?: 'dark' | 'light';
  delayFrames?: number;
  showLegend?: boolean;
  showPercentages?: boolean;
  style?: React.CSSProperties;
}

const DEFAULT_PIE_SLICES: PieChartSlice[] = [
  { label: 'YouTube Shorts', value: 45, color: '#0066FF' },
  { label: 'Instagram Reels', value: 30, color: '#10B981' },
  { label: 'TikTok', value: 15, color: '#F59E0B' },
  { label: 'LinkedIn Video', value: 10, color: '#8B5CF6' },
];

export const PieChart: React.FC<PieChartProps> = ({
  title = 'Traffic Distribution',
  subtitle = 'Multi-platform audience breakdown',
  slices = DEFAULT_PIE_SLICES,
  size = 280,
  theme = 'dark',
  delayFrames = 5,
  showLegend = true,
  showPercentages = true,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isDark = theme === 'dark';
  const bgColor = isDark ? '#111827' : '#FFFFFF';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';
  const borderColor = isDark ? '#1E293B' : '#E2E8F0';

  const items = slices && slices.length > 0 ? slices : DEFAULT_PIE_SLICES;
  const total = items.reduce((sum, s) => sum + s.value, 0) || 1;

  const sweepSpring = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping: 16, stiffness: 75 },
  });

  const radius = size * 0.42;
  const center = size / 2;

  // Build SVG arc paths
  let currentAngle = -Math.PI / 2; // Start from top 12 o'clock

  const arcs = items.map((slice, idx) => {
    const sliceAngle = (slice.value / total) * 2 * Math.PI * sweepSpring;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;
    currentAngle = endAngle;

    const x1 = center + radius * Math.cos(startAngle);
    const y1 = center + radius * Math.sin(startAngle);
    const x2 = center + radius * Math.cos(endAngle);
    const y2 = center + radius * Math.sin(endAngle);

    const largeArc = sliceAngle > Math.PI ? 1 : 0;
    const pathD = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

    const percent = Math.round((slice.value / total) * 100);

    return {
      pathD,
      color: slice.color || '#0066FF',
      label: slice.label,
      value: slice.value,
      percent,
    };
  });

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'transparent',
        border: 'none',
        borderRadius: 0,
        padding: 0,
        boxShadow: 'none',
        boxSizing: 'border-box',
        fontFamily: 'system-ui, -apple-system, sans-serif',
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

      {/* SVG Pie */}
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {arcs.map((arc, idx) => (
            <path
              key={idx}
              d={arc.pathD}
              fill={arc.color}
              stroke={bgColor}
              strokeWidth={3}
              style={{
                transition: 'fill 0.2s ease',
              }}
            />
          ))}
        </svg>
      </div>

      {/* Legend */}
      {showLegend && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px 18px',
            marginTop: '24px',
            justifyContent: 'center',
            maxWidth: `${size + 80}px`,
          }}
        >
          {arcs.map((arc, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: textColor }}>
              <span
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: arc.color,
                  flexShrink: 0,
                }}
              />
              <span style={{ fontWeight: 600 }}>{arc.label}</span>
              {showPercentages && (
                <span style={{ fontWeight: 800, color: textMuted }}>
                  {arc.percent}%
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
