import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface BeforeAfterProps {
  title?: string;
  subtitle?: string;
  beforeHeadline?: string;
  beforePoints?: string[];
  afterHeadline?: string;
  afterPoints?: string[];
  width?: number | string;
  theme?: 'dark' | 'light';
  delayFrames?: number;
  style?: React.CSSProperties;
}

const DEFAULT_BEFORE_POINTS = [
  '6-8 hours stuck editing in Premiere',
  'Manual word typing & subtitle sync errors',
  'Laptop fan screaming at 100% CPU',
  'Inconsistent retention cuts & pacing',
];

const DEFAULT_AFTER_POINTS = [
  'Rendered in under 60s on AWS Lambda',
  'Automated Groq Whisper word timing',
  'Zero local compute / 0% RAM usage',
  '32 battle-tested viral karaoke styles',
];

export const BeforeAfter: React.FC<BeforeAfterProps> = ({
  title = 'The Transformation Paradigm',
  subtitle = 'Immediate contrast: Old manual struggle vs Autonomous AI',
  beforeHeadline = 'BEFORE: Manual Desktop Work',
  beforePoints = DEFAULT_BEFORE_POINTS,
  afterHeadline = 'AFTER: Itnavideo Cloud Studio',
  afterPoints = DEFAULT_AFTER_POINTS,
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

  const beforeSpring = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  const afterSpring = spring({
    frame: Math.max(0, frame - delayFrames - 8),
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
        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
          {title && <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: textColor }}>{title}</h3>}
          {subtitle && <p style={{ margin: '4px 0 0 0', fontSize: '13px', fontWeight: 500, color: textMuted }}>{subtitle}</p>}
        </div>
      )}

      {/* Side-by-side Dual Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
        {/* BEFORE CARD */}
        <div
          style={{
            backgroundColor: isDark ? 'rgba(239, 68, 68, 0.08)' : 'rgba(239, 68, 68, 0.05)',
            border: '2px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '18px',
            padding: '24px',
            transform: `scale(${beforeSpring}) translateY(${(1 - beforeSpring) * 15}px)`,
            opacity: beforeSpring,
          }}
        >
          <div
            style={{
              display: 'inline-block',
              padding: '4px 10px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              color: '#EF4444',
              fontSize: '11px',
              fontWeight: 900,
              textTransform: 'uppercase',
              marginBottom: '10px',
            }}
          >
            Old Way
          </div>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#EF4444', marginBottom: '16px' }}>
            {beforeHeadline}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {beforePoints.map((point, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: textColor }}>
                <span style={{ color: '#EF4444', fontWeight: 900 }}>✕</span>
                <span style={{ fontWeight: 500, lineHeight: 1.3 }}>{point}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AFTER CARD */}
        <div
          style={{
            backgroundColor: isDark ? 'rgba(16, 185, 129, 0.08)' : 'rgba(16, 185, 129, 0.05)',
            border: '2px solid rgba(16, 185, 129, 0.6)',
            borderRadius: '18px',
            padding: '24px',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.25)',
            transform: `scale(${afterSpring}) translateY(${(1 - afterSpring) * 15}px)`,
            opacity: afterSpring,
          }}
        >
          <div
            style={{
              display: 'inline-block',
              padding: '4px 10px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              color: '#10B981',
              fontSize: '11px',
              fontWeight: 900,
              textTransform: 'uppercase',
              marginBottom: '10px',
            }}
          >
            ★ AI Transformation
          </div>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#10B981', marginBottom: '16px' }}>
            {afterHeadline}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {afterPoints.map((point, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: textColor }}>
                <span style={{ color: '#10B981', fontWeight: 900 }}>✓</span>
                <span style={{ fontWeight: 600, lineHeight: 1.3 }}>{point}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
