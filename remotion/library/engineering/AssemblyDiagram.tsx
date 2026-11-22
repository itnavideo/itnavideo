import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface AssemblyStep {
  stepNumber: number;
  action: string;
  fasteners: string;
  torque?: string;
  toolRequired?: string;
}

export interface AssemblyDiagramProps {
  title?: string;
  step?: AssemblyStep;
  totalSteps?: number;
  accentColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

const DEFAULT_ASSEMBLY_STEP: AssemblyStep = {
  stepNumber: 2,
  action: 'Fasten Stator Housing to Chassis Base Plate',
  fasteners: '4x M4×12mm Socket Head Cap Screws',
  torque: '2.5 N·m',
  toolRequired: '3mm Hex Key',
};

/**
 * AssemblyDiagram — Manufacturing and mechanical assembly instruction card.
 * Features assembly step numbering, fastener callouts, torque specs,
 * and tightening directional rotation arrows.
 */
export function AssemblyDiagram({
  title = 'Hardware Assembly Instructions',
  step = DEFAULT_ASSEMBLY_STEP,
  totalSteps = 6,
  accentColor = '#10b981',
  delay = 0,
  width = '100%',
  height = 360,
}: AssemblyDiagramProps) {
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
          <h3 style={{ margin: 0, color: '#fff', fontSize: 18, fontWeight: 800 }}>{title}</h3>
          <span style={{ color: accentColor, fontSize: 12, fontWeight: 800 }}>
            STEP {step.stepNumber} OF {totalSteps}
          </span>
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
          TORQUE: {step.torque}
        </span>
      </div>

      {/* Main Visual Graphic: Component with Fasteners */}
      <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg
          width="360"
          height="180"
          viewBox="-180 -90 360 180"
          style={{ overflow: 'visible' }}
        >
          {/* Base Chassis */}
          <rect x="-110" y="20" width="220" height="40" rx="4" fill="#18181b" stroke="#fff" strokeWidth="1.5" />

          {/* Stator Unit */}
          <rect x="-70" y="-40" width="140" height="60" rx="4" fill="#0f172a" stroke={accentColor} strokeWidth="2.5" />

          {/* Fastener Bolts Dropping Down */}
          {[-50, 50].map((x, i) => (
            <g key={i} transform={`translate(${x}, -60)`}>
              {/* Screw head and thread */}
              <line x1="0" y1="-15" x2="0" y2="15" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
              <line x1="-6" y1="-15" x2="6" y2="-15" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />

              {/* Directional Fastening Arrow */}
              <path
                d="M 12 -5 A 10 10 0 1 1 5 -12"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
              />
            </g>
          ))}
        </svg>
      </div>

      {/* Action Instruction Box */}
      <div
        style={{
          backgroundColor: '#18181b',
          borderRadius: 10,
          padding: '12px 16px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>{step.action}</span>
          <span style={{ color: '#a1a1aa', fontSize: 11 }}>{step.fasteners}</span>
        </div>

        {step.toolRequired && (
          <span style={{ color: '#38bdf8', fontSize: 11, fontWeight: 700, fontFamily: 'monospace' }}>
            🔧 {step.toolRequired}
          </span>
        )}
      </div>
    </div>
  );
}
