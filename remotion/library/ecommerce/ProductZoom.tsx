import React from 'react';
import { Img, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface ProductZoomProps {
  title?: string;
  zoomLevel?: string;
  productName?: string;
  imageSrc?: string;
  detailLabel?: string;
  accentColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * ProductZoom — Macro inspection lens & precision zoom callout.
 * Glides an interactive optical magnifying lens over high-detail product areas
 * with crosshairs, micron scale, and micro-texture magnification.
 */
export function ProductZoom({
  title = 'MACRO TEXTURE INSPECTION',
  zoomLevel = '10X OPTICAL ZOOM',
  productName = 'Ceramic Matte Coating & Chamfered Edge',
  imageSrc = 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80',
  detailLabel = 'Nano-particle vapor deposition finish',
  accentColor = '#8b5cf6',
  delay = 0,
  width = 460,
  height = 500,
}: ProductZoomProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const intro = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  // Loupe movement path
  const loupeX = 230 + Math.sin(t * 0.05) * 45;
  const loupeY = 220 + Math.cos(t * 0.06) * 35;

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 20px',
        boxSizing: 'border-box',
        background: '#09090b',
        borderRadius: 24,
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
        overflow: 'hidden',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
          opacity: intro,
        }}
      >
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, color: accentColor, letterSpacing: '0.12em' }}>
            {title}
          </div>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#ffffff', marginTop: 2 }}>
            {productName}
          </div>
        </div>

        {/* Zoom Level Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: `${accentColor}22`,
            padding: '6px 12px',
            borderRadius: 8,
            border: `1px solid ${accentColor}55`,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="11" y1="8" x2="11" y2="14" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
          <span style={{ fontSize: 11, fontWeight: 800, color: '#ffffff' }}>
            {zoomLevel}
          </span>
        </div>
      </div>

      {/* Main Product Canvas with Loupe */}
      <div
        style={{
          position: 'relative',
          flex: 1,
          borderRadius: 16,
          overflow: 'hidden',
          background: '#18181b',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Base Product Image */}
        <div style={{ width: '80%', height: '80%', position: 'relative' }}>
          <Img
            src={imageSrc}
            alt={productName}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              filter: 'brightness(0.9)',
            }}
          />
        </div>

        {/* Magnifying Loupe Overlay Lens */}
        <div
          style={{
            position: 'absolute',
            left: loupeX - 60,
            top: loupeY - 60,
            width: 120,
            height: 120,
            borderRadius: '50%',
            border: `2px solid ${accentColor}`,
            boxShadow: `0 0 25px ${accentColor}66, inset 0 0 20px rgba(255,255,255,0.2)`,
            overflow: 'hidden',
            pointerEvents: 'none',
            zIndex: 10,
            background: '#18181b',
          }}
        >
          {/* Magnified Product Image */}
          <div
            style={{
              width: 360,
              height: 360,
              position: 'absolute',
              left: -(loupeX * 1.5) + 60,
              top: -(loupeY * 1.5) + 60,
            }}
          >
            <Img
              src={imageSrc}
              alt={productName}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                transform: 'scale(1.8)',
              }}
            />
          </div>

          {/* Crosshairs Inside Loupe */}
          <svg
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
            }}
          >
            <line x1="60" y1="20" x2="60" y2="100" stroke={accentColor} strokeWidth="1" strokeDasharray="2 2" />
            <line x1="20" y1="60" x2="100" y2="60" stroke={accentColor} strokeWidth="1" strokeDasharray="2 2" />
            <circle cx="60" cy="60" r="14" fill="none" stroke={accentColor} strokeWidth="1.5" />
          </svg>
        </div>
      </div>

      {/* Footer Detail Callout */}
      <div
        style={{
          marginTop: 14,
          padding: '10px 14px',
          borderRadius: 12,
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          opacity: intro,
        }}
      >
        <span style={{ fontSize: 12, color: '#e2e8f0', fontWeight: 600 }}>
          {detailLabel}
        </span>
        <span style={{ fontSize: 11, color: accentColor, fontWeight: 700 }}>
          0.05μm Grain
        </span>
      </div>
    </div>
  );
}
