import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface HistoryEvent {
  year: string | number;
  headline: string;
  narrative: string;
  tag?: string;
  color?: string;
}

export interface HistoryTimelineProps {
  title?: string;
  subtitle?: string;
  history?: HistoryEvent[];
  width?: number | string;
  theme?: 'dark' | 'light';
  delayFrames?: number;
  style?: React.CSSProperties;
}

const DEFAULT_HISTORY: HistoryEvent[] = [
  { year: '2016', headline: 'Manual Non-Linear Video Editing', narrative: 'Creators spend 6-8 hours keyframing subtitles and editing in Premiere Pro', tag: 'Traditional', color: '#64748B' },
  { year: '2020', headline: 'First Wave Speech-to-Text', narrative: 'Automated subtitles emerge, but manual synchronization and timing drift remain issues', tag: 'Gen 1', color: '#2563EB' },
  { year: '2024', headline: 'Groq Whisper & Remotion Code', narrative: 'Sub-second word timestamps and programmatic 30fps cloud rendering arrive', tag: 'Modern', color: '#0066FF' },
  { year: '2026+', headline: 'Itnavideo Autonomous Studios', narrative: 'Complete studio-quality 16:9 & 9:16 videos created from a single script in under 2 minutes', tag: 'Future', color: '#10B981' },
];

export const HistoryTimeline: React.FC<HistoryTimelineProps> = ({
  title = 'Historical Evolution & Milestone Shifts',
  subtitle = 'The transformation from manual desktop editing to cloud AI',
  history = DEFAULT_HISTORY,
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

  const items = history && history.length > 0 ? history : DEFAULT_HISTORY;

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
        <div style={{ marginBottom: '24px' }}>
          {title && <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: textColor }}>{title}</h3>}
          {subtitle && <p style={{ margin: '4px 0 0 0', fontSize: '13px', fontWeight: 500, color: textMuted }}>{subtitle}</p>}
        </div>
      )}

      {/* History Rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {items.map((item, idx) => {
          const itemSpring = spring({
            frame: Math.max(0, frame - delayFrames - idx * 5),
            fps,
            config: { damping: 14, stiffness: 90 },
          });

          const itemColor = item.color || '#0066FF';

          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '20px',
                padding: '16px 20px',
                backgroundColor: cardBg,
                border: 'none',
                borderRadius: '16px',
                transform: `translateX(${(1 - itemSpring) * -20}px)`,
                opacity: itemSpring,
              }}
            >
              {/* Year Stamp */}
              <div
                style={{
                  padding: '6px 14px',
                  borderRadius: '10px',
                  backgroundColor: `${itemColor}22`,
                  border: `1.5px solid ${itemColor}`,
                  color: itemColor,
                  fontSize: '16px',
                  fontWeight: 900,
                  flexShrink: 0,
                  textAlign: 'center',
                }}
              >
                {item.year}
              </div>

              {/* Narrative Content */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '15px', fontWeight: 800, color: textColor }}>
                    {item.headline}
                  </span>
                  {item.tag && (
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                        color: textMuted,
                        fontSize: '10px',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                      }}
                    >
                      {item.tag}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '12px', fontWeight: 500, color: textMuted, marginTop: '4px', lineHeight: 1.4 }}>
                  {item.narrative}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
