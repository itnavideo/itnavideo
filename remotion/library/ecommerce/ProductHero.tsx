import React from 'react';
import { Img, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface ProductHeroProps {
  headline?: string;
  subheadline?: string;
  productName?: string;
  badge?: string;
  price?: string;
  ctaText?: string;
  imageSrc?: string;
  accentColor?: string;
  glowColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * ProductHero — Cinematic flagship product hero banner with dramatic floating 
 * elevation, optical lens flare backdrop, luxury typography, and high-impact CTA.
 */
export function ProductHero({
  headline = 'ENGINEERED FOR PERFECTION',
  subheadline = 'Next-Generation Wireless Acoustic Flagship',
  productName = 'AURA ONE PRO',
  badge = 'NEW RELEASE 2026',
  price = '$349',
  ctaText = 'Order Now & Save $50',
  imageSrc = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
  accentColor = '#f59e0b',
  glowColor = '#f59e0b33',
  delay = 0,
  width = '100%',
  height = 540,
}: ProductHeroProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const heroSpring = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 85, mass: 0.9 },
  });

  const floatY = Math.sin(t * 0.06) * 8;
  const pulseGlow = 0.8 + Math.sin(t * 0.08) * 0.2;

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
        padding: '32px 24px',
        boxSizing: 'border-box',
        overflow: 'hidden',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Dynamic Ambient Glow Behind Product */}
      <div
        style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 480,
          height: 280,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${glowColor} 0%, rgba(0,0,0,0) 70%)`,
          filter: 'blur(45px)',
          opacity: pulseGlow * heroSpring,
          pointerEvents: 'none',
        }}
      />

      {/* Top Release Pill Badge */}
      <div
        style={{
          opacity: heroSpring,
          transform: `translateY(${interpolate(heroSpring, [0, 1], [-20, 0])}px)`,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 14px',
          borderRadius: 9999,
          background: 'rgba(255, 255, 255, 0.06)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          marginBottom: 16,
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: accentColor,
            boxShadow: `0 0 10px ${accentColor}`,
          }}
        />
        <span
          style={{
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: '0.12em',
            color: '#ffffff',
            textTransform: 'uppercase',
          }}
        >
          {badge}
        </span>
      </div>

      {/* Flagship Headline & Product Title */}
      <div
        style={{
          textAlign: 'center',
          opacity: heroSpring,
          transform: `translateY(${interpolate(heroSpring, [0, 1], [15, 0])}px)`,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            fontSize: 12,
            letterSpacing: '0.22em',
            color: accentColor,
            fontWeight: 700,
            textTransform: 'uppercase',
            marginBottom: 6,
          }}
        >
          {headline}
        </div>
        <div
          style={{
            fontSize: 42,
            fontWeight: 900,
            letterSpacing: '-0.02em',
            color: '#ffffff',
            textShadow: '0 4px 24px rgba(0,0,0,0.8)',
            lineHeight: 1.1,
          }}
        >
          {productName}
        </div>
        <div
          style={{
            fontSize: 14,
            color: '#94a3b8',
            marginTop: 6,
            fontWeight: 500,
          }}
        >
          {subheadline}
        </div>
      </div>

      {/* Hero Floating Product Visual */}
      <div
        style={{
          position: 'relative',
          width: 260,
          height: 180,
          transform: `scale(${interpolate(heroSpring, [0, 1], [0.85, 1])}) translateY(${floatY}px)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '12px 0 24px',
        }}
      >
        <Img
          src={imageSrc}
          alt={productName}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.7))',
          }}
        />
      </div>

      {/* Price & Primary Call-to-Action Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          opacity: heroSpring,
          transform: `translateY(${interpolate(heroSpring, [0, 1], [25, 0])}px)`,
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 900,
            color: '#ffffff',
          }}
        >
          {price}
        </div>
        <div
          style={{
            padding: '12px 26px',
            borderRadius: 12,
            background: `linear-gradient(135deg, ${accentColor}, #d97706)`,
            color: '#000000',
            fontWeight: 800,
            fontSize: 14,
            letterSpacing: '0.02em',
            boxShadow: `0 8px 24px ${glowColor}`,
            cursor: 'pointer',
          }}
        >
          {ctaText}
        </div>
      </div>
    </div>
  );
}
