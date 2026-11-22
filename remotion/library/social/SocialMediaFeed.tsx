import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface FeedPost {
  platform: 'youtube' | 'twitter' | 'instagram';
  author: string;
  handle: string;
  content: string;
  timeAgo: string;
  stat: string;
}

export interface SocialMediaFeedProps {
  feedTitle?: string;
  posts?: FeedPost[];
  accentColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

const DEFAULT_POSTS: FeedPost[] = [
  { platform: 'youtube', author: 'Itnavideo Studio', handle: '@itnavideo', content: 'New video: How to render 1,000 reels in AWS Lambda in 3 minutes flat!', timeAgo: '2h ago', stat: '45.2K views' },
  { platform: 'twitter', author: 'Elena Vance', handle: '@elena_edits', content: 'Antigravity + Remotion is the ultimate superpower for AI video creators.', timeAgo: '4h ago', stat: '1.2K likes' },
  { platform: 'instagram', author: 'Creative Motion', handle: '@motion_mag', content: 'Breakdown of the kinetic typography trends taking over 2026.', timeAgo: '6h ago', stat: '8.4K likes' },
];

/**
 * SocialMediaFeed — Multi-platform social stream card.
 * Cross-platform feed displaying dynamic posts from YouTube, X (Twitter), and Instagram.
 */
export function SocialMediaFeed({
  feedTitle = 'LIVE SOCIAL DISCOVERY FEED',
  posts = DEFAULT_POSTS,
  accentColor = '#6366f1',
  delay = 0,
  width = 460,
  height = 360,
}: SocialMediaFeedProps) {
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
        padding: '20px 24px',
        boxSizing: 'border-box',
        background: '#09090b',
        borderRadius: 24,
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
        opacity: intro,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 11, fontWeight: 800, color: accentColor, letterSpacing: '0.12em' }}>
          {feedTitle}
        </span>
        <span style={{ fontSize: 10, color: '#22c55e', fontWeight: 700 }}>● SYNCED</span>
      </div>

      {/* Feed Posts List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, justifyContent: 'center' }}>
        {posts.map((p, idx) => {
          const itemSpr = spring({
            frame: Math.max(0, t - 6 - idx * 5),
            fps,
            config: { damping: 14, stiffness: 90 },
          });

          return (
            <div
              key={idx}
              style={{
                padding: '12px 14px',
                borderRadius: 14,
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                opacity: itemSpr,
                transform: `translateY(${interpolate(itemSpr, [0, 1], [15, 0])}px)`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 12 }}>
                    {p.platform === 'youtube' ? '▶️' : p.platform === 'twitter' ? '𝕏' : '📸'}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#ffffff' }}>{p.author}</span>
                  <span style={{ fontSize: 11, color: '#64748b' }}>{p.handle}</span>
                </div>
                <span style={{ fontSize: 10, color: '#64748b' }}>{p.timeAgo}</span>
              </div>

              <div style={{ fontSize: 12, color: '#cbd5e1', marginTop: 4, lineHeight: 1.35 }}>
                {p.content}
              </div>

              <div style={{ fontSize: 10, color: accentColor, fontWeight: 700, marginTop: 4 }}>
                {p.stat}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
