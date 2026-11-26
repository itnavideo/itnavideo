import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface StatCardProps {
  icon?: string;
  metricValue?: string;
  metricLabel?: string;
  trendText?: string;
  trendPositive?: boolean;
  color?: string;
  theme?: 'dark' | 'light';
  delayFrames?: number;
  style?: React.CSSProperties;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon = '⚡',
  metricValue = '99.4%',
  metricLabel = 'Groq Whisper Transcription Reliability',
  trendText = '+4.2% vs baseline',
  trendPositive = true,
  color = '#10B981',
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

  const cardSpring = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping: 14, stiffness: 95 },
  });

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        backgroundColor: 'transparent',
        border: 'none',
        borderRadius: '20px',
        padding: '24px 26px',
        boxShadow: 'none',
        boxSizing: 'border-box',
        fontFamily: 'Inter, system-ui, sans-serif',
        minWidth: '220px',
        transform: `scale(${cardSpring}) translateY(${(1 - cardSpring) * 15}px)`,
        opacity: cardSpring,
        ...style,
      }}
    >
      {/* Icon & Trend */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            backgroundColor: `${color}22`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
          }}
        >
          {icon}
        </div>
        {trendText && (
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              color: trendPositive ? '#10B981' : '#EF4444',
              backgroundColor: trendPositive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              padding: '2px 8px',
              borderRadius: '9999px',
            }}
          >
            {trendText}
          </span>
        )}
      </div>

      {/* Metric Value */}
      <div style={{ fontSize: '32px', fontWeight: 900, color: textColor, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
        {metricValue}
      </div>

      {/* Metric Label */}
      <div style={{ fontSize: '13px', fontWeight: 500, color: textMuted, marginTop: '6px' }}>
        {metricLabel}
      </div>
    </div>
  );
};
