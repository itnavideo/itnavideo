import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface InstagramStoryFrameProps {
  username?: string;
  avatarUrl?: string;
  timeAgo?: string;
  totalSegments?: number;
  activeSegment?: number;
  swipeUpText?: string;
  accentColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * InstagramStoryFrame — Native 9:16 Instagram Story interface frame.
 * Segmented story progression bars, username header, swipe-up link pill,
 * and bottom direct message bar.
 */
export function InstagramStoryFrame({
  username = 'creatorstudio',
  avatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  timeAgo = '3h',
  totalSegments = 4,
  activeSegment = 1,
  swipeUpText = 'Visit Website ↗',
  accentColor = '#e1306c',
  delay = 0,
  width = 340,
  height = 600,
}: InstagramStoryFrameProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const intro = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  // Active story segment progress (0 to 100%)
  const segmentProgress = Math.min(100, (t / 90) * 100);

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '16px 14px',
        boxSizing: 'border-box',
        borderRadius: 28,
        border: '1.5px solid rgba(255, 255, 255, 0.15)',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 30%, rgba(0,0,0,0.85) 100%)',
        boxShadow: '0 24px 48px rgba(0,0,0,0.9)',
        overflow: 'hidden',
        opacity: intro,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Top Section: Progress Segments & User Header */}
      <div>
        {/* Story Segment Bars */}
        <div style={{ display: 'flex', gap: 4, width: '100%', marginBottom: 12 }}>
          {[...Array(totalSegments)].map((_, i) => {
            const isCompleted = i < activeSegment;
            const isCurrent = i === activeSegment;
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: 2.5,
                  borderRadius: 2,
                  background: 'rgba(255, 255, 255, 0.3)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: isCompleted ? '100%' : isCurrent ? `${segmentProgress}%` : '0%',
                    backgroundColor: '#ffffff',
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* User Info Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img
              src={avatarUrl}
              alt={username}
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                border: `2px solid ${accentColor}`,
                objectFit: 'cover',
              }}
            />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#ffffff' }}>
              {username}
            </span>
            <span style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.6)' }}>
              {timeAgo}
            </span>
          </div>

          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </div>
      </div>

      {/* Middle Interactive Sticker Pill */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div
          style={{
            padding: '8px 18px',
            borderRadius: 9999,
            background: 'rgba(255, 255, 255, 0.95)',
            boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
            color: '#000000',
            fontWeight: 800,
            fontSize: 12,
            letterSpacing: '0.02em',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span>🔗</span>
          <span>{swipeUpText}</span>
        </div>
      </div>

      {/* Bottom Reply Bar & Direct Message Field */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            flex: 1,
            height: 40,
            borderRadius: 9999,
            border: '1px solid rgba(255, 255, 255, 0.4)',
            background: 'rgba(0, 0, 0, 0.4)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            fontSize: 12,
            color: 'rgba(255, 255, 255, 0.7)',
          }}
        >
          Send message...
        </div>

        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>

        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </div>
    </div>
  );
}
