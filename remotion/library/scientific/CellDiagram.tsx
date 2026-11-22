import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface CellOrganelle {
  name: string;
  role: string;
  color: string;
  x: number;
  y: number;
  radius?: number;
}

export interface CellDiagramProps {
  title?: string;
  organelles?: CellOrganelle[];
  accentColor?: string;
  membraneColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

const DEFAULT_ORGANELLES: CellOrganelle[] = [
  { name: 'Nucleus', role: 'Genetic Code (DNA)', color: '#6366f1', x: 0, y: -10, radius: 42 },
  { name: 'Mitochondria', role: 'ATP Cellular Energy', color: '#ef4444', x: -65, y: 40, radius: 22 },
  { name: 'Endoplasmic Reticulum', role: 'Protein Synthesis', color: '#38bdf8', x: 60, y: 35, radius: 26 },
  { name: 'Ribosomes', role: 'Translation Machinery', color: '#10b981', x: -55, y: -50, radius: 14 },
];

/**
 * CellDiagram — Biological animal/plant eukaryotic cell model.
 * Cross-section visualization with lipid bilayer membrane,
 * labeled organelles, and energetic cytoplasmic flow.
 */
export function CellDiagram({
  title = 'Eukaryotic Animal Cell Architecture',
  organelles = DEFAULT_ORGANELLES,
  accentColor = '#10b981',
  membraneColor = '#38bdf8',
  delay = 0,
  width = '100%',
  height = 360,
}: CellDiagramProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = Math.max(0, frame - delay);

  // Entrance spring
  const entrySpr = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 14, stiffness: 95, mass: 0.8 },
  });

  const scale = interpolate(entrySpr, [0, 1], [0.85, 1]);
  const opacity = interpolate(entrySpr, [0, 1], [0, 1]);

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
        height={height - 60}
        viewBox={`-${height / 2} -${(height - 60) / 2} ${height} ${height - 60}`}
        style={{ overflow: 'visible' }}
      >
        <defs>
          <radialGradient id="cytoplasm-grad" cx="45%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#1e293b" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#0f172a" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#020617" stopOpacity="1" />
          </radialGradient>
        </defs>

        {/* Outer Plasma Membrane (Bilayer) */}
        <ellipse
          cx="0"
          cy="0"
          rx="135"
          ry="110"
          fill="url(#cytoplasm-grad)"
          stroke={membraneColor}
          strokeWidth="3.5"
          filter="drop-shadow(0 0 12px rgba(56, 189, 248, 0.4))"
        />

        {/* Inner Cytoskeleton web lines */}
        <ellipse
          cx="0"
          cy="0"
          rx="125"
          ry="100"
          fill="none"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth="1.5"
          strokeDasharray="6 4"
        />

        {/* Organelles */}
        {organelles.map((org, i) => {
          const r = org.radius || 24;
          const floatOffset = Math.sin(adjustedFrame * 0.05 + i) * 3;

          return (
            <g key={i} transform={`translate(${org.x}, ${org.y + floatOffset})`}>
              <circle
                r={r}
                fill={org.color}
                opacity="0.85"
                filter={`drop-shadow(0 0 8px ${org.color}80)`}
              />
              <circle
                r={r * 0.4}
                fill="#ffffff"
                opacity="0.6"
              />
            </g>
          );
        })}
      </svg>

      {/* Organelle Legend Card */}
      <div
        style={{
          position: 'absolute',
          bottom: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '6px 16px',
          borderRadius: 8,
          backgroundColor: 'rgba(9, 9, 11, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
        }}
      >
        {organelles.slice(0, 3).map((org, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                backgroundColor: org.color,
              }}
            />
            <span style={{ color: '#e4e4e7', fontSize: 11, fontWeight: 600 }}>{org.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
