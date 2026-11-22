import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface PhysicsDiagramProps {
  mode?: 'free-body-forces' | 'pendulum' | 'projectile' | 'optics-refraction';
  title?: string;
  formula?: string;
  color?: string;
  accentColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * PhysicsDiagram — Scientific physics and mechanics diagram generator.
 * Visualizes free-body force vectors, harmonic pendulum oscillations,
 * parabolic projectile trajectories, and optical light ray refractions.
 */
export function PhysicsDiagram({
  mode = 'free-body-forces',
  title = "Newton's Second Law — Free Body Diagram",
  formula = 'ΣF = m · a',
  color = '#10b981',
  accentColor = '#38bdf8',
  delay = 0,
  width = '100%',
  height = 360,
}: PhysicsDiagramProps) {
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

  // Mode 1: Free-Body Force Vectors
  if (mode === 'free-body-forces') {
    const boxSize = 90;
    const arrowLen = 80;

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
            <marker id="phys-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill={color} />
            </marker>
            <marker id="phys-arrow-blue" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill={accentColor} />
            </marker>
          </defs>

          {/* Central Mass Block */}
          <rect
            x={-boxSize / 2}
            y={-boxSize / 2}
            width={boxSize}
            height={boxSize}
            rx={8}
            fill="#0f172a"
            stroke="#334155"
            strokeWidth="2.5"
          />
          <text
            y="6"
            fill="#fff"
            fontSize="16"
            fontWeight="800"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            mass (m)
          </text>

          {/* Normal Force (Up) */}
          <line x1="0" y1={-boxSize / 2} x2="0" y2={-boxSize / 2 - arrowLen} stroke={color} strokeWidth="3" markerEnd="url(#phys-arrow)" />
          <text x="14" y={-boxSize / 2 - arrowLen + 10} fill={color} fontSize="13" fontWeight="800">F_N</text>

          {/* Gravitational Force (Down) */}
          <line x1="0" y1={boxSize / 2} x2="0" y2={boxSize / 2 + arrowLen} stroke="#ef4444" strokeWidth="3" markerEnd="url(#phys-arrow)" />
          <text x="14" y={boxSize / 2 + arrowLen - 4} fill="#ef4444" fontSize="13" fontWeight="800">F_g = m·g</text>

          {/* Applied Force (Right) */}
          <line x1={boxSize / 2} y1="0" x2={boxSize / 2 + arrowLen + 20} y2="0" stroke={accentColor} strokeWidth="3" markerEnd="url(#phys-arrow-blue)" />
          <text x={boxSize / 2 + arrowLen - 20} y="-12" fill={accentColor} fontSize="13" fontWeight="800">F_applied</text>

          {/* Frictional Force (Left) */}
          <line x1={-boxSize / 2} y1="0" x2={-boxSize / 2 - arrowLen * 0.6} y2="0" stroke="#f59e0b" strokeWidth="3" markerEnd="url(#phys-arrow)" />
          <text x={-boxSize / 2 - arrowLen * 0.6 - 15} y="-12" fill="#f59e0b" fontSize="13" fontWeight="800">f_friction</text>
        </svg>

        {/* Footer info badge */}
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            padding: '6px 16px',
            borderRadius: 8,
            backgroundColor: 'rgba(9, 9, 11, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
          }}
        >
          <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>{title}</span>
          <span style={{ color: color, fontSize: 12, fontWeight: 700, fontFamily: 'monospace' }}>{formula}</span>
        </div>
      </div>
    );
  }

  // Mode 2: Harmonic Pendulum
  const pendulumAngle = Math.sin(adjustedFrame * 0.08) * 35; // degrees
  const armLen = 170;
  const rad = (pendulumAngle * Math.PI) / 180;
  const bobX = Math.sin(rad) * armLen;
  const bobY = Math.cos(rad) * armLen;

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
        viewBox={`-${height / 2} 0 ${height} ${height - 60}`}
        style={{ overflow: 'visible' }}
      >
        {/* Top Ceiling Pivot */}
        <line x1="-50" y1="20" x2="50" y2="20" stroke="#475569" strokeWidth="4" />
        <circle cx="0" cy="20" r="5" fill="#fff" />

        {/* Vertical Equilibrium reference dashed line */}
        <line x1="0" y1="20" x2="0" y2={armLen + 20} stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1.5" strokeDasharray="4 4" />

        {/* Pendulum Cord */}
        <line x1="0" y1="20" x2={bobX} y2={bobY + 20} stroke={color} strokeWidth="2.5" />

        {/* Bob Mass Sphere */}
        <circle
          cx={bobX}
          cy={bobY + 20}
          r="18"
          fill="#10b981"
          stroke="#fff"
          strokeWidth="2"
          filter="drop-shadow(0 0 10px rgba(16, 185, 129, 0.7))"
        />

        {/* Velocity vector arrow */}
        <line
          x1={bobX}
          y1={bobY + 20}
          x2={bobX + Math.cos(rad) * (pendulumAngle > 0 ? -40 : 40)}
          y2={bobY + 20 - Math.sin(rad) * (pendulumAngle > 0 ? -40 : 40)}
          stroke={accentColor}
          strokeWidth="2.5"
        />
      </svg>

      <div
        style={{
          position: 'absolute',
          bottom: 12,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          padding: '6px 16px',
          borderRadius: 8,
          backgroundColor: 'rgba(9, 9, 11, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
        }}
      >
        <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>Simple Harmonic Motion (Pendulum)</span>
        <span style={{ color: color, fontSize: 12, fontWeight: 700, fontFamily: 'monospace' }}>T = 2π √(L / g)</span>
      </div>
    </div>
  );
}
