import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface AtomNode {
  id: string;
  symbol: string;
  color: string;
  x: number;
  y: number;
  z?: number;
  radius?: number;
}

export interface MoleculeBond {
  from: string;
  to: string;
  type?: 'single' | 'double' | 'triple';
}

export interface MoleculeModelProps {
  name?: string;
  formula?: string;
  atoms?: AtomNode[];
  bonds?: MoleculeBond[];
  rotate?: boolean;
  rotateSpeed?: number;
  glow?: boolean;
  delay?: number;
  width?: number | string;
  height?: number;
}

const DEFAULT_ATOMS: AtomNode[] = [
  { id: 'c1', symbol: 'C', color: '#10b981', x: 0, y: 0, z: 0, radius: 26 },
  { id: 'h1', symbol: 'H', color: '#38bdf8', x: -80, y: -50, z: 20, radius: 18 },
  { id: 'h2', symbol: 'H', color: '#38bdf8', x: 80, y: -50, z: -20, radius: 18 },
  { id: 'o1', symbol: 'O', color: '#ef4444', x: 0, y: 80, z: 10, radius: 24 },
  { id: 'n1', symbol: 'N', color: '#6366f1', x: 90, y: 40, z: 30, radius: 22 },
];

const DEFAULT_BONDS: MoleculeBond[] = [
  { from: 'c1', to: 'h1', type: 'single' },
  { from: 'c1', to: 'h2', type: 'single' },
  { from: 'c1', to: 'o1', type: 'double' },
  { from: 'c1', to: 'n1', type: 'single' },
];

/**
 * MoleculeModel — 3D/vector chemical molecular bond structure.
 * Features spherical atomic nodes, single/double covalent bond sticks,
 * elemental symbol typography, and continuous 3D rotation.
 */
export function MoleculeModel({
  name = 'Serotonin Derivative',
  formula = 'C₁₀H₁₂N₂O',
  atoms = DEFAULT_ATOMS,
  bonds = DEFAULT_BONDS,
  rotate = true,
  rotateSpeed = 1,
  glow = true,
  delay = 0,
  width = '100%',
  height = 360,
}: MoleculeModelProps) {
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

  // Frame rotation angle (around Y axis)
  const angle = rotate ? (adjustedFrame * 0.03 * rotateSpeed) : 0;
  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);

  // Project 3D atom coordinates onto 2D screen
  const projectedAtoms = atoms.map((atom) => {
    const rawZ = atom.z || 0;
    // Rotate around Y-axis
    const rotX = atom.x * cosA - rawZ * sinA;
    const rotZ = atom.x * sinA + rawZ * cosA;

    return {
      ...atom,
      screenX: rotX,
      screenY: atom.y,
      depthZ: rotZ,
    };
  });

  // Sort atoms from back to front for proper painter's algorithm
  const sortedAtoms = [...projectedAtoms].sort((a, b) => a.depthZ - b.depthZ);

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
      {/* SVG Canvas for Molecule */}
      <svg
        width={height}
        height={height}
        viewBox={`-${height / 2} -${height / 2} ${height} ${height}`}
        style={{ overflow: 'visible' }}
      >
        <defs>
          {atoms.map((a) => (
            <radialGradient key={a.id} id={`atom-grad-${a.id}`} cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.8" />
              <stop offset="40%" stopColor={a.color} stopOpacity="0.9" />
              <stop offset="100%" stopColor="#090d16" stopOpacity="1" />
            </radialGradient>
          ))}
        </defs>

        {/* Chemical Bond Cylinders */}
        {bonds.map((bond, idx) => {
          const fromAtom = projectedAtoms.find((a) => a.id === bond.from);
          const toAtom = projectedAtoms.find((a) => a.id === bond.to);
          if (!fromAtom || !toAtom) return null;

          const isDouble = bond.type === 'double';

          if (isDouble) {
            return (
              <g key={idx}>
                <line
                  x1={fromAtom.screenX - 4}
                  y1={fromAtom.screenY - 4}
                  x2={toAtom.screenX - 4}
                  y2={toAtom.screenY - 4}
                  stroke="rgba(255, 255, 255, 0.4)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <line
                  x1={fromAtom.screenX + 4}
                  y1={fromAtom.screenY + 4}
                  x2={toAtom.screenX + 4}
                  y2={toAtom.screenY + 4}
                  stroke="rgba(255, 255, 255, 0.4)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </g>
            );
          }

          return (
            <line
              key={idx}
              x1={fromAtom.screenX}
              y1={fromAtom.screenY}
              x2={toAtom.screenX}
              y2={toAtom.screenY}
              stroke="rgba(255, 255, 255, 0.45)"
              strokeWidth="6"
              strokeLinecap="round"
            />
          );
        })}

        {/* Atom Spheres */}
        {sortedAtoms.map((a) => {
          const depthScale = 1 + a.depthZ * 0.003;
          const r = (a.radius || 20) * depthScale;

          return (
            <g key={a.id} transform={`translate(${a.screenX}, ${a.screenY})`}>
              <circle
                r={r}
                fill={`url(#atom-grad-${a.id})`}
                stroke={a.color}
                strokeWidth="1.5"
                filter={glow ? `drop-shadow(0 0 10px ${a.color}80)` : undefined}
              />
              <text
                y={r * 0.35}
                fill="#ffffff"
                fontSize={r * 0.9}
                fontWeight="800"
                textAnchor="middle"
                fontFamily="sans-serif"
                style={{ pointerEvents: 'none' }}
              >
                {a.symbol}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Chemical Compound Identifier Badge */}
      <div
        style={{
          position: 'absolute',
          bottom: 12,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          padding: '8px 18px',
          borderRadius: 12,
          backgroundColor: 'rgba(9, 9, 11, 0.85)',
          backdropFilter: 'blur(12px)',
          border: 'none',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
        }}
      >
        <span style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>{name}</span>
        <span style={{ color: '#10b981', fontSize: 12, fontWeight: 600, fontFamily: 'monospace' }}>
          {formula}
        </span>
      </div>
    </div>
  );
}
