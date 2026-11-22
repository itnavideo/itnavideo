import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface RankingItem {
  rank: number;
  title: string;
  metric?: string;
  badge?: string;
  color?: string;
}

export interface RankingListProps {
  title?: string;
  subtitle?: string;
  rankings?: RankingItem[];
  width?: number | string;
  theme?: 'dark' | 'light';
  delayFrames?: number;
  style?: React.CSSProperties;
}

const DEFAULT_RANKINGS: RankingItem[] = [
  { rank: 1, title: 'Groq Whisper large-v3-turbo', metric: '99.8% Accuracy', badge: '🥇 Gold', color: '#F59E0B' },
  { rank: 2, title: 'AWS Lambda Chromium Headless', metric: '< 60s Render', badge: '🥈 Silver', color: '#94A3B8' },
  { rank: 3, title: 'Kinetic Karaoke Highlight Engine', metric: '32 Styles', badge: '🥉 Bronze', color: '#CD7F32' },
  { rank: 4, title: 'Smart Visual B-Roll Matcher', metric: 'S3 Pool', color: '#0066FF' },
  { rank: 5, title: 'Audio Cleaner & De-Esser', metric: '-36dB Noise', color: '#10B981' },
];

export const RankingList: React.FC<RankingListProps> = ({
  title = 'Top Tier Ranking Leaderboard',
  subtitle = 'Ranked list by measured viral performance',
  rankings = DEFAULT_RANKINGS,
  width = '100%',
  theme = 'dark',
  delayFrames = 5,
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

  const items = rankings && rankings.length > 0 ? rankings : DEFAULT_RANKINGS;

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
        ...style,
      }}
    >
      {(title || subtitle) && (
        <div style={{ marginBottom: '22px' }}>
          {title && <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: textColor }}>{title}</h3>}
          {subtitle && <p style={{ margin: '4px 0 0 0', fontSize: '13px', fontWeight: 500, color: textMuted }}>{subtitle}</p>}
        </div>
      )}

      {/* Rankings Stack */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {items.map((item, idx) => {
          const rankSpring = spring({
            frame: Math.max(0, frame - delayFrames - idx * 4),
            fps,
            config: { damping: 14, stiffness: 95 },
          });

          const rankColor = item.color || (idx === 0 ? '#F59E0B' : idx === 1 ? '#94A3B8' : idx === 2 ? '#CD7F32' : '#0066FF');

          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '14px 18px',
                backgroundColor: cardBg,
                border: `1.5px solid ${idx === 0 ? '#F59E0B' : borderColor}`,
                borderRadius: '16px',
                boxShadow: idx === 0 ? '0 4px 20px rgba(245, 158, 11, 0.25)' : undefined,
                transform: `translateX(${(1 - rankSpring) * -20}px)`,
                opacity: rankSpring,
              }}
            >
              {/* Rank Position Pill */}
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: `${rankColor}22`,
                  border: `2px solid ${rankColor}`,
                  color: rankColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '15px',
                  fontWeight: 900,
                  flexShrink: 0,
                }}
              >
                #{item.rank}
              </div>

              {/* Title & Badge */}
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '14px', fontWeight: 800, color: textColor }}>
                  {item.title}
                </span>
                {item.badge && (
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      backgroundColor: `${rankColor}22`,
                      color: rankColor,
                      fontSize: '11px',
                      fontWeight: 800,
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Metric Callout */}
              {item.metric && (
                <div style={{ fontSize: '13px', fontWeight: 800, color: rankColor, flexShrink: 0 }}>
                  {item.metric}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
