import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface CreatorProfileIntroProps {
  name?: string;
  handle?: string;
  bio?: string;
  avatarUrl?: string;
  subscribers?: string;
  totalViews?: string;
  nicheBadges?: string[];
  accentColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * CreatorProfileIntro — Cinematic creator channel profile introduction card.
 * High-profile creator hero card with subscriber stats, niche badges, and verified checkmark.
 */
export function CreatorProfileIntro({
  name = 'Alex Morgan',
  handle = '@alexmorgan_creates',
  bio = 'Exploring AI video generation, automated storytelling & computational cinema.',
  avatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  subscribers = '380K Followers',
  totalViews = '45M Views',
  nicheBadges = ['AI Video', 'Creative Tech', 'Remotion'],
  accentColor = '#f59e0b',
  delay = 0,
  width = 480,
  height = 240,
}: CreatorProfileIntroProps) {
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
        padding: '24px 24px',
        boxSizing: 'border-box',
        background: '#09090b',
        borderRadius: 24,
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
        opacity: intro,
        transform: `translateY(${interpolate(intro, [0, 1], [15, 0])}px)`,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Top Section: Avatar, Name & Handles */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <img
          src={avatarUrl}
          alt={name}
          style={{
            width: 58,
            height: 58,
            borderRadius: '50%',
            border: `2px solid ${accentColor}`,
            boxShadow: `0 0 16px ${accentColor}44`,
            objectFit: 'cover',
          }}
        />

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 18, fontWeight: 900, color: '#ffffff' }}>{name}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill={accentColor}>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
          <div style={{ fontSize: 12, color: accentColor, fontWeight: 600 }}>{handle}</div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
            {subscribers} • {totalViews}
          </div>
        </div>
      </div>

      {/* Bio */}
      <div style={{ fontSize: 12, color: '#e2e8f0', lineHeight: 1.4 }}>
        {bio}
      </div>

      {/* Niche Badges */}
      <div style={{ display: 'flex', gap: 8 }}>
        {nicheBadges.map((badge) => (
          <span
            key={badge}
            style={{
              fontSize: 10,
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: 9999,
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
            }}
          >
            {badge}
          </span>
        ))}
      </div>
    </div>
  );
}
