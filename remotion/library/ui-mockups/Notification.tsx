import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface NotificationProps {
  appName?: string;
  appIcon?: string;
  title?: string;
  message?: string;
  timeText?: string;
  theme?: 'dark' | 'light';
  delayFrames?: number;
  style?: React.CSSProperties;
}

export const Notification: React.FC<NotificationProps> = ({
  appName = 'Itnavideo Studio',
  appIcon = '🎬',
  title = 'Render Completed Successfully',
  message = 'Your 9:16 vertical short is ready for download in 1080p.',
  timeText = 'now',
  theme = 'dark',
  delayFrames = 5,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isDark = theme === 'dark';
  const bgColor = isDark ? 'rgba(30, 41, 59, 0.92)' : 'rgba(255, 255, 255, 0.95)';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';
  const borderColor = isDark ? '#334155' : '#E2E8F0';

  const toastSpring = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'flex-start',
        gap: '14px',
        backgroundColor: bgColor,
        backdropFilter: 'blur(16px)',
        border: `1px solid ${borderColor}`,
        borderRadius: '18px',
        padding: '16px 20px',
        maxWidth: '380px',
        boxShadow: isDark ? '0 12px 36px rgba(0,0,0,0.5)' : '0 8px 30px rgba(0,0,0,0.1)',
        boxSizing: 'border-box',
        fontFamily: 'Inter, system-ui, sans-serif',
        transform: `translateY(${(1 - toastSpring) * -30}px) scale(${toastSpring})`,
        opacity: toastSpring,
        ...style,
      }}
    >
      {/* App Icon */}
      <div
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          backgroundColor: '#0066FF22',
          border: '1px solid #0066FF55',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          flexShrink: 0,
        }}
      >
        {appIcon}
      </div>

      {/* Message Body */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#0066FF', textTransform: 'uppercase' }}>
            {appName}
          </span>
          <span style={{ fontSize: '10px', fontWeight: 500, color: textMuted }}>
            {timeText}
          </span>
        </div>
        <div style={{ fontSize: '13px', fontWeight: 800, color: textColor, marginTop: '2px' }}>
          {title}
        </div>
        <div style={{ fontSize: '12px', fontWeight: 500, color: textMuted, marginTop: '2px', lineHeight: 1.35 }}>
          {message}
        </div>
      </div>
    </div>
  );
};
