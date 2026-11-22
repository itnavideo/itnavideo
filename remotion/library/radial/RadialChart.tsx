import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface RadialRingItem {
  label: string;
  value: number; // 0 to 100
  color: string;
  icon?: string;
}

export interface RadialChartProps {
  title?: string;
  subtitle?: string;
  rings?: RadialRingItem[];
  size?: number;
  strokeWidth?: number;
  theme?: 'dark' | 'light';
  delayFrames?: number;
  showLegend?: boolean;
  style?: React.CSSProperties;
}

const DEFAULT_RADIAL_RINGS: RadialRingItem[] = [
  { label: 'Audio Clarity', value: 95, color: '#0066FF' },
  { label: 'Hook Retention', value: 82, color: '#10B981' },
  { label: 'Viral Reach', value: 68, color: '#F59E0B' },
  { label: 'Conversion CTR', value: 54, color: '#8B5CF6' },
];

export const RadialChart: React.FC<RadialChartProps> = ({
  title = 'Multi-Ring Performance Rings',
  subtitle = 'Concentric activity & retention metrics',
  rings = DEFAULT_RADIAL_RINGS,
  size = 300,
  strokeWidth = 14,
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
  const borderColor = isDark ? '#334155' : '#E2E8F0';
  const trackColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  const items = rings && rings.length > 0 ? rings : DEFAULT_RADIAL_RINGS;
  const center = size / 2;
  const maxRadius = (size - strokeWidth * 2) / 2;
  const ringGap = strokeWidth + 6;

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
      {(title || subtitle) && (
        <div style={{ textAlign: 'center', marginBottom: '20px', width: '100%' }}>
          {title && <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: textColor }}>{title}</h3>}
          {subtitle && <p style={{ margin: '4px 0 0 0', fontSize: '12px', fontWeight: 500, color: textMuted }}>{subtitle}</p>}
        </div>
      )}

      {/* SVG Concentric Rings */}
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: 'rotate(-90deg)' }}
        >
          {items.map((ring, idx) => {
            const r = maxRadius - idx * ringGap;
            const circumference = 2 * Math.PI * r;

            const ringSpring = spring({
              frame: Math.max(0, frame - delayFrames - idx * 4),
              fps,
              config: { damping: 15, stiffness: 80 },
            });

            const strokeDashoffset = circumference * (1 - (ring.value / 100) * ringSpring);

            return (
              <React.Fragment key={idx}>
                {/* Background Ring Track */}
                <circle
                  cx={center}
                  cy={center}
                  r={r}
                  fill="none"
                  stroke={trackColor}
                  strokeWidth={strokeWidth}
                />
                {/* Animated Value Arc */}
                <circle
                  cx={center}
                  cy={center}
                  r={r}
                  fill="none"
                  stroke={ring.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </React.Fragment>
            );
          })}
        </svg>

        {/* Center Total / Top Metric */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          <div style={{ fontSize: '26px', fontWeight: 900, color: items[0]?.color || '#0066FF', lineHeight: 1 }}>
            {items[0]?.value}%
          </div>
          <div style={{ fontSize: '10px', fontWeight: 800, color: textMuted, textTransform: 'uppercase', marginTop: '4px' }}>
            Top Metric
          </div>
        </div>
      </div>

      {/* Legend */}
      {showLegend && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px 16px',
            marginTop: '22px',
            justifyContent: 'center',
            maxWidth: `${size + 80}px`,
          }}
        >
          {items.map((ring, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: textColor }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: ring.color }} />
              <span style={{ fontWeight: 600 }}>{ring.label}</span>
              <span style={{ fontWeight: 800, color: ring.color }}>{ring.value}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
