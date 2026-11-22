import React from 'react';
import { Img, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface ProductRotationProps {
  productName?: string;
  category?: string;
  imageSrc?: string;
  accentColor?: string;
  showAngleHUD?: boolean;
  rotationSpeed?: number;
  turntableText?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * ProductRotation — Simulated 360-degree product turntable inspection.
 * Uses hardware-accelerated CSS perspective, dynamic specular highlights,
 * reflective glass turntable base, and real-time degree angle readout.
 */
export function ProductRotation({
  productName = 'Chronos Masterpiece Titanium',
  category = 'Luxury Horology Edition',
  imageSrc = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
  accentColor = '#06b6d4',
  showAngleHUD = true,
  rotationSpeed = 1,
  turntableText = '360° INTERACTIVE ROTATION',
  delay = 0,
  width = 440,
  height = 480,
}: ProductRotationProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const intro = spring({
    frame: t,
    fps,
    config: { damping: 15, stiffness: 90 },
  });

  // Calculate rotation angle (0 to 360 degrees)
  const angle = Math.floor((t * 2 * rotationSpeed) % 360);
  const rotRad = (angle * Math.PI) / 180;

  // 3D illusion: scale horizontal axis sinusoidally for simulated spin
  const spinScaleX = Math.cos(rotRad);
  const depthZ = Math.sin(rotRad) * 20;

  // Glare / sheen translation across the surface
  const glareX = ((angle % 180) / 180) * 100;

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
        background: 'linear-gradient(180deg, #09090b 0%, #18181b 100%)',
        borderRadius: 24,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 24px 48px rgba(0, 0, 0, 0.8)',
        overflow: 'hidden',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Top Header & Angle HUD */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          opacity: intro,
        }}
      >
        <div>
          <div style={{ fontSize: 11, color: accentColor, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            {category}
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#ffffff', marginTop: 2 }}>
            {productName}
          </div>
        </div>

        {showAngleHUD && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(255, 255, 255, 0.06)',
              padding: '6px 12px',
              borderRadius: 12,
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2.5">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </svg>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#ffffff', fontFamily: 'monospace' }}>
              {angle}°
            </span>
          </div>
        )}
      </div>

      {/* Rotating Product Stage */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 260,
          perspective: 800,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Specular Glare Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at ${glareX}% 40%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 60%)`,
            pointerEvents: 'none',
            zIndex: 3,
            borderRadius: 16,
          }}
        />

        {/* Product Image with Simulated 3D Spin */}
        <div
          style={{
            transform: `scale(${intro}) scaleX(${spinScaleX}) translateY(${depthZ * 0.2}px)`,
            transition: 'transform 0.05s linear',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 220,
            height: 220,
            zIndex: 2,
          }}
        >
          <Img
            src={imageSrc}
            alt={productName}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              filter: `drop-shadow(0 ${15 + depthZ}px 25px rgba(0,0,0,0.85))`,
            }}
          />
        </div>

        {/* Rotating Turntable Ring */}
        <div
          style={{
            position: 'absolute',
            bottom: 10,
            width: 240,
            height: 50,
            borderRadius: '50%',
            border: `2px dashed ${accentColor}44`,
            background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0.4) 80%)',
            boxShadow: `0 0 30px ${accentColor}22`,
            transform: 'rotateX(75deg)',
            zIndex: 1,
          }}
        />
      </div>

      {/* Turntable Bottom Controller Bar */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 12,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          opacity: intro,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: accentColor,
              boxShadow: `0 0 8px ${accentColor}`,
            }}
          />
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: '#94a3b8' }}>
            {turntableText}
          </span>
        </div>

        {/* Quick Angle Jump Indicators */}
        <div style={{ display: 'flex', gap: 6 }}>
          {[0, 90, 180, 270].map((deg) => (
            <span
              key={deg}
              style={{
                fontSize: 10,
                fontWeight: 700,
                padding: '3px 6px',
                borderRadius: 4,
                background: Math.abs(angle - deg) < 30 ? accentColor : 'rgba(255,255,255,0.06)',
                color: Math.abs(angle - deg) < 30 ? '#000000' : '#94a3b8',
              }}
            >
              {deg}°
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
