import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface CircularProgressProps {
  title?: string;
  subtitle?: string;
  value?: number; // 0 to 100
  targetValueText?: string;
  label?: string;
  size?: number;
  strokeWidth?: number;
  theme?: 'dark' | 'light';
  color?: string;
  delayFrames?: number;
  style?: React.CSSProperties;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  title,
  subtitle,
  value = 88,
  targetValueText,
  label = 'Retention Score',
  size = 240,
  strokeWidth = 18,
  theme = 'dark',
  color = '#0066FF',
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
  const trackColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const progressSpring = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping: 16, stiffness: 80 },
  });

  const animatedPercent = Math.min(100, Math.max(0, value * progressSpring));
  const strokeDashoffset = circumference * (1 - animatedPercent / 100);
  const displayVal = Math.round(animatedPercent);

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
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
        <div style={{ textAlign: 'center', marginBottom: '18px', width: '100%' }}>
          {title && <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: textColor }}>{title}</h3>}
          {subtitle && <p style={{ margin: '4px 0 0 0', fontSize: '12px', fontWeight: 500, color: textMuted }}>{subtitle}</p>}
        </div>
      )}

      {/* Circular Gauge */}
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: 'rotate(-90deg)' }}
        >
          {/* Base Track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={trackColor}
            strokeWidth={strokeWidth}
          />
          {/* Active Gradient Arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 10px ${color}88)`,
            }}
          />
        </svg>

        {/* Center Percentage Display */}
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
          <div
            style={{
              fontSize: `${size * 0.22}px`,
              fontWeight: 900,
              color: textColor,
              lineHeight: 1,
              letterSpacing: '-0.03em',
            }}
          >
            {targetValueText || `${displayVal}%`}
          </div>
          {label && (
            <div
              style={{
                fontSize: `${size * 0.055}px`,
                fontWeight: 700,
                color: textMuted,
                marginTop: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              {label}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
