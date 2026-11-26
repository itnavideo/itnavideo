import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface ElectronParticle {
  orbitIndex: number;
  speed: number;
  color?: string;
  offset?: number;
}

export interface AtomDiagramProps {
  elementName?: string;
  symbol?: string;
  atomicNumber?: number;
  atomicMass?: string;
  orbits?: number;
  electrons?: number;
  nucleusColor?: string;
  orbitColor?: string;
  electronColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * AtomDiagram — Rutherford-Bohr atom orbital model.
 * Features central proton/neutron nucleus cluster, rotating multi-plane
 * elliptical electron rings, and high-velocity orbiting electron particles.
 */
export function AtomDiagram({
  elementName = 'Carbon',
  symbol = 'C',
  atomicNumber = 6,
  atomicMass = '12.011 u',
  orbits = 3,
  electrons = 6,
  nucleusColor = '#ef4444',
  orbitColor = '#38bdf8',
  electronColor = '#38bdf8',
  delay = 0,
  width = '100%',
  height = 360,
}: AtomDiagramProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = Math.max(0, frame - delay);

  // Entrance spring
  const entrySpr = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  const scale = interpolate(entrySpr, [0, 1], [0.8, 1]);
  const opacity = interpolate(entrySpr, [0, 1], [0, 1]);

  const radiusX = 130;
  const radiusY = 50;

  // Angles for the orbital planes (e.g. 0, 60, 120 degrees)
  const orbitAngles = [0, 60, 120];

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      <svg
        width={height}
        height={height}
        viewBox={`-${height / 2} -${height / 2} ${height} ${height}`}
        style={{ overflow: 'visible' }}
      >
        {/* Orbital Ellipses */}
        {orbitAngles.map((angle, idx) => (
          <ellipse
            key={idx}
            cx="0"
            cy="0"
            rx={radiusX}
            ry={radiusY}
            fill="none"
            stroke={orbitColor}
            strokeWidth="1.5"
            strokeOpacity="0.4"
            strokeDasharray="4 4"
            transform={`rotate(${angle})`}
          />
        ))}

        {/* Orbiting Electrons */}
        {Array.from({ length: electrons }).map((_, i) => {
          const orbitIdx = i % orbitAngles.length;
          const orbitAngle = orbitAngles[orbitIdx];
          const speedMod = 1 + (i % 2) * 0.3;
          const theta = adjustedFrame * 0.08 * speedMod + (i * Math.PI) / 3;

          // Compute elliptical position
          const unrotX = radiusX * Math.cos(theta);
          const unrotY = radiusY * Math.sin(theta);

          // Apply orbit rotation angle
          const rad = (orbitAngle * Math.PI) / 180;
          const x = unrotX * Math.cos(rad) - unrotY * Math.sin(rad);
          const y = unrotX * Math.sin(rad) + unrotY * Math.cos(rad);

          return (
            <g key={i} transform={`translate(${x}, ${y})`}>
              <circle
                r="6"
                fill={electronColor}
                filter="drop-shadow(0px 0px 8px #38bdf8)"
              />
              <circle
                r="2"
                fill="#ffffff"
              />
            </g>
          );
        })}

        {/* Central Nucleus (Protons & Neutrons Cluster) */}
        <g>
          {/* Nucleus Glow Halo */}
          <circle
            cx="0"
            cy="0"
            r="36"
            fill={nucleusColor}
            opacity="0.25"
            filter="blur(8px)"
          />

          {/* Nucleus Core Sphere */}
          <circle
            cx="0"
            cy="0"
            r="28"
            fill="url(#nucleus-grad)"
            stroke={nucleusColor}
            strokeWidth="2"
          />

          <defs>
            <radialGradient id="nucleus-grad" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#fff" />
              <stop offset="40%" stopColor={nucleusColor} />
              <stop offset="100%" stopColor="#450a0a" />
            </radialGradient>
          </defs>

          {/* Element Symbol */}
          <text
            y="7"
            fill="#ffffff"
            fontSize="20"
            fontWeight="900"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            {symbol}
          </text>
        </g>
      </svg>

      {/* Periodic Table Element Tag */}
      <div
        style={{
          position: 'absolute',
          bottom: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '8px 16px',
          borderRadius: 10,
          backgroundColor: 'rgba(9, 9, 11, 0.85)',
          backdropFilter: 'blur(12px)',
          border: 'none',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            lineHeight: 1,
          }}
        >
          <span style={{ fontSize: 10, color: '#a1a1aa' }}>Z</span>
          <span style={{ fontSize: 16, fontWeight: 800, color: '#38bdf8' }}>
            {atomicNumber}
          </span>
        </div>

        <div style={{ height: 24, width: 1, backgroundColor: 'rgba(255, 255, 255, 0.15)' }} />

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>{elementName}</span>
          <span style={{ color: '#71717a', fontSize: 11, fontFamily: 'monospace' }}>
            {atomicMass}
          </span>
        </div>
      </div>
    </div>
  );
}
