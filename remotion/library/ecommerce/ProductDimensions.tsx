import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface ProductDimensionsProps {
  title?: string;
  widthMm?: string;
  heightMm?: string;
  depthMm?: string;
  weightGrams?: string;
  accentColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * ProductDimensions — CAD/blueprint millimeter dimension callout.
 * Renders precision caliper dimensional arrows, bounding box boundaries,
 * and calibrated physical measurements for hardware and retail products.
 */
export function ProductDimensions({
  title = 'PHYSICAL DIMENSIONS & FORM FACTOR',
  widthMm = '185 mm',
  heightMm = '205 mm',
  depthMm = '72 mm',
  weightGrams = '248 g',
  accentColor = '#06b6d4',
  delay = 0,
  width = 460,
  height = 480,
}: ProductDimensionsProps) {
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
        overflow: 'hidden',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Title Header */}
      <div style={{ textAlign: 'center', opacity: intro }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: accentColor, letterSpacing: '0.14em' }}>
          CALIBRATED MEASUREMENTS
        </div>
        <div style={{ fontSize: 18, fontWeight: 800, color: '#ffffff', marginTop: 2 }}>
          {title}
        </div>
      </div>

      {/* Central CAD Dimension Box */}
      <div
        style={{
          position: 'relative',
          width: 260,
          height: 220,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: intro,
        }}
      >
        {/* Bounding Box Silhouette */}
        <div
          style={{
            width: 170,
            height: 150,
            borderRadius: 16,
            border: `2px dashed ${accentColor}88`,
            background: 'rgba(6, 182, 212, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {/* Weight Badge in Center */}
          <div style={{ fontSize: 22, fontWeight: 900, color: '#ffffff' }}>
            {weightGrams}
          </div>
          <div style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase' }}>
            Total Weight
          </div>
        </div>

        {/* Top Width Arrow Callout */}
        <div
          style={{
            position: 'absolute',
            top: 6,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <svg width="170" height="18" style={{ overflow: 'visible' }}>
            <line x1="0" y1="9" x2="170" y2="9" stroke={accentColor} strokeWidth="1.5" />
            <polygon points="0,9 6,6 6,12" fill={accentColor} />
            <polygon points="170,9 164,6 164,12" fill={accentColor} />
          </svg>
          <span
            style={{
              position: 'absolute',
              top: -16,
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: 11,
              fontWeight: 800,
              color: '#ffffff',
              background: '#09090b',
              padding: '1px 6px',
            }}
          >
            {widthMm}
          </span>
        </div>

        {/* Left Height Arrow Callout */}
        <div
          style={{
            position: 'absolute',
            left: 10,
            display: 'flex',
            alignItems: 'center',
            height: 150,
          }}
        >
          <svg width="18" height="150" style={{ overflow: 'visible' }}>
            <line x1="9" y1="0" x2="9" y2="150" stroke={accentColor} strokeWidth="1.5" />
            <polygon points="9,0 6,6 12,6" fill={accentColor} />
            <polygon points="9,150 6,144 12,144" fill={accentColor} />
          </svg>
          <span
            style={{
              position: 'absolute',
              left: -38,
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: 11,
              fontWeight: 800,
              color: '#ffffff',
              background: '#09090b',
              padding: '2px 4px',
            }}
          >
            {heightMm}
          </span>
        </div>

        {/* Right Depth Callout */}
        <div
          style={{
            position: 'absolute',
            right: 15,
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '4px 8px',
            borderRadius: 6,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 9, color: '#94a3b8' }}>DEPTH</div>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#ffffff' }}>{depthMm}</div>
        </div>
      </div>

      {/* Footer Calibration Specs */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: 12,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          opacity: intro,
        }}
      >
        <span style={{ fontSize: 10, color: '#64748b' }}>ISO 9001 METROLOGY COMPLIANT</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: accentColor }}>±0.1mm PRECISION</span>
      </div>
    </div>
  );
}
