import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface GaugeChartProps {
  title?: string;
  subtitle?: string;
  value?: number; // 0 to 100
  minValue?: number;
  maxValue?: number;
  unit?: string;
  size?: number;
  theme?: 'dark' | 'light';
  delayFrames?: number;
  style?: React.CSSProperties;
}

export const GaugeChart: React.FC<GaugeChartProps> = ({
  title = 'Viral Velocity Speedometer',
  subtitle = 'Estimated algorithmic distribution index',
  value = 82,
  minValue = 0,
  maxValue = 100,
  unit = 'MPH',
  size = 280,
  theme = 'dark',
  delayFrames = 5,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isDark = theme === 'dark';
  const bgColor = isDark ? '#111827' : '#FFFFFF';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';
  const borderColor = isDark ? '#334155' : '#E2E8F0';

  const strokeWidth = 24;
  const radius = (size - strokeWidth * 2) / 2;
  const center = size / 2;

  // Half-circle math (180 degrees)
  const semiCircumference = Math.PI * radius;

  const needleSpring = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping: 14, stiffness: 70 },
  });

  const clampedVal = Math.min(maxValue, Math.max(minValue, value));
  const normalizedFraction = (clampedVal - minValue) / (maxValue - minValue || 1);
  const targetAngle = interpolate(needleSpring, [0, 1], [-90, -90 + normalizedFraction * 180]);
  const displayVal = Math.round(interpolate(needleSpring, [0, 1], [minValue, clampedVal]));

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
        <div style={{ textAlign: 'center', marginBottom: '18px', width: '100%' }}>
          {title && <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: textColor }}>{title}</h3>}
          {subtitle && <p style={{ margin: '4px 0 0 0', fontSize: '12px', fontWeight: 500, color: textMuted }}>{subtitle}</p>}
        </div>
      )}

      {/* Half Gauge SVG */}
      <div style={{ position: 'relative', width: size, height: size * 0.62 }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <defs>
            <linearGradient id="gaugeGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>

          {/* Background Semi-circle Track */}
          <path
            d={`M ${center - radius} ${center} A ${radius} ${radius} 0 0 1 ${center + radius} ${center}`}
            fill="none"
            stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Color Gradient Arc */}
          <path
            d={`M ${center - radius} ${center} A ${radius} ${radius} 0 0 1 ${center + radius} ${center}`}
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Rotating Indicator Needle */}
          <g transform={`rotate(${targetAngle} ${center} ${center})`}>
            <line
              x1={center}
              y1={center}
              x2={center + radius * 0.85}
              y2={center}
              stroke={textColor}
              strokeWidth={4}
              strokeLinecap="round"
            />
            <circle cx={center} cy={center} r={10} fill={textColor} />
            <circle cx={center} cy={center} r={4} fill={bgColor} />
          </g>
        </svg>

        {/* Value Display Badge */}
        <div
          style={{
            position: 'absolute',
            bottom: '4px',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '28px', fontWeight: 900, color: textColor, lineHeight: 1 }}>
            {displayVal}
            <span style={{ fontSize: '13px', color: textMuted, marginLeft: '4px' }}>{unit}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
