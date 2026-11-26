import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface MilestoneItem {
  numberText: string;
  label: string;
  achievedDate?: string;
  celebrationEmoji?: string;
  color?: string;
}

export interface MilestoneProps {
  title?: string;
  subtitle?: string;
  milestones?: MilestoneItem[];
  width?: number | string;
  theme?: 'dark' | 'light';
  delayFrames?: number;
  style?: React.CSSProperties;
}

const DEFAULT_MILESTONES: MilestoneItem[] = [
  { numberText: '100,000+', label: 'Videos Rendered on Cloud', achievedDate: 'Verified 2026', celebrationEmoji: '🚀', color: '#0066FF' },
  { numberText: '99.8%', label: 'Transcription Accuracy (Groq)', achievedDate: 'Whisper Large v3', celebrationEmoji: '🎯', color: '#10B981' },
  { numberText: '< 60s', label: 'Average Lambda Render Time', achievedDate: 'Distributed AWS Lambda', celebrationEmoji: '⚡', color: '#F59E0B' },
  { numberText: '15 Active', label: 'Video Creation Studios', achievedDate: '16:9 & 9:16 Formats', celebrationEmoji: '🏆', color: '#8B5CF6' },
];

export const Milestone: React.FC<MilestoneProps> = ({
  title = 'Platform Achievements & Milestones',
  subtitle = 'Demonstrated performance metrics & benchmarks',
  milestones = DEFAULT_MILESTONES,
  width = '100%',
  theme = 'dark',
  delayFrames = 5,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isDark = theme === 'dark';
  const bgColor = 'transparent';
  const cardBg = isDark ? 'rgba(30, 41, 59, 0.42)' : 'rgba(15, 23, 42, 0.04)';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';
  const borderColor = isDark ? '#334155' : '#E2E8F0';

  const items = milestones && milestones.length > 0 ? milestones : DEFAULT_MILESTONES;

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

      {/* 2x2 or 4-grid of milestone cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {items.map((m, idx) => {
          const mSpring = spring({
            frame: Math.max(0, frame - delayFrames - idx * 4),
            fps,
            config: { damping: 12, stiffness: 100 },
          });

          const mColor = m.color || '#0066FF';

          return (
            <div
              key={idx}
              style={{
                backgroundColor: cardBg,
                border: 'none',
                borderRadius: '18px',
                padding: '20px',
                textAlign: 'center',
                boxShadow: `0 8px 24px ${mColor}22`,
                transform: `scale(${mSpring}) translateY(${(1 - mSpring) * 20}px)`,
                opacity: mSpring,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Emoji Icon */}
              {m.celebrationEmoji && (
                <div style={{ fontSize: '26px', marginBottom: '8px' }}>
                  {m.celebrationEmoji}
                </div>
              )}

              {/* Bold Number Text */}
              <div
                style={{
                  fontSize: '26px',
                  fontWeight: 900,
                  color: mColor,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.1,
                }}
              >
                {m.numberText}
              </div>

              {/* Label */}
              <div style={{ fontSize: '13px', fontWeight: 700, color: textColor, marginTop: '8px', lineHeight: 1.3 }}>
                {m.label}
              </div>

              {/* Achieved Badge */}
              {m.achievedDate && (
                <div style={{ fontSize: '11px', fontWeight: 500, color: textMuted, marginTop: '4px' }}>
                  {m.achievedDate}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
