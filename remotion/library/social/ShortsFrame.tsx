import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface ShortsFrameProps {
  channelName?: string;
  avatarUrl?: string;
  title?: string;
  soundTitle?: string;
  likeCount?: string;
  commentCount?: string;
  accentColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * ShortsFrame — Authentic YouTube Shorts 9:16 vertical overlay simulator.
 * Native right-side engagement actions, channel subscribe pill,
 * and audio attribution.
 */
export function ShortsFrame({
  channelName = '@ItnavideoCreators',
  avatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  title = 'How top YouTubers edit 10x faster using Remotion #shorts',
  soundTitle = 'Trending Sound — Itnavideo Original',
  likeCount = '89.4K',
  commentCount = '2,490',
  accentColor = '#ff0000',
  delay = 0,
  width = 340,
  height = 600,
}: ShortsFrameProps) {
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
        padding: '20px 14px',
        boxSizing: 'border-box',
        borderRadius: 28,
        border: '1.5px solid rgba(255, 255, 255, 0.15)',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 25%, rgba(0,0,0,0.85) 85%)',
        boxShadow: '0 24px 48px rgba(0,0,0,0.9)',
        overflow: 'hidden',
        opacity: intro,
        fontFamily: 'Roboto, Inter, system-ui, sans-serif',
      }}
    >
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="22" height="16" viewBox="0 0 24 24" fill={accentColor}>
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          <span style={{ fontSize: 16, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em' }}>
            Shorts
          </span>
        </div>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>

      {/* Bottom Area */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        {/* Left Side: Channel & Title */}
        <div style={{ flex: 1, paddingRight: 10 }}>
          {/* Channel Info & Subscribe */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <img
              src={avatarUrl}
              alt={channelName}
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#ffffff' }}>
              {channelName}
            </span>
            <div
              style={{
                padding: '5px 12px',
                borderRadius: 9999,
                background: '#ffffff',
                color: '#000000',
                fontSize: 11,
                fontWeight: 800,
              }}
            >
              Subscribe
            </div>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: 12,
              color: '#ffffff',
              lineHeight: 1.35,
              marginBottom: 8,
              textShadow: '0 1px 4px rgba(0,0,0,0.8)',
            }}
          >
            {title}
          </div>

          {/* Audio Link */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
            <span style={{ fontSize: 11, color: '#e2e8f0' }}>{soundTitle}</span>
          </div>
        </div>

        {/* Right Side Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          {/* Like */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
            </svg>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#ffffff', marginTop: 2 }}>{likeCount}</span>
          </div>

          {/* Dislike */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
              <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3" />
            </svg>
            <span style={{ fontSize: 10, color: '#ffffff', marginTop: 2 }}>Dislike</span>
          </div>

          {/* Comments */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#ffffff', marginTop: 2 }}>{commentCount}</span>
          </div>

          {/* Share */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
            <span style={{ fontSize: 10, color: '#ffffff', marginTop: 2 }}>Share</span>
          </div>
        </div>
      </div>
    </div>
  );
}
