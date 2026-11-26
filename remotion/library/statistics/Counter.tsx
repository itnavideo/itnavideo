import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface CounterProps {
  title?: string;
  fromValue?: number;
  toValue?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label?: string;
  size?: number;
  color?: string;
  theme?: 'dark' | 'light';
  delayFrames?: number;
  style?: React.CSSProperties;
}

export const Counter: React.FC<CounterProps> = ({
  title,
  fromValue = 0,
  toValue = 250000,
  prefix = '$',
  suffix = '+',
  decimals = 0,
  label = 'Total Revenue Generated',
  size = 54,
  color = '#0066FF',
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

  const countSpring = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping: 18, stiffness: 65 },
  });

  const currentValue = interpolate(countSpring, [0, 1], [fromValue, toValue]);
  const formattedNumber = decimals > 0
    ? currentValue.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    : Math.round(currentValue).toLocaleString();

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'transparent',
        border: 'none',
        borderRadius: '24px',
        padding: '28px 36px',
        boxShadow: 'none',
        boxSizing: 'border-box',
        fontFamily: 'Inter, system-ui, sans-serif',
        textAlign: 'center',
        ...style,
      }}
    >
      {title && (
        <div style={{ fontSize: '13px', fontWeight: 700, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
          {title}
        </div>
      )}

      {/* Giant Animated Number */}
      <div
        style={{
          fontSize: `${size}px`,
          fontWeight: 900,
          color,
          lineHeight: 1.05,
          letterSpacing: '-0.03em',
          textShadow: `0 4px 24px ${color}55`,
        }}
      >
        <span>{prefix}</span>
        <span>{formattedNumber}</span>
        <span>{suffix}</span>
      </div>

      {label && (
        <div style={{ fontSize: '14px', fontWeight: 600, color: textColor, marginTop: '10px' }}>
          {label}
        </div>
      )}
    </div>
  );
};
