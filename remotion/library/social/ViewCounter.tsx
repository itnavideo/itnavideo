import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface ViewCounterProps {
  label?: string;
  startViews?: number;
  endViews?: number;
  velocityRate?: string;
  accentColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * ViewCounter — Rapidly escalating video view velocity meter.
 * Simulates viral view counts spiking in real time with flame badge and hourly velocity rate.
 */
export function ViewCounter({
  label = 'TOTAL LIFETIME VIEWS',
  startViews = 124000,
  endViews = 158400,
  velocityRate = '+4,200 views / hour',
  accentColor = '#f59e0b',
  delay = 0,
  width = 360,
  height = 140,
}: ViewCounterProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const intro = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  const countSpr = spring({
    frame: Math.max(0, t - 8),
    fps,
    config: { damping: 18, stiffness: 60 },
  });

  const views = Math.round(interpolate(countSpr, [0, 1], [startViews, endViews]));

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
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 16px 32px rgba(0,0,0,0.7)',
        opacity: intro,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Top Header & Flame */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', letterSpacing: '0.12em' }}>
          {label}
        </span>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '3px 8px',
            borderRadius: 6,
            background: `${accentColor}22`,
            border: `1px solid ${accentColor}44`,
          }}
        >
          <span style={{ fontSize: 12 }}>🔥</span>
          <span style={{ fontSize: 10, fontWeight: 800, color: accentColor }}>VIRAL</span>
        </div>
      </div>

      {/* Main Big Counter Display */}
      <div
        style={{
          fontSize: 36,
          fontWeight: 900,
          color: '#ffffff',
          letterSpacing: '-0.02em',
          fontFamily: 'monospace, Inter, sans-serif',
        }}
      >
        {views.toLocaleString()}
      </div>

      {/* Bottom Velocity Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#22c55e' }}>
          {velocityRate}
        </span>
      </div>
    </div>
  );
}
