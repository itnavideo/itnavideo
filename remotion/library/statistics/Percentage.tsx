import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface PercentageProps {
  value?: number; // e.g. 342 or -28
  label?: string;
  periodText?: string;
  theme?: 'dark' | 'light';
  delayFrames?: number;
  style?: React.CSSProperties;
}

export const Percentage: React.FC<PercentageProps> = ({
  value = 342,
  label = 'Audience Retention Surge',
  periodText = 'vs previous 30 days',
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

  const isPositive = value >= 0;
  const accentColor = isPositive ? '#10B981' : '#EF4444';

  const animSpring = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping: 15, stiffness: 85 },
  });

  const animatedVal = Math.round(interpolate(animSpring, [0, 1], [0, Math.abs(value)]));

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '18px',
        backgroundColor: 'transparent',
        border: `1.5px solid ${accentColor}44`,
        borderRadius: '20px',
        padding: '20px 28px',
        boxShadow: `0 8px 28px ${accentColor}22`,
        boxSizing: 'border-box',
        fontFamily: 'Inter, system-ui, sans-serif',
        transform: `scale(${animSpring})`,
        opacity: animSpring,
        ...style,
      }}
    >
      {/* Icon Pill */}
      <div
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '14px',
          backgroundColor: `${accentColor}22`,
          border: `2px solid ${accentColor}`,
          color: accentColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          fontWeight: 900,
          flexShrink: 0,
        }}
      >
        {isPositive ? '↗' : '↘'}
      </div>

      {/* Metrics & Narrative */}
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
          <span style={{ fontSize: '32px', fontWeight: 900, color: accentColor, letterSpacing: '-0.02em', lineHeight: 1 }}>
            {isPositive ? '+' : '-'}{animatedVal}%
          </span>
        </div>
        <div style={{ fontSize: '14px', fontWeight: 700, color: textColor, marginTop: '4px' }}>
          {label}
        </div>
        {periodText && (
          <div style={{ fontSize: '11px', fontWeight: 500, color: textMuted, marginTop: '2px' }}>
            {periodText}
          </div>
        )}
      </div>
    </div>
  );
};
