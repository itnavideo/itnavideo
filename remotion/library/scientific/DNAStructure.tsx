import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface BasePair {
  label1: 'A' | 'T' | 'C' | 'G';
  label2: 'T' | 'A' | 'G' | 'C';
}

export interface DNAStructureProps {
  pairsCount?: number;
  width?: number | string;
  height?: number;
  helixRadius?: number;
  rotationSpeed?: number;
  colorStrand1?: string;
  colorStrand2?: string;
  sequenceTitle?: string;
  delay?: number;
}

const BASE_COLORS: Record<string, string> = {
  A: '#10b981', // Adenine (Green)
  T: '#ef4444', // Thymine (Red)
  C: '#38bdf8', // Cytosine (Blue)
  G: '#f59e0b', // Guanine (Amber)
};

/**
 * DNAStructure — Animated 3D double helix genetic structure.
 * Features twisting nucleotide base pairs (Adenine-Thymine, Cytosine-Guanine),
 * continuous vertical 3D sinusoidal wave rotation, and sequence readouts.
 */
export function DNAStructure({
  pairsCount = 18,
  width = '100%',
  height = 420,
  helixRadius = 60,
  rotationSpeed = 1,
  colorStrand1 = '#10b981',
  colorStrand2 = '#38bdf8',
  sequenceTitle = 'HOMO SAPIENS CHROMOSOME 1',
  delay = 0,
}: DNAStructureProps) {
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

  const rotation = adjustedFrame * 0.05 * rotationSpeed;
  const rowHeight = (height - 80) / pairsCount;

  // Base pair sequence cycle
  const bases = [
    { label1: 'A', label2: 'T' },
    { label1: 'G', label2: 'C' },
    { label1: 'T', label2: 'A' },
    { label1: 'C', label2: 'G' },
    { label1: 'A', label2: 'T' },
    { label1: 'C', label2: 'G' },
  ] as const;

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
        width={helixRadius * 2 + 100}
        height={height - 60}
        viewBox={`-${helixRadius + 50} 0 ${helixRadius * 2 + 100} ${height - 60}`}
        style={{ overflow: 'visible' }}
      >
        {Array.from({ length: pairsCount }).map((_, i) => {
          const y = i * rowHeight + 20;
          const phase = i * 0.45 + rotation;

          // 3D coordinates on circular helix
          const x1 = Math.sin(phase) * helixRadius;
          const z1 = Math.cos(phase);

          const x2 = Math.sin(phase + Math.PI) * helixRadius;
          const z2 = Math.cos(phase + Math.PI);

          const basePair = bases[i % bases.length];
          const color1 = BASE_COLORS[basePair.label1] || colorStrand1;
          const color2 = BASE_COLORS[basePair.label2] || colorStrand2;

          // Depth opacity
          const bridgeOpacity = 0.3 + ((z1 + 1) / 2) * 0.7;

          return (
            <g key={i}>
              {/* Hydrogen Bond Horizontal Rung */}
              <line
                x1={x1}
                y1={y}
                x2={(x1 + x2) / 2}
                y2={y}
                stroke={color1}
                strokeWidth="3.5"
                strokeLinecap="round"
                opacity={bridgeOpacity}
              />
              <line
                x1={(x1 + x2) / 2}
                y1={y}
                x2={x2}
                y2={y}
                stroke={color2}
                strokeWidth="3.5"
                strokeLinecap="round"
                opacity={bridgeOpacity}
              />

              {/* Strand 1 Phosphate Backbone Sphere */}
              <circle
                cx={x1}
                cy={y}
                r={6 + z1 * 2}
                fill={colorStrand1}
                filter="drop-shadow(0 0 6px rgba(16, 185, 129, 0.6))"
              />

              {/* Strand 2 Phosphate Backbone Sphere */}
              <circle
                cx={x2}
                cy={y}
                r={6 + z2 * 2}
                fill={colorStrand2}
                filter="drop-shadow(0 0 6px rgba(56, 189, 248, 0.6))"
              />
            </g>
          );
        })}
      </svg>

      {/* Sequence Header & Legend Card */}
      <div
        style={{
          position: 'absolute',
          bottom: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          padding: '6px 16px',
          borderRadius: 8,
          backgroundColor: 'rgba(9, 9, 11, 0.85)',
          border: 'none',
        }}
      >
        <span style={{ color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em' }}>
          {sequenceTitle}
        </span>
        <div style={{ display: 'flex', gap: 12, fontSize: 11, fontWeight: 700 }}>
          <span style={{ color: BASE_COLORS.A }}>A: Adenine</span>
          <span style={{ color: BASE_COLORS.T }}>T: Thymine</span>
          <span style={{ color: BASE_COLORS.C }}>C: Cytosine</span>
          <span style={{ color: BASE_COLORS.G }}>G: Guanine</span>
        </div>
      </div>
    </div>
  );
}
