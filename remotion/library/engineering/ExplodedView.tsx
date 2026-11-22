import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface ExplodedPart {
  id: string;
  name: string;
  partNumber: string;
  yOffset: number; // expanded distance
  width: number;
  height: number;
  color?: string;
}

export interface ExplodedViewProps {
  title?: string;
  assemblyName?: string;
  parts?: ExplodedPart[];
  explode?: boolean;
  accentColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

const DEFAULT_PARTS: ExplodedPart[] = [
  { id: 'p1', name: 'Top Enclosure Housing', partNumber: 'PART #01-A', yOffset: -110, width: 220, height: 35, color: '#38bdf8' },
  { id: 'p2', name: 'Optics Glass Lens Array', partNumber: 'PART #02-B', yOffset: -55, width: 160, height: 25, color: '#10b981' },
  { id: 'p3', name: 'Neural Processing Core (SoC)', partNumber: 'PART #03-C', yOffset: 0, width: 140, height: 28, color: '#6366f1' },
  { id: 'p4', name: 'Heat Sink Thermal Dissipator', partNumber: 'PART #04-D', yOffset: 55, width: 190, height: 30, color: '#f59e0b' },
  { id: 'p5', name: 'Chassis Base Plate', partNumber: 'PART #05-E', yOffset: 110, width: 240, height: 35, color: '#94a3b8' },
];

/**
 * ExplodedView — Mechanical hardware and CAD assembly exploded view.
 * Separates sub-components along central axial guide lines with
 * progressive spring physics, leader lines, and part catalog tags.
 */
export function ExplodedView({
  title = 'Autonomous Drone Gimbal Core',
  assemblyName = 'ASSY DWG #409-REV-C',
  parts = DEFAULT_PARTS,
  explode = true,
  accentColor = '#10b981',
  delay = 0,
  width = '100%',
  height = 420,
}: ExplodedViewProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = Math.max(0, frame - delay);

  // Entrance spring
  const entrySpr = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 14, stiffness: 90, mass: 0.9 },
  });

  const separation = explode ? interpolate(entrySpr, [0, 1], [0.15, 1]) : 1;
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
        opacity,
      }}
    >
      {/* Title & CAD Spec Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: 0, color: '#fff', fontSize: 18, fontWeight: 800 }}>{title}</h3>
          <span style={{ color: '#71717a', fontSize: 12, fontFamily: 'monospace' }}>{assemblyName}</span>
        </div>

        <span
          style={{
            padding: '3px 10px',
            borderRadius: 6,
            backgroundColor: `${accentColor}20`,
            border: `1px solid ${accentColor}60`,
            color: accentColor,
            fontSize: 11,
            fontWeight: 800,
          }}
        >
          CAD EXPLODED VIEW
        </span>
      </div>

      {/* Main Assembly Exploded Canvas */}
      <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg
          width="100%"
          height={height - 120}
          viewBox="-250 -160 500 320"
          style={{ overflow: 'visible' }}
        >
          {/* Central Axial Alignment Dash Line */}
          <line
            x1="0"
            y1="-140"
            x2="0"
            y2="140"
            stroke="rgba(255, 255, 255, 0.25)"
            strokeWidth="1.5"
            strokeDasharray="6 4"
          />

          {/* Parts Stack */}
          {parts.map((p) => {
            const currentY = p.yOffset * separation;
            const partColor = p.color || accentColor;

            return (
              <g key={p.id} transform={`translate(0, ${currentY})`}>
                {/* 3D Isometric-styled Hardware Component */}
                <rect
                  x={-p.width / 2}
                  y={-p.height / 2}
                  width={p.width}
                  height={p.height}
                  rx="6"
                  fill="#0f172a"
                  stroke={partColor}
                  strokeWidth="2"
                  filter={`drop-shadow(0 0 10px ${partColor}40)`}
                />

                {/* Subtle internal mechanical detail line */}
                <line
                  x1={-p.width / 2 + 15}
                  y1="0"
                  x2={p.width / 2 - 15}
                  y2="0"
                  stroke={partColor}
                  strokeWidth="1"
                  strokeDasharray="4 3"
                  opacity="0.6"
                />

                {/* Leader Line to Label */}
                <polyline
                  points={`${p.width / 2 + 5},0 ${p.width / 2 + 35},0 ${p.width / 2 + 50},-8`}
                  fill="none"
                  stroke={partColor}
                  strokeWidth="1.5"
                />

                {/* Part Catalog Badge */}
                <g transform={`translate(${p.width / 2 + 55}, -16)`}>
                  <rect
                    x="0"
                    y="0"
                    width="120"
                    height="24"
                    rx="4"
                    fill="rgba(9, 9, 11, 0.85)"
                    stroke="rgba(255, 255, 255, 0.15)"
                    strokeWidth="1"
                  />
                  <text x="6" y="11" fill="#fff" fontSize="9" fontWeight="800">
                    {p.partNumber}
                  </text>
                  <text x="6" y="20" fill="#a1a1aa" fontSize="8" fontWeight="600">
                    {p.name.slice(0, 18)}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Footer Info */}
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
        <span>Parts Count: {parts.length} Components</span>
        <span style={{ color: '#10b981' }}>Tolerances: ISO 2768-mK Verified</span>
      </div>
    </div>
  );
}
