import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface CircuitDiagramProps {
  title?: string;
  voltage?: string;
  resistance?: string;
  currentValue?: string;
  strokeColor?: string;
  packetColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * CircuitDiagram — Electrical engineering schematic diagram.
 * Renders DC voltage source, load resistor, ground reference,
 * and high-velocity animated electrical current flow dots.
 */
export function CircuitDiagram({
  title = "Ohm's Law Closed Circuit",
  voltage = '12V DC',
  resistance = '4Ω Load',
  currentValue = 'I = 3.0A',
  strokeColor = '#10b981',
  packetColor = '#38bdf8',
  delay = 0,
  width = '100%',
  height = 340,
}: CircuitDiagramProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = Math.max(0, frame - delay);

  // Entrance spring
  const entrySpr = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  const scale = interpolate(entrySpr, [0, 1], [0.88, 1]);
  const opacity = interpolate(entrySpr, [0, 1], [0, 1]);

  // Current packet loop around rectangular circuit
  const w = 260;
  const h = 160;
  const perimeter = 2 * (w + h);
  const currentSpeed = 3.5;

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
        width={w + 80}
        height={h + 80}
        viewBox={`-${(w + 80) / 2} -${(h + 80) / 2} ${w + 80} ${h + 80}`}
        style={{ overflow: 'visible' }}
      >
        {/* Main Circuit Loop Path */}
        <rect
          x={-w / 2}
          y={-h / 2}
          width={w}
          height={h}
          rx={6}
          fill="none"
          stroke={strokeColor}
          strokeWidth="3"
        />

        {/* DC Voltage Source (Left branch) */}
        <g transform={`translate(-${w / 2}, 0)`}>
          <line x1="-16" y1="-12" x2="16" y2="-12" stroke="#fff" strokeWidth="3" />
          <line x1="-8" y1="12" x2="8" y2="12" stroke="#fff" strokeWidth="4" />
          <text x="-26" y="-8" fill="#ef4444" fontSize="13" fontWeight="800">+</text>
          <text x="-26" y="18" fill="#38bdf8" fontSize="13" fontWeight="800">-</text>
          <text x="-55" y="4" fill="#e4e4e7" fontSize="12" fontWeight="700">{voltage}</text>
        </g>

        {/* Resistor Zig-Zag (Right branch) */}
        <g transform={`translate(${w / 2}, 0)`}>
          <rect x="-14" y="-30" width="28" height="60" rx="4" fill="#0f172a" stroke="#f59e0b" strokeWidth="2.5" />
          <text x="24" y="4" fill="#f59e0b" fontSize="12" fontWeight="700">{resistance}</text>
        </g>

        {/* Switch on top branch */}
        <g transform="translate(0, -80)">
          <circle cx="-16" cy="0" r="4" fill="#fff" />
          <circle cx="16" cy="0" r="4" fill="#fff" />
          <line x1="-16" y1="0" x2="12" y2="-10" stroke="#fff" strokeWidth="2.5" />
        </g>

        {/* Traveling Electrical Current Particles */}
        {Array.from({ length: 8 }).map((_, i) => {
          const offset = ((adjustedFrame * currentSpeed + i * (perimeter / 8)) % perimeter);

          let px = 0;
          let py = 0;

          if (offset < w) {
            // Top wire: left to right
            px = -w / 2 + offset;
            py = -h / 2;
          } else if (offset < w + h) {
            // Right wire: top to bottom
            px = w / 2;
            py = -h / 2 + (offset - w);
          } else if (offset < 2 * w + h) {
            // Bottom wire: right to left
            px = w / 2 - (offset - (w + h));
            py = h / 2;
          } else {
            // Left wire: bottom to top
            px = -w / 2;
            py = h / 2 - (offset - (2 * w + h));
          }

          return (
            <circle
              key={i}
              cx={px}
              cy={py}
              r="3.5"
              fill={packetColor}
              filter="drop-shadow(0 0 6px #38bdf8)"
            />
          );
        })}
      </svg>

      {/* Schematic Readout Footer */}
      <div
        style={{
          position: 'absolute',
          bottom: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '6px 16px',
          borderRadius: 8,
          backgroundColor: 'rgba(9, 9, 11, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
        }}
      >
        <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>{title}</span>
        <div style={{ width: 1, height: 16, backgroundColor: 'rgba(255, 255, 255, 0.15)' }} />
        <span style={{ color: packetColor, fontSize: 12, fontWeight: 800, fontFamily: 'monospace' }}>
          {currentValue}
        </span>
      </div>
    </div>
  );
}
