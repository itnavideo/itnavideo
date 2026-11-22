import React from 'react';
import { Img, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface ProductSpotlightProps {
  productTitle?: string;
  tagline?: string;
  imageSrc?: string;
  accentColor?: string;
  spotlightColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * ProductSpotlight — Theatrical studio spotlight & cinematic reveal stage.
 * Illuminates product on a dark cylindrical podium under conical overhead light beams
 * with floating specular particles and dramatic chiaroscuro contrast.
 */
export function ProductSpotlight({
  productTitle = 'LUMINOR MONOLITH PRO',
  tagline = 'Born from shadow. Sculpted by light.',
  imageSrc = 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80',
  accentColor = '#f59e0b',
  spotlightColor = 'rgba(255, 255, 255, 0.15)',
  delay = 0,
  width = 480,
  height = 540,
}: ProductSpotlightProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const intro = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 75, mass: 1 },
  });

  const beamIntensity = interpolate(
    spring({
      frame: Math.max(0, t - 10),
      fps,
      config: { damping: 12, stiffness: 60 },
    }),
    [0, 1],
    [0, 1]
  );

  const floatY = Math.sin(t * 0.05) * 6;

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
        padding: '28px 20px',
        boxSizing: 'border-box',
        background: '#000000',
        borderRadius: 24,
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 24px 60px rgba(0,0,0,0.95)',
        overflow: 'hidden',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Overhead Conical Spotlight Light Cone */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 440,
          height: 380,
          pointerEvents: 'none',
          opacity: beamIntensity,
        }}
      >
        <defs>
          <linearGradient id="spotlight-cone" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#ffffff" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points="190,0 250,0 380,380 60,380" fill="url(#spotlight-cone)" />
      </svg>

      {/* Floating Ambient Light Dust Specks */}
      {[...Array(6)].map((_, i) => {
        const speckY = ((t * (0.8 + i * 0.2)) % 280);
        const speckX = 140 + Math.sin(t * 0.04 + i) * 80;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: speckY,
              left: speckX,
              width: 3,
              height: 3,
              borderRadius: '50%',
              background: '#ffffff',
              opacity: beamIntensity * (0.3 + (i % 3) * 0.2),
              pointerEvents: 'none',
            }}
          />
        );
      })}

      {/* Top Tagline */}
      <div style={{ textAlign: 'center', opacity: intro, zIndex: 2 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: accentColor, letterSpacing: '0.14em' }}>
          EXCLUSIVE SPOTLIGHT REVEAL
        </div>
        <div style={{ fontSize: 20, fontWeight: 900, color: '#ffffff', marginTop: 2 }}>
          {productTitle}
        </div>
      </div>

      {/* Product On Podium Stage */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 260,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
        }}
      >
        {/* Floating Product */}
        <div
          style={{
            width: 220,
            height: 200,
            transform: `translateY(${floatY}px) scale(${intro})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Img
            src={imageSrc}
            alt={productTitle}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.9))',
            }}
          />
        </div>

        {/* Studio Ground Podium Ellipse */}
        <div
          style={{
            position: 'absolute',
            bottom: 10,
            width: 200,
            height: 30,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.02) 60%, rgba(0,0,0,0) 80%)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 0 40px rgba(255,255,255,0.1)',
          }}
        />
      </div>

      {/* Bottom Dramatic Narrative */}
      <div
        style={{
          textAlign: 'center',
          opacity: intro,
          zIndex: 2,
        }}
      >
        <div style={{ fontSize: 13, color: '#cbd5e1', fontWeight: 500, fontStyle: 'italic' }}>
          &ldquo;{tagline}&rdquo;
        </div>
        <div
          style={{
            fontSize: 10,
            color: '#64748b',
            letterSpacing: '0.1em',
            marginTop: 6,
            textTransform: 'uppercase',
          }}
        >
          Curated Studio Lighting Experience
        </div>
      </div>
    </div>
  );
}
