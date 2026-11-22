import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface LikeButtonAnimationProps {
  initialCount?: number;
  label?: string;
  likedLabel?: string;
  accentColor?: string;
  triggerFrame?: number;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * LikeButtonAnimation — Kinetic YouTube/Instagram thumbs-up like button interaction.
 * Transitions from hollow stroke to vibrant filled state with haptic spring compression,
 * numerical odometer increment, and radiating micro-particle sparkles.
 */
export function LikeButtonAnimation({
  initialCount = 14280,
  label = 'Like',
  likedLabel = 'Liked!',
  accentColor = '#3b82f6',
  triggerFrame = 20,
  delay = 0,
  width = 240,
  height = 90,
}: LikeButtonAnimationProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const intro = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  const isLiked = t >= triggerFrame;
  const pressSpring = spring({
    frame: Math.max(0, t - triggerFrame),
    fps,
    config: { damping: 10, stiffness: 140 },
  });

  const count = isLiked ? initialCount + 1 : initialCount;
  const scale = isLiked ? interpolate(pressSpring, [0, 0.4, 1], [1, 1.25, 1]) : 1;

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: intro,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Sparkle Particles on Like */}
      {isLiked &&
        [...Array(6)].map((_, i) => {
          const angle = (i * 60 * Math.PI) / 180;
          const dist = interpolate(pressSpring, [0, 1], [10, 36]);
          const particleOpacity = interpolate(pressSpring, [0, 0.7, 1], [1, 0.8, 0]);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `calc(35% + ${Math.cos(angle) * dist}px)`,
                top: `calc(50% + ${Math.sin(angle) * dist}px)`,
                width: 5,
                height: 5,
                borderRadius: '50%',
                backgroundColor: accentColor,
                opacity: particleOpacity,
                pointerEvents: 'none',
              }}
            />
          );
        })}

      {/* Main Pill Button */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '12px 22px',
          borderRadius: 9999,
          background: isLiked ? `${accentColor}22` : 'rgba(255, 255, 255, 0.08)',
          border: isLiked ? `1.5px solid ${accentColor}` : '1.5px solid rgba(255, 255, 255, 0.15)',
          transform: `scale(${scale})`,
          boxShadow: isLiked ? `0 0 20px ${accentColor}44` : '0 4px 12px rgba(0,0,0,0.4)',
          transition: 'background 0.2s, border-color 0.2s',
          cursor: 'pointer',
        }}
      >
        {/* Thumbs-Up SVG Icon */}
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill={isLiked ? accentColor : 'none'}
          stroke={isLiked ? accentColor : '#ffffff'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 10v12M15 10.5a3 3 0 0 0-3-3l-1.5-4.5A2 2 0 0 0 8.6 2H8a2 2 0 0 0-2 2v6h-3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h14.3a2 2 0 0 0 2-1.6l1.2-6.5a2 2 0 0 0-2-2.4H15z" />
        </svg>

        {/* Count & Label */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#ffffff' }}>
            {count.toLocaleString()}
          </span>
          <span style={{ fontSize: 10, fontWeight: 600, color: isLiked ? accentColor : '#94a3b8' }}>
            {isLiked ? likedLabel : label}
          </span>
        </div>
      </div>
    </div>
  );
}
