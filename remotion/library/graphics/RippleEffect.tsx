import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface RippleEffectProps {
  epicenterLabel?: string;
  impactMetrics?: string[];
  accentColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

const DEFAULT_METRICS = [
  'Customer Trust',
  'Organic Referrals',
  'Market Authority',
  'Compounding Retention',
];

/**
 * RippleEffect — Concentric wave propagation storytelling visualizer.
 * Emanates radiating pulse rings from a central core, activating surrounding impact factors.
 */
export function RippleEffect({
  epicenterLabel = 'Product Excellence',
  impactMetrics = DEFAULT_METRICS,
  accentColor = '#3b82f6',
  delay = 0,
  width = 460,
  height = 420,
}: RippleEffectProps) {
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
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        boxSizing: 'border-box',
        background: '#09090b',
        borderRadius: 24,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
        overflow: 'hidden',
        opacity: intro,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Concentric Ripple Rings */}
      {[1, 2, 3].map((ring) => {
        const ringProgress = ((t * 0.03 + ring * 0.3) % 1);
        const radius = 60 + ringProgress * 140;
        const opacity = (1 - ringProgress) * 0.6;

        return (
          <div
            key={ring}
            style={{
              position: 'absolute',
              width: radius * 2,
              height: radius * 2,
              borderRadius: '50%',
              border: `2px solid ${accentColor}`,
              opacity,
              pointerEvents: 'none',
            }}
          />
        );
      })}

      {/* Central Epicenter Core */}
      <div
        style={{
          width: 90,
          height: 90,
          borderRadius: '50%',
          background: `radial-gradient(circle at 35% 35%, ${accentColor}, #1e3a8a)`,
          boxShadow: `0 0 30px ${accentColor}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: 8,
          boxSizing: 'border-box',
          zIndex: 3,
        }}
      >
        <span style={{ fontSize: 9, fontWeight: 800, color: '#000000', textTransform: 'uppercase' }}>
          CORE
        </span>
        <span style={{ fontSize: 11, fontWeight: 900, color: '#ffffff', marginTop: 2, lineHeight: 1.1 }}>
          {epicenterLabel}
        </span>
      </div>

      {/* 4 Peripheral Impact Badges */}
      {impactMetrics.map((metric, i) => {
        const angle = (i * 90 * Math.PI) / 180;
        const dist = 135;
        const posX = Math.cos(angle) * dist;
        const posY = Math.sin(angle) * dist;

        return (
          <div
            key={metric}
            style={{
              position: 'absolute',
              transform: `translate(${posX}px, ${posY}px)`,
              background: 'rgba(24, 24, 27, 0.9)',
              border: `1px solid ${accentColor}44`,
              padding: '6px 12px',
              borderRadius: 8,
              fontSize: 10,
              fontWeight: 700,
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(0,0,0,0.6)',
              zIndex: 3,
              whiteSpace: 'nowrap',
            }}
          >
            {metric}
          </div>
        );
      })}
    </div>
  );
}
