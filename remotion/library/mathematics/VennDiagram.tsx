import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface VennDiagramProps {
  setALabel?: string;
  setBLabel?: string;
  setACount?: string;
  setBCount?: string;
  intersectionCount?: string;
  intersectionLabel?: string;
  colorA?: string;
  colorB?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * VennDiagram — Mathematical set theory Venn diagram visualizer.
 * Renders intersecting set circles with shaded union/intersection regions
 * and labeled cardinality counts.
 */
export function VennDiagram({
  setALabel = 'Set A: Machine Learning',
  setBLabel = 'Set B: Creative Storytelling',
  setACount = '68%',
  setBCount = '54%',
  intersectionCount = '32%',
  intersectionLabel = 'A ∩ B (Itnavideo Core)',
  colorA = '#38bdf8',
  colorB = '#10b981',
  delay = 0,
  width = '100%',
  height = 340,
}: VennDiagramProps) {
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

  const radius = 80;

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        backgroundColor: '#09090b',
        borderRadius: 16,
        border: 'none',
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
        <h3 style={{ margin: 0, color: '#fff', fontSize: 16, fontWeight: 800 }}>
          Set Theory Intersection
        </h3>
        <span
          style={{
            padding: '2px 8px',
            borderRadius: 6,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: '#a1a1aa',
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          {intersectionLabel}
        </span>
      </div>

      {/* SVG Venn Circles */}
      <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg
          width={radius * 3.5}
          height={radius * 2.2}
          viewBox={`-${radius * 1.75} -${radius * 1.1} ${radius * 3.5} ${radius * 2.2}`}
          style={{ overflow: 'visible' }}
        >
          {/* Circle A */}
          <circle
            cx="-45"
            cy="0"
            r={radius}
            fill={colorA}
            fillOpacity="0.25"
            stroke={colorA}
            strokeWidth="3"
            filter={`drop-shadow(0 0 12px ${colorA}40)`}
          />

          {/* Circle B */}
          <circle
            cx="45"
            cy="0"
            r={radius}
            fill={colorB}
            fillOpacity="0.25"
            stroke={colorB}
            strokeWidth="3"
            filter={`drop-shadow(0 0 12px ${colorB}40)`}
          />

          {/* Circle A Label Text */}
          <text x="-75" y="5" fill="#fff" fontSize="16" fontWeight="900" textAnchor="middle">
            {setACount}
          </text>

          {/* Circle B Label Text */}
          <text x="75" y="5" fill="#fff" fontSize="16" fontWeight="900" textAnchor="middle">
            {setBCount}
          </text>

          {/* Intersection Center Text */}
          <text x="0" y="5" fill="#ffffff" fontSize="18" fontWeight="900" textAnchor="middle">
            {intersectionCount}
          </text>
        </svg>
      </div>

      {/* Footer Set Descriptions */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: 10,
          fontSize: 11,
          color: '#d4d4d8',
          fontWeight: 600,
        }}
      >
        <span style={{ color: colorA }}>{setALabel}</span>
        <span style={{ color: colorB }}>{setBLabel}</span>
      </div>
    </div>
  );
}
