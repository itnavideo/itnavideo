import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface SplitscreenProps {
  title?: string;
  leftHeadline?: string;
  leftBody?: string;
  leftColor?: string;
  rightHeadline?: string;
  rightBody?: string;
  rightColor?: string;
  vsBadgeText?: string;
  width?: number | string;
  theme?: 'dark' | 'light';
  delayFrames?: number;
  style?: React.CSSProperties;
}

export const Splitscreen: React.FC<SplitscreenProps> = ({
  title,
  leftHeadline = 'Traditional Editing',
  leftBody = 'Manual keyframing, timeline audio sync, 6+ hours per video',
  leftColor = '#EF4444',
  rightHeadline = 'Itnavideo Studio',
  rightBody = 'Automated AI captions, AWS cloud render, 60 seconds flat',
  rightColor = '#0066FF',
  vsBadgeText = 'VS',
  width = '100%',
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

  const leftSpring = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  const rightSpring = spring({
    frame: Math.max(0, frame - delayFrames - 4),
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  const vsSpring = spring({
    frame: Math.max(0, frame - delayFrames - 8),
    fps,
    config: { damping: 12, stiffness: 120 },
  });

  return (
    <div
      style={{
        width,
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: '24px',
        padding: '28px 32px',
        boxShadow: isDark ? '0 12px 36px rgba(0,0,0,0.45)' : '0 8px 30px rgba(0,0,0,0.08)',
        boxSizing: 'border-box',
        fontFamily: 'Inter, system-ui, sans-serif',
        position: 'relative',
        ...style,
      }}
    >
      {title && (
        <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', fontWeight: 800, color: textColor, textAlign: 'center' }}>
          {title}
        </h3>
      )}

      {/* Split Dual Panels */}
      <div style={{ position: 'relative', display: 'flex', gap: '16px', alignItems: 'stretch' }}>
        {/* Left Side */}
        <div
          style={{
            flex: 1,
            backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
            border: `2px solid ${leftColor}55`,
            borderLeft: `5px solid ${leftColor}`,
            borderRadius: '16px',
            padding: '24px',
            transform: `translateX(${(1 - leftSpring) * -30}px)`,
            opacity: leftSpring,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div style={{ fontSize: '18px', fontWeight: 900, color: leftColor, marginBottom: '8px' }}>
            {leftHeadline}
          </div>
          <div style={{ fontSize: '13px', fontWeight: 500, color: textColor, lineHeight: 1.4 }}>
            {leftBody}
          </div>
        </div>

        {/* Center Animated VS Badge */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: `translate(-50%, -50%) scale(${vsSpring})`,
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: '#09090b',
            border: '2px solid #F59E0B',
            boxShadow: '0 0 20px rgba(245, 158, 11, 0.6)',
            color: '#F59E0B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 900,
            zIndex: 10,
          }}
        >
          {vsBadgeText}
        </div>

        {/* Right Side */}
        <div
          style={{
            flex: 1,
            backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
            border: `2px solid ${rightColor}55`,
            borderRight: `5px solid ${rightColor}`,
            borderRadius: '16px',
            padding: '24px',
            transform: `translateX(${(1 - rightSpring) * 30}px)`,
            opacity: rightSpring,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div style={{ fontSize: '18px', fontWeight: 900, color: rightColor, marginBottom: '8px' }}>
            {rightHeadline}
          </div>
          <div style={{ fontSize: '13px', fontWeight: 500, color: textColor, lineHeight: 1.4 }}>
            {rightBody}
          </div>
        </div>
      </div>
    </div>
  );
};
