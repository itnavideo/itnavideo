import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface HierarchyLevel {
  levelLabel: string;
  items: { title: string; subtitle?: string; color?: string }[];
}

export interface HierarchyGraphProps {
  title?: string;
  subtitle?: string;
  levels?: HierarchyLevel[];
  width?: number | string;
  theme?: 'dark' | 'light';
  delayFrames?: number;
  style?: React.CSSProperties;
}

const DEFAULT_HIERARCHY_LEVELS: HierarchyLevel[] = [
  {
    levelLabel: 'Level 0: Master Director',
    items: [{ title: 'Autonomous AI Reel Planner', subtitle: 'Scene Direction & Script Pacing', color: '#0066FF' }],
  },
  {
    levelLabel: 'Level 1: Specialized Engines',
    items: [
      { title: 'Transcription Engine', subtitle: 'Groq Whisper large-v3', color: '#10B981' },
      { title: 'Composition Engine', subtitle: 'Remotion React 30fps', color: '#F59E0B' },
      { title: 'Asset S3 Matcher', subtitle: 'High-Retention B-Roll', color: '#8B5CF6' },
    ],
  },
  {
    levelLabel: 'Level 2: Execution Infrastructure',
    items: [
      { title: 'AWS Lambda (us-east-1)', color: '#06B6D4' },
      { title: 'Cloud Run Web Server', color: '#06B6D4' },
      { title: 'Cloudinary Global CDN', color: '#06B6D4' },
    ],
  },
];

export const HierarchyGraph: React.FC<HierarchyGraphProps> = ({
  title = 'System Multi-Tier Hierarchy Graph',
  subtitle = 'Top-down directed acyclic graph (DAG) breakdown',
  levels = DEFAULT_HIERARCHY_LEVELS,
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

  const items = levels && levels.length > 0 ? levels : DEFAULT_HIERARCHY_LEVELS;

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
        <div style={{ marginBottom: '22px' }}>
          {title && <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: textColor }}>{title}</h3>}
          {subtitle && <p style={{ margin: '4px 0 0 0', fontSize: '13px', fontWeight: 500, color: textMuted }}>{subtitle}</p>}
        </div>
      )}

      {/* Levels Stack */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
        {items.map((level, lIdx) => {
          const levelSpring = spring({
            frame: Math.max(0, frame - delayFrames - lIdx * 6),
            fps,
            config: { damping: 14, stiffness: 90 },
          });

          return (
            <div
              key={lIdx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                transform: `scale(${levelSpring}) translateY(${(1 - levelSpring) * 15}px)`,
                opacity: levelSpring,
              }}
            >
              {/* Level Tier Header */}
              <div style={{ fontSize: '11px', fontWeight: 800, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {level.levelLabel}
              </div>

              {/* Level Cards Row */}
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                {level.items.map((card, cIdx) => {
                  const cardColor = card.color || '#0066FF';
                  return (
                    <div
                      key={cIdx}
                      style={{
                        flex: 1,
                        minWidth: '200px',
                        padding: '14px 18px',
                        backgroundColor: cardBg,
                        border: 'none',
                        borderTop: `3px solid ${cardColor}`,
                        borderRadius: '14px',
                        boxShadow: `0 4px 14px ${cardColor}22`,
                      }}
                    >
                      <div style={{ fontSize: '14px', fontWeight: 800, color: textColor }}>
                        {card.title}
                      </div>
                      {card.subtitle && (
                        <div style={{ fontSize: '11px', fontWeight: 500, color: textMuted, marginTop: '2px' }}>
                          {card.subtitle}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
