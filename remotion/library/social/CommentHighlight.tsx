import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface CommentHighlightProps {
  author?: string;
  avatarUrl?: string;
  timeAgo?: string;
  commentText?: string;
  creatorName?: string;
  creatorAvatarUrl?: string;
  likeCount?: string;
  accentColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * CommentHighlight — Featured spotlight viewer comment.
 * Golden pinned pin, highlighted accent border, and creator heart reaction avatar badge.
 */
export function CommentHighlight({
  author = 'Sarah Jenkins',
  avatarUrl = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
  timeAgo = '1 day ago',
  commentText = 'This single workflow cut my YouTube editing time down by 80%. Never going back to manual keyframing!',
  creatorName = 'Itnavideo Studio',
  creatorAvatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  likeCount = '428',
  accentColor = '#f59e0b',
  delay = 0,
  width = 460,
  height = 160,
}: CommentHighlightProps) {
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
        border: `1.5px solid ${accentColor}66`,
        boxShadow: `0 16px 32px rgba(0,0,0,0.8), 0 0 20px ${accentColor}18`,
        opacity: intro,
        transform: `translateY(${interpolate(intro, [0, 1], [15, 0])}px)`,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Pinned By Creator Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill={accentColor}>
          <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
        </svg>
        <span style={{ fontSize: 10, fontWeight: 700, color: accentColor, letterSpacing: '0.08em' }}>
          PINNED BY {creatorName.toUpperCase()}
        </span>
      </div>

      {/* Comment Body & Author */}
      <div style={{ display: 'flex', gap: 12 }}>
        <img
          src={avatarUrl}
          alt={author}
          style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#ffffff' }}>{author}</span>
            <span style={{ fontSize: 11, color: '#64748b' }}>{timeAgo}</span>
          </div>
          <div style={{ fontSize: 12, color: '#e2e8f0', marginTop: 3, lineHeight: 1.35 }}>
            {commentText}
          </div>
        </div>
      </div>

      {/* Bottom Row: Likes & Creator Heart */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
          </svg>
          <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>{likeCount}</span>
        </div>

        {/* Creator Loved Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(239, 68, 68, 0.1)',
            padding: '3px 8px',
            borderRadius: 9999,
            border: '1px solid rgba(239, 68, 68, 0.25)',
          }}
        >
          <img
            src={creatorAvatarUrl}
            alt="Creator"
            style={{ width: 16, height: 16, borderRadius: '50%', objectFit: 'cover' }}
          />
          <span style={{ fontSize: 11 }}>❤️</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#f87171' }}>Loved</span>
        </div>
      </div>
    </div>
  );
}
