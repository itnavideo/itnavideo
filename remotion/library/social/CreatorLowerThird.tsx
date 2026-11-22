import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface CreatorLowerThirdProps {
  name?: string;
  role?: string;
  youtubeHandle?: string;
  twitterHandle?: string;
  avatarUrl?: string;
  accentColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * CreatorLowerThird — Creator broadcast lower third banner.
 * Displays presenter name, role, YouTube/X social handles, and channel avatar.
 */
export function CreatorLowerThird({
  name = 'David Vance',
  role = 'Founder & Lead Director • Itnavideo',
  youtubeHandle = '@Itnavideo',
  twitterHandle = '@davidvance_ai',
  avatarUrl = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
  accentColor = '#f59e0b',
  delay = 0,
  width = 520,
  height = 90,
}: CreatorLowerThirdProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const slideSpr = spring({
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
        padding: '12px 18px',
        boxSizing: 'border-box',
        background: 'linear-gradient(90deg, rgba(9,9,11,0.95) 0%, rgba(24,24,27,0.95) 70%, rgba(9,9,11,0.7) 100%)',
        borderLeft: `4px solid ${accentColor}`,
        borderRadius: '0 16px 16px 0',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 16px 32px rgba(0,0,0,0.8)',
        transform: `translateX(${interpolate(slideSpr, [0, 1], [-80, 0])}px)`,
        opacity: slideSpr,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Avatar */}
      <img
        src={avatarUrl}
        alt={name}
        style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          border: `2px solid ${accentColor}`,
          objectFit: 'cover',
          flexShrink: 0,
        }}
      />

      {/* Main Details */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16, fontWeight: 900, color: '#ffffff' }}>{name}</span>
          <div style={{ width: 4, height: 4, borderRadius: '50%', background: accentColor }} />
          <span style={{ fontSize: 12, color: accentColor, fontWeight: 700 }}>{youtubeHandle}</span>
        </div>
        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{role}</div>
      </div>

      {/* Social Handle Bug */}
      <div
        style={{
          padding: '4px 10px',
          borderRadius: 8,
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          fontSize: 10,
          fontWeight: 700,
          color: '#cbd5e1',
        }}
      >
        𝕏 {twitterHandle}
      </div>
    </div>
  );
}
