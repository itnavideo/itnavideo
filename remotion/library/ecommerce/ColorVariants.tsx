import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface VariantColor {
  name: string;
  hex: string;
  tagline: string;
}

export interface ColorVariantsProps {
  title?: string;
  subtitle?: string;
  variants?: VariantColor[];
  accentColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

const DEFAULT_VARIANTS: VariantColor[] = [
  { name: 'Space Gray', hex: '#374151', tagline: 'Understated matte anodized dark finish' },
  { name: 'Midnight Blue', hex: '#1e3a8a', tagline: 'Deep oceanic pigment with sapphire gloss' },
  { name: 'Starlight Silver', hex: '#e2e8f0', tagline: 'Radiant high-polish metallic luminescence' },
  { name: 'Alpine Forest Green', hex: '#065f46', tagline: 'Nature-inspired earthy outdoor ceramic tone' },
];

/**
 * ColorVariants — Multi-colorway product lineup showcase.
 * Cycles across available retail finishes with synchronized color badges and accent glows.
 */
export function ColorVariants({
  title = 'FOUR ICONIC FINISHES',
  subtitle = 'Find the hue that complements your personal style',
  variants = DEFAULT_VARIANTS,
  accentColor = '#f59e0b',
  delay = 0,
  width = 460,
  height = 500,
}: ColorVariantsProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const intro = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  // Cycle current variant
  const activeIdx = Math.floor((t / 30) % variants.length);
  const currentVariant = variants[activeIdx];

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
        background: '#09090b',
        borderRadius: 24,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
        overflow: 'hidden',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', opacity: intro }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: accentColor, letterSpacing: '0.12em' }}>
          {title}
        </div>
        <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>
          {subtitle}
        </div>
      </div>

      {/* Active Color Preview Sphere */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 0',
          position: 'relative',
        }}
      >
        {/* Glow */}
        <div
          style={{
            position: 'absolute',
            width: 140,
            height: 140,
            borderRadius: '50%',
            background: currentVariant.hex,
            filter: 'blur(35px)',
            opacity: 0.4,
          }}
        />

        {/* Sphere */}
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.4) 0%, ${currentVariant.hex} 60%, #000000 100%)`,
            boxShadow: '0 16px 32px rgba(0,0,0,0.6)',
            border: '2px solid rgba(255,255,255,0.2)',
            zIndex: 2,
          }}
        />

        <div style={{ zIndex: 2, marginTop: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#ffffff' }}>
            {currentVariant.name}
          </div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
            {currentVariant.tagline}
          </div>
        </div>
      </div>

      {/* Swatch Pill Buttons */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 12,
          opacity: intro,
        }}
      >
        {variants.map((v, idx) => {
          const isSelected = idx === activeIdx;
          return (
            <div
              key={v.name}
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: v.hex,
                border: isSelected ? '3px solid #ffffff' : '2px solid rgba(255,255,255,0.2)',
                transform: isSelected ? 'scale(1.25)' : 'scale(1)',
                boxShadow: isSelected ? `0 0 12px ${v.hex}` : 'none',
                transition: 'all 0.2s ease',
              }}
            />
          );
        })}
      </div>

      {/* Bottom Footer Note */}
      <div
        style={{
          textAlign: 'center',
          paddingTop: 12,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          fontSize: 10,
          color: '#64748b',
          opacity: intro,
        }}
      >
        ALL EDITIONS FEATURE MATCHING ACCESSORIES & CABLES
      </div>
    </div>
  );
}
