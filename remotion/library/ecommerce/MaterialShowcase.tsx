import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface MaterialNode {
  title: string;
  grade: string;
  property: string;
  colorSwatch: string;
}

export interface MaterialShowcaseProps {
  headline?: string;
  subheadline?: string;
  materials?: MaterialNode[];
  accentColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

const DEFAULT_MATERIALS: MaterialNode[] = [
  { title: 'Aerospace Grade 5 Titanium', grade: 'Ti-6Al-4V Alloy', property: 'Twice the strength of steel at half the weight', colorSwatch: '#94a3b8' },
  { title: 'Synthetic Sapphire Crystal', grade: 'Mohs Hardness 9', property: 'Diamond-hard scratch-proof optical clarity', colorSwatch: '#38bdf8' },
  { title: 'Breathable Memory Foam', grade: 'Viscoelastic Polymer', property: 'Pressure-relieving acoustic isolation seal', colorSwatch: '#475569' },
  { title: 'Ultra-Pure Oxygen-Free Copper', grade: '99.9999% OFC', property: 'Zero signal latency & pristine conductivity', colorSwatch: '#f97316' },
];

/**
 * MaterialShowcase — Luxury material science & craftsmanship spotlight.
 * Highlights premium raw materials, metallurgy, structural resilience, and texture nodes.
 */
export function MaterialShowcase({
  headline = 'PREMIUM MATERIAL CRAFTSMANSHIP',
  subheadline = 'Engineered from the inside out with uncompromising raw elements',
  materials = DEFAULT_MATERIALS,
  accentColor = '#f59e0b',
  delay = 0,
  width = 500,
  height = 520,
}: MaterialShowcaseProps) {
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
        padding: '28px 24px',
        boxSizing: 'border-box',
        background: '#09090b',
        borderRadius: 24,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
        overflow: 'hidden',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 20, opacity: intro }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: accentColor, letterSpacing: '0.12em' }}>
          {headline}
        </div>
        <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>
          {subheadline}
        </div>
      </div>

      {/* Material Nodes List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, justifyContent: 'center' }}>
        {materials.map((mat, idx) => {
          const nodeSpr = spring({
            frame: Math.max(0, t - 6 - idx * 5),
            fps,
            config: { damping: 14, stiffness: 90 },
          });

          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '12px 16px',
                borderRadius: 14,
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                opacity: nodeSpr,
                transform: `translateX(${interpolate(nodeSpr, [0, 1], [-20, 0])}px)`,
              }}
            >
              {/* Material Swatch Node */}
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: mat.colorSwatch,
                  boxShadow: `0 0 12px ${mat.colorSwatch}44`,
                  border: '2px solid rgba(255,255,255,0.3)',
                  flexShrink: 0,
                }}
              />

              {/* Material Info */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#ffffff' }}>
                    {mat.title}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: accentColor,
                      background: `${accentColor}18`,
                      padding: '2px 6px',
                      borderRadius: 4,
                    }}
                  >
                    {mat.grade}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                  {mat.property}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Durability Standard Footer */}
      <div
        style={{
          marginTop: 12,
          paddingTop: 12,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          opacity: intro,
        }}
      >
        <span style={{ fontSize: 10, color: '#64748b' }}>MIL-STD-810H TESTED</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#22c55e' }}>IP68 WATER & DUST RESISTANT</span>
      </div>
    </div>
  );
}
