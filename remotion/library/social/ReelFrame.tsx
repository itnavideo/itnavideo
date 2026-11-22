import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface ReelFrameProps {
  handle?: string;
  avatarUrl?: string;
  caption?: string;
  audioTrack?: string;
  likeCount?: string;
  commentCount?: string;
  shareCount?: string;
  isFollowing?: boolean;
  accentColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * ReelFrame — Authentic Instagram Reels 9:16 mobile overlay simulator.
 * Features right-hand vertical engagement stack (Like, Comment, Share, Audio Disc),
 * audio ticker, follow badge, and caption card.
 */
export function ReelFrame({
  handle = 'itnavideo.ai',
  avatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  caption = 'Turn your long podcasts into viral clips in 60 seconds 🚀 #contentcreator #ai',
  audioTrack = 'Original Audio — itnavideo.ai',
  likeCount = '48.2K',
  commentCount = '1,320',
  shareCount = '12.8K',
  isFollowing = false,
  accentColor = '#e1306c',
  delay = 0,
  width = 340,
  height = 600,
}: ReelFrameProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const intro = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  // Audio disc spin
  const discRot = (t * 4) % 360;

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '20px 14px',
        boxSizing: 'border-box',
        borderRadius: 28,
        border: '1.5px solid rgba(255, 255, 255, 0.15)',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 25%, rgba(0,0,0,0.8) 85%)',
        boxShadow: '0 24px 48px rgba(0,0,0,0.9)',
        overflow: 'hidden',
        opacity: intro,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 16, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em' }}>
          Reels
        </div>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
          <circle cx="12" cy="12" r="1" />
          <circle cx="19" cy="12" r="1" />
          <circle cx="5" cy="12" r="1" />
        </svg>
      </div>

      {/* Main Bottom Section */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        {/* Left Side: Creator Bio & Audio */}
        <div style={{ flex: 1, paddingRight: 12 }}>
          {/* Creator Profile & Follow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <img
              src={avatarUrl}
              alt={handle}
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                border: '1.5px solid #ffffff',
                objectFit: 'cover',
              }}
            />
            <span style={{ fontSize: 13, fontWeight: 800, color: '#ffffff' }}>
              @{handle}
            </span>
            <div
              style={{
                padding: '3px 10px',
                borderRadius: 6,
                border: '1px solid rgba(255,255,255,0.4)',
                fontSize: 11,
                fontWeight: 700,
                color: '#ffffff',
              }}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </div>
          </div>

          {/* Caption */}
          <div
            style={{
              fontSize: 12,
              color: '#ffffff',
              lineHeight: 1.35,
              marginBottom: 10,
              textShadow: '0 1px 4px rgba(0,0,0,0.8)',
            }}
          >
            {caption}
          </div>

          {/* Audio Ticker Marquee */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
            <span style={{ fontSize: 11, color: '#e2e8f0', fontWeight: 500 }}>
              {audioTrack}
            </span>
          </div>
        </div>

        {/* Right Side: Engagement Action Stack */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          {/* Like */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#ffffff', marginTop: 2 }}>{likeCount}</span>
          </div>

          {/* Comment */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#ffffff', marginTop: 2 }}>{commentCount}</span>
          </div>

          {/* Share */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#ffffff', marginTop: 2 }}>{shareCount}</span>
          </div>

          {/* Spinning Audio Album Disc */}
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              background: '#09090b',
              border: '2px solid #ffffff',
              transform: `rotate(${discRot}deg)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.6)',
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: accentColor }} />
          </div>
        </div>
      </div>
    </div>
  );
}
