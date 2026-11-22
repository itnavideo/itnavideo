import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface FunnelTransformationProps {
  headline?: string;
  inputVolume?: string;
  inputDesc?: string;
  outputVolume?: string;
  outputDesc?: string;
  accentColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * FunnelTransformation — Distillation & qualification funnel storytelling graphic.
 * Visually shows high-volume raw inputs refining down into high-converting distilled outputs.
 */
export function FunnelTransformation({
  headline = 'THE REFINEMENT FUNNEL',
  inputVolume = '10,000 Impressions',
  inputDesc = 'Broad Top-of-Funnel Attention',
  outputVolume = '240 High-Value Clients',
  outputDesc = 'Retained Lifetime Subscribers',
  accentColor = '#8b5cf6',
  delay = 0,
  width = 460,
  height = 380,
}: FunnelTransformationProps) {
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
        justifyContent: 'space-between',
        padding: '24px 20px',
        boxSizing: 'border-box',
        background: '#09090b',
        borderRadius: 24,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
        opacity: intro,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Title */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: accentColor, letterSpacing: '0.12em' }}>
          DISTILLATION ALCHEMY
        </div>
        <div style={{ fontSize: 18, fontWeight: 900, color: '#ffffff', marginTop: 2 }}>
          {headline}
        </div>
      </div>

      {/* Top Input Stage */}
      <div
        style={{
          width: '80%',
          padding: '8px 14px',
          borderRadius: 10,
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 800, color: '#ffffff' }}>{inputVolume}</span>
        <span style={{ fontSize: 10, color: '#94a3b8' }}>{inputDesc}</span>
      </div>

      {/* Funnel SVG Body */}
      <div style={{ width: 180, height: 120 }}>
        <svg width="100%" height="100%" viewBox="0 0 180 120" style={{ overflow: 'visible' }}>
          <polygon
            points="10,10 170,10 110,90 110,120 70,120 70,90"
            fill="rgba(139, 92, 246, 0.15)"
            stroke={accentColor}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Animated Particles flowing down */}
          {[...Array(5)].map((_, i) => {
            const partY = 15 + ((t * 2 + i * 20) % 95);
            return (
              <circle
                key={i}
                cx={90}
                cy={partY}
                r={3}
                fill="#ffffff"
                filter="drop-shadow(0 0 4px #ffffff)"
              />
            );
          })}
        </svg>
      </div>

      {/* Bottom Output Stage */}
      <div
        style={{
          width: '80%',
          padding: '10px 14px',
          borderRadius: 12,
          background: `linear-gradient(135deg, ${accentColor}22, rgba(255,255,255,0.03))`,
          border: `2px solid ${accentColor}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: `0 0 20px ${accentColor}33`,
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 900, color: '#ffffff' }}>{outputVolume}</span>
        <span style={{ fontSize: 10, color: '#22c55e', fontWeight: 800 }}>{outputDesc}</span>
      </div>
    </div>
  );
}
