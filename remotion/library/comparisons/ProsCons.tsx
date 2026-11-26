import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface ProsConsProps {
  title?: string;
  subtitle?: string;
  topic?: string;
  pros?: string[];
  cons?: string[];
  width?: number | string;
  theme?: 'dark' | 'light';
  delayFrames?: number;
  style?: React.CSSProperties;
}

const DEFAULT_PROS = [
  'Immediate viral hook retention & pacing',
  'Automated multi-accent Groq Whisper STT',
  'Cost-effective: 1 credit per minute export',
  'Scalable: Render dozens in parallel on Lambda',
];

const DEFAULT_CONS = [
  'Requires internet connection for cloud render',
  'Free tier includes anti-crop brand watermark',
  'Creative direction guided by AI scene logic',
];

export const ProsCons: React.FC<ProsConsProps> = ({
  title = 'Critical Trade-Off Evaluation',
  subtitle = 'Objective analysis of core advantages and considerations',
  topic = 'Cloud AI Video Production',
  pros = DEFAULT_PROS,
  cons = DEFAULT_CONS,
  width = '100%',
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

  const prosSpring = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  const consSpring = spring({
    frame: Math.max(0, frame - delayFrames - 6),
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  return (
    <div
      style={{
        width,
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
        <div style={{ marginBottom: '20px' }}>
          {title && <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: textColor }}>{title}</h3>}
          {subtitle && <p style={{ margin: '4px 0 0 0', fontSize: '13px', fontWeight: 500, color: textMuted }}>{subtitle}</p>}
        </div>
      )}

      {/* Grid: Pros vs Cons */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
        {/* PROS (Green) */}
        <div
          style={{
            backgroundColor: isDark ? 'rgba(16, 185, 129, 0.08)' : 'rgba(16, 185, 129, 0.04)',
            border: '2px solid rgba(16, 185, 129, 0.4)',
            borderRadius: '18px',
            padding: '22px',
            transform: `scale(${prosSpring}) translateY(${(1 - prosSpring) * 15}px)`,
            opacity: prosSpring,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <span style={{ fontSize: '18px' }}>🟢</span>
            <span style={{ fontSize: '16px', fontWeight: 900, color: '#10B981', textTransform: 'uppercase' }}>
              Advantages & Pros
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {pros.map((p, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: textColor }}>
                <span style={{ color: '#10B981', fontWeight: 900 }}>+</span>
                <span style={{ fontWeight: 600, lineHeight: 1.3 }}>{p}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CONS (Orange/Red) */}
        <div
          style={{
            backgroundColor: isDark ? 'rgba(239, 68, 68, 0.08)' : 'rgba(239, 68, 68, 0.04)',
            border: '2px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '18px',
            padding: '22px',
            transform: `scale(${consSpring}) translateY(${(1 - consSpring) * 15}px)`,
            opacity: consSpring,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <span style={{ fontSize: '18px' }}>🔴</span>
            <span style={{ fontSize: '16px', fontWeight: 900, color: '#EF4444', textTransform: 'uppercase' }}>
              Considerations & Cons
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {cons.map((c, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: textColor }}>
                <span style={{ color: '#EF4444', fontWeight: 900 }}>−</span>
                <span style={{ fontWeight: 500, lineHeight: 1.3 }}>{c}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
