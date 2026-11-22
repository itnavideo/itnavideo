import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface SubscriberCounterProps {
  channelName?: string;
  avatarUrl?: string;
  startCount?: number;
  targetCount?: number;
  label?: string;
  accentColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * SubscriberCounter — Live rolling odometer YouTube/TikTok subscriber ticker.
 * Displays numerical digit interpolation, live status beacon, and milestone achievement styling.
 */
export function SubscriberCounter({
  channelName = 'Itnavideo Studio',
  avatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  startCount = 99980,
  targetCount = 100000,
  label = 'LIVE SUBSCRIBER COUNT',
  accentColor = '#ef4444',
  delay = 0,
  width = 440,
  height = 180,
}: SubscriberCounterProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const intro = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  // Smooth odometer count progression
  const countSpr = spring({
    frame: Math.max(0, t - 10),
    fps,
    config: { damping: 20, stiffness: 50 },
  });

  const currentCount = Math.round(interpolate(countSpr, [0, 1], [startCount, targetCount]));
  const reachedMilestone = currentCount >= targetCount;

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
        border: reachedMilestone ? `1.5px solid ${accentColor}` : '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: reachedMilestone ? `0 0 30px ${accentColor}44` : '0 20px 40px rgba(0,0,0,0.8)',
        opacity: intro,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img
            src={avatarUrl}
            alt={channelName}
            style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
          />
          <span style={{ fontSize: 14, fontWeight: 800, color: '#ffffff' }}>
            {channelName}
          </span>
        </div>

        {/* Live Beacon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: accentColor,
              boxShadow: `0 0 8px ${accentColor}`,
            }}
          />
          <span style={{ fontSize: 10, fontWeight: 800, color: accentColor, letterSpacing: '0.1em' }}>
            {label}
          </span>
        </div>
      </div>

      {/* Numerical Ticker Display */}
      <div style={{ textAlign: 'center', padding: '6px 0' }}>
        <div
          style={{
            fontSize: 48,
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            fontFamily: 'monospace, Inter, sans-serif',
            textShadow: reachedMilestone ? `0 0 20px ${accentColor}` : 'none',
          }}
        >
          {currentCount.toLocaleString()}
        </div>
      </div>

      {/* Bottom Milestone Progress / Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: '#64748b' }}>
          Milestone: {targetCount.toLocaleString()}
        </span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: reachedMilestone ? '#22c55e' : '#94a3b8',
          }}
        >
          {reachedMilestone ? '🎉 MILESTONE UNLOCKED!' : `${(targetCount - currentCount).toLocaleString()} to go`}
        </span>
      </div>
    </div>
  );
}
