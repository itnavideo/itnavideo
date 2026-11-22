import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface ProductPackagingProps {
  brand?: string;
  boxTitle?: string;
  edition?: string;
  sustainabilityBadge?: string;
  dimensions?: string;
  accentColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * ProductPackaging — Luxury retail packaging showcase.
 * Displays matte textured gift box with embossed foil accents,
 * pull-tab sleeve reveal, and certified eco-friendly packaging stamp.
 */
export function ProductPackaging({
  brand = 'ITNA STUDIO COLLECTION',
  boxTitle = 'FLAGSHIP SOUNDSTAGE BOX',
  edition = 'LIMITED FOUNDER EDITION • #042/500',
  sustainabilityBadge = '100% PLASTIC-FREE • FSC CERTIFIED',
  dimensions = '240 × 190 × 85 mm',
  accentColor = '#f59e0b',
  delay = 0,
  width = 460,
  height = 500,
}: ProductPackagingProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const intro = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  const sleeveSlide = interpolate(
    spring({
      frame: Math.max(0, t - 15),
      fps,
      config: { damping: 15, stiffness: 70 },
    }),
    [0, 1],
    [0, -45]
  );

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
        overflow: 'hidden',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', opacity: intro }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: accentColor, letterSpacing: '0.14em' }}>
          {brand}
        </div>
        <div style={{ fontSize: 18, fontWeight: 800, color: '#ffffff', marginTop: 2 }}>
          {boxTitle}
        </div>
      </div>

      {/* 3D Box Representation with Sliding Sleeve */}
      <div
        style={{
          position: 'relative',
          width: 280,
          height: 240,
          perspective: 800,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Inner Premium Box Base */}
        <div
          style={{
            position: 'absolute',
            width: 220,
            height: 180,
            borderRadius: 16,
            background: 'linear-gradient(135deg, #18181b, #09090b)',
            border: '1.5px solid rgba(255,255,255,0.15)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.85)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
            boxSizing: 'border-box',
          }}
        >
          {/* Embossed Logo / Seal */}
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              border: `2px solid ${accentColor}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 15px ${accentColor}44`,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 10, letterSpacing: '0.1em' }}>
            {edition}
          </div>
        </div>

        {/* Outer Sliding Sleeve Cover */}
        <div
          style={{
            position: 'absolute',
            width: 224,
            height: 184,
            borderRadius: 18,
            background: 'linear-gradient(135deg, rgba(39, 39, 42, 0.95), rgba(24, 24, 27, 0.95))',
            border: `1.5px solid ${accentColor}66`,
            boxShadow: '0 15px 30px rgba(0,0,0,0.7)',
            transform: `translateY(${sleeveSlide}px)`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '16px 14px',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 9, color: accentColor, fontWeight: 700 }}>PULL TO OPEN</span>
            <span style={{ fontSize: 9, color: '#64748b' }}>{dimensions}</span>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#ffffff', letterSpacing: '0.08em' }}>
              UNBOXING EXPERIENCE
            </div>
            <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>
              Magnetic Closure Latch
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.2)' }} />
          </div>
        </div>
      </div>

      {/* Sustainability Badge Footer */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          padding: '8px 12px',
          borderRadius: 10,
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          opacity: intro,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <span style={{ fontSize: 10, fontWeight: 700, color: '#34d399', letterSpacing: '0.08em' }}>
          {sustainabilityBadge}
        </span>
      </div>
    </div>
  );
}
