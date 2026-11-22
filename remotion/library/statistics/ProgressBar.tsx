import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface ProgressBarProps {
  label?: string;
  value?: number; // 0 to 100
  targetLabel?: string;
  color?: string;
  theme?: 'dark' | 'light';
  delayFrames?: number;
  width?: number | string;
  height?: number;
  showStripes?: boolean;
  style?: React.CSSProperties;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  label = 'AI Video Render Progress',
  value = 75,
  targetLabel = '75% Complete',
  color = '#0066FF',
  theme = 'dark',
  delayFrames = 5,
  width = '100%',
  height = 16,
  showStripes = true,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isDark = theme === 'dark';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';
  const trackBg = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';

  const barSpring = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping: 15, stiffness: 85 },
  });

  const animatedPercent = Math.min(100, Math.max(0, value * barSpring));

  return (
    <div
      style={{
        width,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        fontFamily: 'Inter, system-ui, sans-serif',
        ...style,
      }}
    >
      {/* Header Label & Target */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: textColor }}>
          {label}
        </span>
        <span style={{ fontSize: '12px', fontWeight: 800, color }}>
          {targetLabel || `${Math.round(animatedPercent)}%`}
        </span>
      </div>

      {/* Progress Track */}
      <div
        style={{
          width: '100%',
          height: `${height}px`,
          backgroundColor: trackBg,
          borderRadius: '9999px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            width: `${animatedPercent}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${color} 0%, ${color}DD 100%)`,
            borderRadius: '9999px',
            boxShadow: `0 0 16px ${color}88`,
            transition: 'width 0.1s ease',
          }}
        />
      </div>
    </div>
  );
};
