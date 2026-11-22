import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export type SuperChatTier = 'blue' | 'cyan' | 'yellow' | 'orange' | 'magenta' | 'red';

export interface SuperChatAnimationProps {
  sender?: string;
  avatarUrl?: string;
  amount?: string;
  message?: string;
  tier?: SuperChatTier;
  pinDurationMinutes?: number;
  delay?: number;
  width?: number | string;
  height?: number;
}

const TIER_COLORS: Record<SuperChatTier, { header: string; body: string; text: string }> = {
  blue: { header: '#1565c0', body: '#0d47a1', text: '#ffffff' },
  cyan: { header: '#00838f', body: '#006064', text: '#ffffff' },
  yellow: { header: '#ffb300', body: '#ff8f00', text: '#000000' },
  orange: { header: '#e65100', body: '#bf360c', text: '#ffffff' },
  magenta: { header: '#c2185b', body: '#880e4f', text: '#ffffff' },
  red: { header: '#d32f2f', body: '#b71c1c', text: '#ffffff' },
};

/**
 * SuperChatAnimation — YouTube Super Chat highlight card.
 * Authentic YouTube Super Chat banner with customizable tier styling,
 * sender avatar, pinned status, and message block.
 */
export function SuperChatAnimation({
  sender = 'Liam Chen',
  avatarUrl = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
  amount = '$20.00',
  message = 'Congratulations on hitting 100k subscribers! Best Remotion creator on YouTube.',
  tier = 'orange',
  pinDurationMinutes = 10,
  delay = 0,
  width = 440,
  height = 140,
}: SuperChatAnimationProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const intro = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  const colors = TIER_COLORS[tier] || TIER_COLORS.orange;

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 16px 32px rgba(0,0,0,0.85)',
        opacity: intro,
        transform: `translateY(${interpolate(intro, [0, 1], [20, 0])}px)`,
        fontFamily: 'Roboto, Inter, system-ui, sans-serif',
      }}
    >
      {/* Super Chat Top Header */}
      <div
        style={{
          background: colors.header,
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img
            src={avatarUrl}
            alt={sender}
            style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
          />
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: colors.text }}>
              {sender}
            </div>
            <div style={{ fontSize: 10, color: colors.text, opacity: 0.8 }}>
              Pinned for {pinDurationMinutes} min
            </div>
          </div>
        </div>

        <div style={{ fontSize: 16, fontWeight: 900, color: colors.text }}>
          {amount}
        </div>
      </div>

      {/* Super Chat Message Body */}
      <div
        style={{
          flex: 1,
          background: colors.body,
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div style={{ fontSize: 13, color: '#ffffff', lineHeight: 1.35, fontWeight: 500 }}>
          {message}
        </div>
      </div>
    </div>
  );
}
