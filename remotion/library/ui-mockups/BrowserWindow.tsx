import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface BrowserWindowProps {
  url?: string;
  title?: string;
  children?: React.ReactNode;
  width?: number | string;
  height?: number | string;
  theme?: 'dark' | 'light';
  delayFrames?: number;
  style?: React.CSSProperties;
}

export const BrowserWindow: React.FC<BrowserWindowProps> = ({
  url = 'https://www.itnavideo.com/dashboard/faceless-video',
  title = 'Itnavideo Studio — AI Video Creation Platform',
  children,
  width = '100%',
  height = 380,
  theme = 'dark',
  delayFrames = 5,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isDark = theme === 'dark';
  const bgColor = isDark ? '#111827' : '#FFFFFF';
  const barBg = isDark ? '#090D16' : '#F1F5F9';
  const inputBg = isDark ? '#1F2937' : '#FFFFFF';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';
  const borderColor = isDark ? '#374151' : '#E2E8F0';

  const windowSpring = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: '18px',
        overflow: 'hidden',
        boxShadow: isDark ? '0 24px 60px rgba(0,0,0,0.6)' : '0 16px 40px rgba(0,0,0,0.12)',
        boxSizing: 'border-box',
        fontFamily: 'Inter, system-ui, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        transform: `scale(${windowSpring}) translateY(${(1 - windowSpring) * 20}px)`,
        opacity: windowSpring,
        ...style,
      }}
    >
      {/* Chrome Top Bar */}
      <div
        style={{
          height: '44px',
          backgroundColor: barBg,
          borderBottom: `1px solid ${borderColor}`,
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          gap: '14px',
          flexShrink: 0,
        }}
      >
        {/* macOS Traffic Light Dots */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10B981' }} />
        </div>

        {/* Address Bar */}
        <div
          style={{
            flex: 1,
            height: '28px',
            backgroundColor: inputBg,
            border: `1px solid ${borderColor}`,
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            padding: '0 12px',
            gap: '8px',
            fontSize: '12px',
            color: textMuted,
            maxWidth: '520px',
            margin: '0 auto',
          }}
        >
          <span style={{ fontSize: '11px', color: '#10B981' }}>🔒</span>
          <span style={{ color: textColor, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {url}
          </span>
        </div>
      </div>

      {/* Content Canvas */}
      <div
        style={{
          flex: 1,
          padding: '24px',
          overflow: 'auto',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children || (
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: textColor }}>
              {title}
            </h4>
            <p style={{ margin: '6px 0 0 0', fontSize: '13px', fontWeight: 500, color: textMuted }}>
              High-performance automated video creation interface
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
