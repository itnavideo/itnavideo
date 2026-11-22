import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface SpotlightRevealProps {
  headline?: string;
  revealedInsight?: string;
  sourceLabel?: string;
  accentColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * SpotlightReveal — Darkness illumination storytelling visual.
 * Sweeps a theatrical flashlight cone across a dark field to uncover a critical breakthrough idea.
 */
export function SpotlightReveal({
  headline = 'ILLUMINATING THE REAL PROBLEM',
  revealedInsight = 'Creators do not lack talent. They lack automated throughput.',
  sourceLabel = 'FOUNDER REALIZATION',
  accentColor = '#facc15',
  delay = 0,
  width = 480,
  height = 320,
}: SpotlightRevealProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const intro = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  const beamIntensity = interpolate(
    spring({
      frame: Math.max(0, t - 10),
      fps,
      config: { damping: 12, stiffness: 70 },
    }),
    [0, 1],
    [0, 1]
  );

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '28px 24px',
        boxSizing: 'border-box',
        background: '#000000',
        borderRadius: 24,
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 24px 60px rgba(0,0,0,0.95)',
        overflow: 'hidden',
        opacity: intro,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Conical Light Beam */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 400,
          height: 300,
          pointerEvents: 'none',
          opacity: beamIntensity,
        }}
      >
        <polygon points="170,0 230,0 360,300 40,300" fill="url(#story-spotlight-cone)" />
        <defs>
          <linearGradient id="story-spotlight-cone" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accentColor} stopOpacity="0.4" />
            <stop offset="60%" stopColor={accentColor} stopOpacity="0.1" />
            <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Title */}
      <div style={{ textAlign: 'center', zIndex: 2 }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: accentColor, letterSpacing: '0.12em' }}>
          {sourceLabel}
        </div>
        <div style={{ fontSize: 18, fontWeight: 900, color: '#ffffff', marginTop: 2 }}>
          {headline}
        </div>
      </div>

      {/* Center Illuminated Truth Card */}
      <div
        style={{
          position: 'relative',
          padding: '16px 20px',
          borderRadius: 14,
          background: 'rgba(24, 24, 27, 0.9)',
          border: `1.5px solid ${accentColor}`,
          boxShadow: `0 0 30px ${accentColor}33`,
          textAlign: 'center',
          zIndex: 2,
          opacity: beamIntensity,
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 900, color: '#ffffff', lineHeight: 1.35 }}>
          &ldquo;{revealedInsight}&rdquo;
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', fontSize: 10, color: '#64748b', zIndex: 2 }}>
        THE SPOTLIGHT CHANGES EVERYTHING
      </div>
    </div>
  );
}
