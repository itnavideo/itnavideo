import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface SocialProofBadgeProps {
  headline?: string;
  ratingScore?: string;
  reviewCount?: string;
  platform?: string;
  avatars?: string[];
  accentColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

const DEFAULT_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
];

/**
 * SocialProofBadge — High-credibility trust & social validation card.
 * Overlapping avatar stacks, 5-star trust score, and verified creator count.
 */
export function SocialProofBadge({
  headline = 'JOIN OVER 150,000+ CREATORS',
  ratingScore = '4.9/5',
  reviewCount = '12,400+ 5-Star Reviews',
  platform = 'Trustpilot & ProductHunt Verified',
  avatars = DEFAULT_AVATARS,
  accentColor = '#f59e0b',
  delay = 0,
  width = 380,
  height = 110,
}: SocialProofBadgeProps) {
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
        alignItems: 'center',
        gap: 16,
        padding: '16px 20px',
        boxSizing: 'border-box',
        background: '#09090b',
        borderRadius: 20,
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 16px 32px rgba(0,0,0,0.7)',
        opacity: intro,
        transform: `translateY(${interpolate(intro, [0, 1], [15, 0])}px)`,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Avatar Stack */}
      <div style={{ display: 'flex', position: 'relative', width: 88, height: 40, flexShrink: 0 }}>
        {avatars.map((url, i) => (
          <img
            key={i}
            src={url}
            alt="User Avatar"
            style={{
              position: 'absolute',
              left: i * 18,
              top: 0,
              width: 38,
              height: 38,
              borderRadius: '50%',
              border: '2px solid #09090b',
              objectFit: 'cover',
            }}
          />
        ))}
      </div>

      {/* Trust Details */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {/* 5 Gold Stars */}
          <div style={{ display: 'flex', gap: 2 }}>
            {[...Array(5)].map((_, idx) => (
              <svg key={idx} width="13" height="13" viewBox="0 0 24 24" fill={accentColor}>
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
          </div>
          <span style={{ fontSize: 12, fontWeight: 800, color: '#ffffff' }}>
            {ratingScore}
          </span>
        </div>

        <div style={{ fontSize: 12, fontWeight: 700, color: '#f1f5f9', marginTop: 3 }}>
          {headline}
        </div>
        <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 1 }}>
          {reviewCount} • {platform}
        </div>
      </div>
    </div>
  );
}
