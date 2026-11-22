import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface LiveStreamOverlayProps {
  streamTitle?: string;
  viewerCount?: string;
  elapsedTime?: string;
  recentFollower?: string;
  subGoalCurrent?: number;
  subGoalTarget?: number;
  accentColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * LiveStreamOverlay — Professional Twitch/YouTube streaming HUD overlay.
 * Features pulsing LIVE beacon, real-time viewer count, sub goal bar, and recent event ticker.
 */
export function LiveStreamOverlay({
  streamTitle = '🔴 SPECIAL ANNOUNCEMENT: AI VIDEO 2.0 LAUNCH',
  viewerCount = '18,420',
  elapsedTime = '01:24:18',
  recentFollower = 'Recent Sub: @marcus_dev',
  subGoalCurrent = 385,
  subGoalTarget = 500,
  accentColor = '#ef4444',
  delay = 0,
  width = 640,
  height = 360,
}: LiveStreamOverlayProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const intro = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  const pulse = 0.8 + Math.sin(t * 0.15) * 0.2;
  const goalPercent = Math.min(100, Math.round((subGoalCurrent / subGoalTarget) * 100));

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
        borderRadius: 20,
        border: '1px solid rgba(255, 255, 255, 0.12)',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.85) 100%)',
        boxShadow: '0 24px 48px rgba(0,0,0,0.9)',
        overflow: 'hidden',
        opacity: intro,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Top Stream Status Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Live Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1.5px solid #ef4444',
              padding: '4px 12px',
              borderRadius: 9999,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#ef4444',
                opacity: pulse,
                boxShadow: '0 0 10px #ef4444',
              }}
            />
            <span style={{ fontSize: 11, fontWeight: 900, color: '#ffffff', letterSpacing: '0.1em' }}>
              LIVE
            </span>
          </div>

          <span style={{ fontSize: 12, color: '#cbd5e1', fontWeight: 600 }}>
            {elapsedTime}
          </span>
        </div>

        {/* Live Viewer Counter */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(0,0,0,0.6)',
            padding: '5px 12px',
            borderRadius: 9999,
            border: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <span style={{ fontSize: 12, fontWeight: 800, color: '#ffffff' }}>
            {viewerCount}
          </span>
        </div>
      </div>

      {/* Bottom Sub Goal & Recent Follower Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* Sub Goal Bar */}
        <div
          style={{
            background: 'rgba(0,0,0,0.7)',
            padding: '8px 14px',
            borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontWeight: 800, color: '#ffffff', marginBottom: 4 }}>
            <span>SUBSCRIBER GOAL</span>
            <span>{subGoalCurrent} / {subGoalTarget} ({goalPercent}%)</span>
          </div>

          <div style={{ width: '100%', height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
            <div
              style={{
                width: `${goalPercent}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #3b82f6, #06b6d4)',
                borderRadius: 3,
              }}
            />
          </div>
        </div>

        {/* Recent Event Ticker */}
        <div style={{ fontSize: 11, color: '#94a3b8', paddingLeft: 4 }}>
          {recentFollower}
        </div>
      </div>
    </div>
  );
}
