import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface IsometricGridProps {
  size?: number;
  tileSize?: number;
  strokeColor?: string;
  glowColor?: string;
  activeTiles?: Array<{ x: number; y: number; color?: string }>;
  animateDrift?: boolean;
  driftSpeed?: number;
  style?: React.CSSProperties;
}

/**
 * IsometricGrid — 3D ground plane canvas with perspective tile grid.
 * Provides an architectural foundation floor for 3D devices,
 * cubes, and isometric data centers.
 */
export function IsometricGrid({
  size = 800,
  tileSize = 50,
  strokeColor = 'rgba(255, 255, 255, 0.1)',
  glowColor = '#10b981',
  activeTiles = [
    { x: 3, y: 3, color: '#10b981' },
    { x: 5, y: 2, color: '#6366f1' },
    { x: 2, y: 6, color: '#38bdf8' },
  ],
  animateDrift = true,
  driftSpeed = 1,
  style,
}: IsometricGridProps) {
  const frame = useCurrentFrame();

  const drift = animateDrift ? (frame * 0.5 * driftSpeed) % tileSize : 0;

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size * 0.6,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: 900,
        ...style,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: size,
          height: size,
          transform: 'rotateX(62deg) rotateZ(-30deg)',
          transformStyle: 'preserve-3d',
          backgroundImage: `
            linear-gradient(to right, ${strokeColor} 1px, transparent 1px),
            linear-gradient(to bottom, ${strokeColor} 1px, transparent 1px)
          `,
          backgroundSize: `${tileSize}px ${tileSize}px`,
          backgroundPosition: `${drift}px ${drift}px`,
          maskImage:
            'radial-gradient(circle at center, black 40%, transparent 75%)',
          WebkitMaskImage:
            'radial-gradient(circle at center, black 40%, transparent 75%)',
        }}
      >
        {/* Illuminated active tiles */}
        {activeTiles.map((tile, i) => {
          const tileColor = tile.color || glowColor;
          const pulse = (Math.sin(frame * 0.1 + i) + 1) / 2;

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: tile.x * tileSize + drift,
                top: tile.y * tileSize + drift,
                width: tileSize,
                height: tileSize,
                backgroundColor: tileColor,
                opacity: 0.2 + pulse * 0.5,
                boxShadow: `0 0 25px ${tileColor}`,
                border: `1px solid ${tileColor}`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
