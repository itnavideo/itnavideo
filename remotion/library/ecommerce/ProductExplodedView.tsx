import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface ExplodedPart {
  id: string;
  name: string;
  material: string;
  offsetY: number; // Dispersal offset
}

export interface ProductExplodedViewProps {
  productTitle?: string;
  subtitle?: string;
  parts?: ExplodedPart[];
  accentColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

const DEFAULT_PARTS: ExplodedPart[] = [
  { id: '1', name: 'Aerospace Grade 5 Titanium Ring', material: 'Brushed PVD Finish', offsetY: -120 },
  { id: '2', name: 'Sapphire Crystal Lens Shield', material: 'Mohs Scale 9 Hardness', offsetY: -60 },
  { id: '3', name: '50mm Graphene Audio Driver', material: 'High-Flux Neodymium N52', offsetY: 0 },
  { id: '4', name: 'Neural DSP Audio Processor', material: '64-bit Floating Architecture', offsetY: 60 },
  { id: '5', name: 'Ultra-Dense Silicon Anode Cell', material: '850mAh High Capacity', offsetY: 120 },
];

/**
 * ProductExplodedView — High-tech engineering schematic exploded view.
 * Animate product internal layers expanding along the vertical axis with
 * precision pointer leader lines, technical descriptions, and engineering grid.
 */
export function ProductExplodedView({
  productTitle = 'AURA ARCHITECTURE SCHEMATIC',
  subtitle = 'Modular Precision Engineering & Exploded Layer View',
  parts = DEFAULT_PARTS,
  accentColor = '#38bdf8',
  delay = 0,
  width = 560,
  height = 580,
}: ProductExplodedViewProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const intro = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 80 },
  });

  // Dispersal factor: starts together, smoothly explodes apart
  const explosionSpring = spring({
    frame: Math.max(0, t - 15),
    fps,
    config: { damping: 16, stiffness: 65, mass: 1 },
  });

  const disperse = interpolate(explosionSpring, [0, 1], [0, 1]);

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
        border: '1px solid rgba(255, 255, 255, 0.12)',
        overflow: 'hidden',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Blueprint Grid Background Pattern */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0.15,
          pointerEvents: 'none',
        }}
      >
        <defs>
          <pattern id="exploded-grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke={accentColor} strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#exploded-grid)" />
      </svg>

      {/* Header */}
      <div style={{ zIndex: 2, marginBottom: 20, opacity: intro }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: accentColor }} />
          <span style={{ fontSize: 11, fontWeight: 800, color: accentColor, letterSpacing: '0.14em' }}>
            {productTitle}
          </span>
        </div>
        <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>
          {subtitle}
        </div>
      </div>

      {/* Center Exploded Assembly Stage */}
      <div
        style={{
          position: 'relative',
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
        }}
      >
        {/* Central Vertical Alignment Laser Guide */}
        <div
          style={{
            position: 'absolute',
            left: '30%',
            top: 20,
            bottom: 20,
            width: 1,
            background: `dashed ${accentColor}66`,
            borderLeft: `1px dashed ${accentColor}55`,
          }}
        />

        {parts.map((part, idx) => {
          const currentY = part.offsetY * disperse;
          const partSpr = spring({
            frame: Math.max(0, t - idx * 4),
            fps,
            config: { damping: 14, stiffness: 90 },
          });

          return (
            <div
              key={part.id}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                transform: `translateY(${currentY}px)`,
                display: 'flex',
                alignItems: 'center',
                opacity: partSpr,
              }}
            >
              {/* Part SVG Geometric Icon Layer */}
              <div
                style={{
                  width: '30%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    width: 70 - idx * 6,
                    height: 22,
                    borderRadius: 8,
                    background: `linear-gradient(90deg, rgba(255,255,255,0.08), ${accentColor}33)`,
                    border: `1.5px solid ${accentColor}`,
                    boxShadow: `0 0 16px ${accentColor}33`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ fontSize: 9, fontWeight: 800, color: '#ffffff' }}>L-{idx + 1}</span>
                </div>
              </div>

              {/* Connecting Leader Line */}
              <svg width="60" height="20" style={{ overflow: 'visible' }}>
                <line
                  x1="0"
                  y1="10"
                  x2="50"
                  y2="10"
                  stroke={accentColor}
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />
                <circle cx="50" cy="10" r="3" fill={accentColor} />
              </svg>

              {/* Part Label & Material Specs */}
              <div style={{ flex: 1, paddingLeft: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#ffffff' }}>
                  {part.name}
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                  {part.material}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info HUD */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: 12,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          zIndex: 2,
          opacity: intro,
        }}
      >
        <span style={{ fontSize: 11, color: '#64748b' }}>
          5-LAYER HARMONIC RESONANCE STACK
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: '#22c55e' }}>TOLERANCE ±0.002mm</span>
        </div>
      </div>
    </div>
  );
}
