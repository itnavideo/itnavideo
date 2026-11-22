import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface CrossSectionProps {
  title?: string;
  componentType?: 'piston-cylinder' | 'turbofan-duct' | 'pressure-vessel';
  accentColor?: string;
  showHatching?: boolean;
  showDimensions?: boolean;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * CrossSection — Mechanical & structural cutaway cross-section view.
 * Features ANSI 45-degree crosshatch section lines, internal chambers,
 * dimension callout arrows, and fluid flow direction indicators.
 */
export function CrossSection({
  title = 'Internal Combustion Cylinder Cutaway',
  componentType = 'piston-cylinder',
  accentColor = '#38bdf8',
  showHatching = true,
  showDimensions = true,
  delay = 0,
  width = '100%',
  height = 360,
}: CrossSectionProps) {
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

  // Animated piston stroke movement
  const strokeY = Math.sin(adjustedFrame * 0.1) * 35;

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
          <h3 style={{ margin: 0, color: '#fff', fontSize: 18, fontWeight: 800 }}>{title}</h3>
          <span style={{ color: '#71717a', fontSize: 12 }}>Section A-A • Scale 1:2.5</span>
        </div>

        <span
          style={{
            padding: '3px 10px',
            borderRadius: 6,
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            color: '#a1a1aa',
            fontSize: 11,
            fontWeight: 800,
          }}
        >
          CUTAWAY SECTION
        </span>
      </div>

      {/* SVG Cross-Section Drawing Area */}
      <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg
          width="400"
          height="220"
          viewBox="-200 -110 400 220"
          style={{ overflow: 'visible' }}
        >
          <defs>
            {/* ANSI 45-degree Hatching Pattern for Cut Solid Metal */}
            <pattern id="cs-metal-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="1" />
            </pattern>
          </defs>

          {/* Left Cylinder Wall (Cut cross section with hatch) */}
          <rect
            x="-130"
            y="-90"
            width="35"
            height="180"
            fill={showHatching ? 'url(#cs-metal-hatch)' : '#1e293b'}
            stroke="#fff"
            strokeWidth="1.5"
          />

          {/* Right Cylinder Wall (Cut cross section with hatch) */}
          <rect
            x="95"
            y="-90"
            width="35"
            height="180"
            fill={showHatching ? 'url(#cs-metal-hatch)' : '#1e293b'}
            stroke="#fff"
            strokeWidth="1.5"
          />

          {/* Internal Piston Head (Animated stroke) */}
          <g transform={`translate(0, ${strokeY})`}>
            <rect
              x="-90"
              y="-40"
              width="180"
              height="60"
              rx="4"
              fill="#0f172a"
              stroke={accentColor}
              strokeWidth="2.5"
              filter={`drop-shadow(0 0 10px ${accentColor}50)`}
            />

            {/* Piston Rings slots */}
            <line x1="-90" y1="-28" x2="90" y2="-28" stroke="#fff" strokeWidth="1.5" opacity="0.4" />
            <line x1="-90" y1="-18" x2="90" y2="-18" stroke="#fff" strokeWidth="1.5" opacity="0.4" />

            {/* Connecting Rod */}
            <rect
              x="-12"
              y="20"
              width="24"
              height="80"
              fill="#1e293b"
              stroke="#94a3b8"
              strokeWidth="1.5"
            />
          </g>

          {/* Dimension Measurement Callout */}
          {showDimensions && (
            <g transform="translate(0, 105)">
              <line x1="-95" y1="0" x2="95" y2="0" stroke="#f59e0b" strokeWidth="1.5" />
              <line x1="-95" y1="-6" x2="-95" y2="6" stroke="#f59e0b" strokeWidth="1.5" />
              <line x1="95" y1="-6" x2="95" y2="6" stroke="#f59e0b" strokeWidth="1.5" />
              <text y="-4" fill="#f59e0b" fontSize="11" fontWeight="800" textAnchor="middle" fontFamily="monospace">
                Ø 190.00 mm BORE
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Footer Readout */}
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
        <span>Compression Ratio: 10.5 : 1</span>
        <span style={{ color: '#10b981' }}>Material: High-Tensile Cast Iron G25</span>
      </div>
    </div>
  );
}
