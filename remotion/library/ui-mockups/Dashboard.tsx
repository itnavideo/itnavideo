import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface DashboardProps {
  title?: string;
  revenue?: string;
  activeUsers?: string;
  rendersCount?: string;
  theme?: 'dark' | 'light';
  delayFrames?: number;
  width?: number | string;
  style?: React.CSSProperties;
}

export const Dashboard: React.FC<DashboardProps> = ({
  title = 'Itnavideo SaaS Dashboard',
  revenue = '$84,200',
  activeUsers = '14,890',
  rendersCount = '128,450',
  theme = 'dark',
  delayFrames = 5,
  width = '100%',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isDark = theme === 'dark';
  const bgColor = isDark ? '#111827' : '#FFFFFF';
  const cardBg = isDark ? '#1E293B' : '#F8FAFC';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';
  const borderColor = isDark ? '#334155' : '#E2E8F0';

  const dashSpring = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  return (
    <div
      style={{
        width,
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: '24px',
        padding: '24px 28px',
        boxShadow: isDark ? '0 16px 40px rgba(0,0,0,0.5)' : '0 8px 30px rgba(0,0,0,0.08)',
        boxSizing: 'border-box',
        fontFamily: 'Inter, system-ui, sans-serif',
        transform: `scale(${dashSpring}) translateY(${(1 - dashSpring) * 15}px)`,
        opacity: dashSpring,
        ...style,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: textColor }}>
          {title}
        </h3>
        <span
          style={{
            padding: '3px 10px',
            borderRadius: '9999px',
            backgroundColor: '#10B98122',
            border: '1px solid #10B98155',
            color: '#10B981',
            fontSize: '11px',
            fontWeight: 800,
          }}
        >
          ● Live Production
        </span>
      </div>

      {/* 3 Metric Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '14px' }}>
        <div style={{ padding: '16px', backgroundColor: cardBg, borderRadius: '14px', border: `1px solid ${borderColor}` }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: textMuted }}>Monthly MRR</div>
          <div style={{ fontSize: '22px', fontWeight: 900, color: '#0066FF', marginTop: '4px' }}>{revenue}</div>
        </div>
        <div style={{ padding: '16px', backgroundColor: cardBg, borderRadius: '14px', border: `1px solid ${borderColor}` }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: textMuted }}>Active Creators</div>
          <div style={{ fontSize: '22px', fontWeight: 900, color: '#10B981', marginTop: '4px' }}>{activeUsers}</div>
        </div>
        <div style={{ padding: '16px', backgroundColor: cardBg, borderRadius: '14px', border: `1px solid ${borderColor}` }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: textMuted }}>Cloud Renders</div>
          <div style={{ fontSize: '22px', fontWeight: 900, color: '#F59E0B', marginTop: '4px' }}>{rendersCount}</div>
        </div>
      </div>
    </div>
  );
};
