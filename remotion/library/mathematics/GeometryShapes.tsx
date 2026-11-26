import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface GeometryShapesProps {
  type?: 'right-triangle' | 'circle-angles' | 'pythagorean-theorem' | 'polygon-inscribed';
  a?: number; // Side a
  b?: number; // Side b
  accentColor?: string;
  showAngleArcs?: boolean;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * GeometryShapes — Euclidean geometry and trigonometry visualizer.
 * Renders right-angled triangles with Pythagorean theorem values (a² + b² = c²),
 * angle arc indicators (θ, 90° square), and hypotenuse vectors.
 */
export function GeometryShapes({
  type = 'pythagorean-theorem',
  a = 160,
  b = 120,
  accentColor = '#10b981',
  showAngleArcs = true,
  delay = 0,
  width = '100%',
  height = 360,
}: GeometryShapesProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = Math.max(0, frame - delay);

  // Entrance spring
  const entrySpr = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  const scale = interpolate(entrySpr, [0, 1], [0.85, 1]);
  const opacity = interpolate(entrySpr, [0, 1], [0, 1]);

  // Hypotenuse c
  const c = Math.sqrt(a * a + b * b);

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
        <div>
          <h3 style={{ margin: 0, color: '#fff', fontSize: 18, fontWeight: 800 }}>
            Euclidean Right-Angle Geometry
          </h3>
          <span style={{ color: '#71717a', fontSize: 12 }}>Pythagorean Theorem: a² + b² = c²</span>
        </div>

        <span
          style={{
            padding: '4px 12px',
            borderRadius: 6,
            backgroundColor: `${accentColor}20`,
            border: `1px solid ${accentColor}60`,
            color: accentColor,
            fontSize: 12,
            fontWeight: 800,
            fontFamily: 'monospace',
          }}
        >
          c = {c.toFixed(1)} px
        </span>
      </div>

      {/* SVG Geometry Canvas */}
      <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg
          width={a + 120}
          height={b + 80}
          viewBox={`-40 -40 ${a + 80} ${b + 80}`}
          style={{ overflow: 'visible' }}
        >
          {/* Shaded Triangle Surface */}
          <polygon
            points={`0,${b} ${a},${b} 0,0`}
            fill={`${accentColor}18`}
            stroke={accentColor}
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* 90-degree square marker */}
          <polygon
            points={`0,${b - 16} 16,${b - 16} 16,${b} 0,${b}`}
            fill="none"
            stroke="#fff"
            strokeWidth="1.5"
          />

          {/* Angle theta arc at top vertex */}
          {showAngleArcs && (
            <path
              d={`M 0 25 A 25 25 0 0 0 ${25 * Math.sin(Math.atan(a / b))} ${25 * Math.cos(Math.atan(a / b))}`}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2"
            />
          )}

          {/* Side a (Horizontal base) */}
          <text
            x={a / 2}
            y={b + 26}
            fill="#fff"
            fontSize="14"
            fontWeight="800"
            textAnchor="middle"
            fontFamily="monospace"
          >
            a = {a}
          </text>

          {/* Side b (Vertical leg) */}
          <text
            x="-26"
            y={b / 2}
            fill="#fff"
            fontSize="14"
            fontWeight="800"
            textAnchor="middle"
            fontFamily="monospace"
          >
            b = {b}
          </text>

          {/* Hypotenuse c */}
          <text
            x={a / 2 + 16}
            y={b / 2 - 10}
            fill={accentColor}
            fontSize="15"
            fontWeight="900"
            textAnchor="middle"
            fontFamily="monospace"
          >
            c = {c.toFixed(1)}
          </text>
        </svg>
      </div>

      {/* Footer Proof Badge */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: 10,
          fontSize: 11,
          color: '#71717a',
          fontWeight: 600,
        }}
      >
        <span>Base² + Alt² = {a * a} + {b * b} = {c * c}</span>
        <span style={{ color: '#10b981' }}>Q.E.D. Verifiable</span>
      </div>
    </div>
  );
}
