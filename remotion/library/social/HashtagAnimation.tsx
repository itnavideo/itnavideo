import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface TrendingHashtag {
  tag: string;
  postsCount: string;
  rank?: number;
  trending?: boolean;
}

export interface HashtagAnimationProps {
  headline?: string;
  hashtags?: TrendingHashtag[];
  accentColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

const DEFAULT_HASHTAGS: TrendingHashtag[] = [
  { tag: '#VideoEditing', postsCount: '1.8M Posts', rank: 1, trending: true },
  { tag: '#Remotion', postsCount: '450K Posts', rank: 2, trending: true },
  { tag: '#ContentCreator', postsCount: '8.2M Posts', rank: 3 },
  { tag: '#AIAutomation', postsCount: '920K Posts' },
];

/**
 * HashtagAnimation — Viral trending hashtag pills with rank badges and post volume.
 */
export function HashtagAnimation({
  headline = 'TRENDING CREATOR HASHTAGS',
  hashtags = DEFAULT_HASHTAGS,
  accentColor = '#38bdf8',
  delay = 0,
  width = 440,
  height = 180,
}: HashtagAnimationProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const intro = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '16px 20px',
        boxSizing: 'border-box',
        background: '#09090b',
        borderRadius: 20,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 16px 32px rgba(0,0,0,0.7)',
        opacity: intro,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Title */}
      <div style={{ fontSize: 11, fontWeight: 800, color: accentColor, letterSpacing: '0.12em' }}>
        {headline}
      </div>

      {/* Hashtag Cloud Pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, margin: '8px 0' }}>
        {hashtags.map((item, idx) => {
          const itemSpr = spring({
            frame: Math.max(0, t - 6 - idx * 4),
            fps,
            config: { damping: 14, stiffness: 95 },
          });

          return (
            <div
              key={item.tag}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 9999,
                background: item.trending ? `${accentColor}18` : 'rgba(255, 255, 255, 0.04)',
                border: item.trending ? `1px solid ${accentColor}55` : '1px solid rgba(255, 255, 255, 0.08)',
                opacity: itemSpr,
                transform: `scale(${interpolate(itemSpr, [0, 1], [0.85, 1])})`,
              }}
            >
              {item.rank && (
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 900,
                    color: item.trending ? accentColor : '#94a3b8',
                  }}
                >
                  #{item.rank}
                </span>
              )}
              <span style={{ fontSize: 12, fontWeight: 700, color: '#ffffff' }}>
                {item.tag}
              </span>
              <span style={{ fontSize: 10, color: '#64748b' }}>
                ({item.postsCount})
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div style={{ fontSize: 10, color: '#64748b' }}>
        REAL-TIME ALGORITHMIC BOOST FACTOR: 2.8X
      </div>
    </div>
  );
}
