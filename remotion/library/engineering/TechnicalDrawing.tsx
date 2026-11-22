import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface TechnicalDrawingProps {
  partName?: string;
  material?: string;
  tolerance?: string;
  accentColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * TechnicalDrawing — Standard 3-view orthographic CAD projection.
 * Displays Top View (Plan), Front View (Elevation), and Right View (Profile)
 * with shared projection centerlines, dimension lines, and tolerances.
 */
export function TechnicalDrawing({
  partName = 'PRECISION BEARING HOUSING BRACKET',
  material = 'ALUMINUM 6061-T6',
  tolerance = '± 0.05 mm',
  accentColor = '#38bdf8',
  delay = 0,
  width = '100%',
  height = 380,
}: TechnicalDrawingProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = Math.max(0, frame - delay);

  // Entrance spring
  const entrySpr = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 14, stiffness: 95, mass: 0.8 },
  });

  const scale = interpolate(entrySpr, [0, 1], [0.92, 1]);
  const opacity = interpolate(entrySpr, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        backgroundColor: '#09090b',
        borderRadius: 16,
        border: '1px solid rgba(255, 255, 255, 0.12)',
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.8)',
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: 0, color: '#fff', fontSize: 16, fontWeight: 800 }}>{partName}</h3>
          <span style={{ color: '#71717a', fontSize: 11, fontFamily: 'monospace' }}>
            Material: {material} • Tol: {tolerance}
          </span>
        </div>

        <span
          style={{
            padding: '2px 8px',
            borderRadius: 6,
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            color: '#a1a1aa',
            fontSize: 10,
            fontWeight: 800,
          }}
        >
          3-VIEW ORTHOGRAPHIC
        </span>
      </div>

      {/* SVG 3-View Canvas: Top, Front, Right */}
      <div style={{ position: 'relative', flex: 1, margin: '10px 0' }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 500 220"
          preserveAspectRatio="xMidYMid meet"
          style={{ overflow: 'visible' }}
        >
          {/* Top View (Plan) */}
          <g transform="translate(100, 50)">
            <rect x="-40" y="-30" width="80" height="60" rx="4" fill="#0f172a" stroke="#fff" strokeWidth="1.5" />
            <circle cx="0" cy="0" r="16" fill="none" stroke={accentColor} strokeWidth="1.5" />
            <text y="-36" fill="#a1a1aa" fontSize="9" fontWeight="800" textAnchor="middle">TOP VIEW</text>
          </g>

          {/* Front View (Elevation) */}
          <g transform="translate(100, 160)">
            <rect x="-40" y="-30" width="80" height="60" rx="4" fill="#0f172a" stroke="#fff" strokeWidth="1.5" />
            {/* Centerline */}
            <line x1="0" y1="-40" x2="0" y2="40" stroke="#60a5fa" strokeWidth="1" strokeDasharray="6 3 2 3" />
            <text y="44" fill="#a1a1aa" fontSize="9" fontWeight="800" textAnchor="middle">FRONT VIEW</text>
          </g>

          {/* Right View (Profile) */}
          <g transform="translate(240, 160)">
            <rect x="-25" y="-30" width="50" height="60" rx="4" fill="#0f172a" stroke="#fff" strokeWidth="1.5" />
            <text y="44" fill="#a1a1aa" fontSize="9" fontWeight="800" textAnchor="middle">RIGHT VIEW</text>
          </g>

          {/* Projection Alignment Guidelines */}
          <line x1="100" y1="80" x2="100" y2="130" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="140" y1="160" x2="215" y2="160" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" strokeDasharray="3 3" />

          {/* Dimension Line Example */}
          <g transform="translate(100, 205)">
            <line x1="-40" y1="0" x2="40" y2="0" stroke="#f59e0b" strokeWidth="1.5" />
            <line x1="-40" y1="-5" x2="-40" y2="5" stroke="#f59e0b" strokeWidth="1.5" />
            <line x1="40" y1="-5" x2="40" y2="5" stroke="#f59e0b" strokeWidth="1.5" />
            <text y="-4" fill="#f59e0b" fontSize="10" fontWeight="800" textAnchor="middle" fontFamily="monospace">
              80.00 mm
            </text>
          </g>
        </svg>
      </div>

      {/* Footer Specification */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 11,
          color: '#71717a',
          fontWeight: 600,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: 8,
        }}
      >
        <span>Third Angle Projection (ISO Standard)</span>
        <span style={{ color: '#10b981' }}>Surface Finish: Ra 0.8 µm</span>
      </div>
    </div>
  );
}
