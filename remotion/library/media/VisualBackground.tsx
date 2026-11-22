import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export interface VisualBackgroundProps {
  type?: 'mesh-gradient' | 'blueprint-grid' | 'radial-spotlight' | 'starfield' | 'minimal-dark';
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  gridOpacity?: number;
  speed?: number;
  children?: React.ReactNode;
}

/**
 * VisualBackground — High-retention procedural background generator.
 * Produces fluid animated mesh gradients, architectural dot grids,
 * floating particle starfields, and radial spotlights with zero external asset dependencies.
 */
export function VisualBackground({
  type = 'mesh-gradient',
  primaryColor = '#10b981',
  secondaryColor = '#6366f1',
  accentColor = '#f59e0b',
  gridOpacity = 0.08,
  speed = 1,
  children,
}: VisualBackgroundProps) {
  const frame = useCurrentFrame();
  const { width = 1920, height = 1080 } = useVideoConfig();

  // Mesh gradient orb movements
  const orb1X = 25 + Math.sin(frame * 0.02 * speed) * 15;
  const orb1Y = 30 + Math.cos(frame * 0.025 * speed) * 12;

  const orb2X = 75 + Math.cos(frame * 0.018 * speed) * 15;
  const orb2Y = 65 + Math.sin(frame * 0.022 * speed) * 14;

  const orb3X = 50 + Math.sin(frame * 0.015 * speed + 2) * 18;
  const orb3Y = 80 + Math.cos(frame * 0.019 * speed) * 10;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        backgroundColor: '#09090b',
      }}
    >
      {/* 1. Mesh Gradient Mode */}
      {type === 'mesh-gradient' && (
        <div style={{ position: 'absolute', inset: 0, filter: 'blur(90px)', opacity: 0.55 }}>
          <div
            style={{
              position: 'absolute',
              left: `${orb1X}%`,
              top: `${orb1Y}%`,
              width: 500,
              height: 500,
              borderRadius: '50%',
              backgroundColor: primaryColor,
              transform: 'translate(-50%, -50%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: `${orb2X}%`,
              top: `${orb2Y}%`,
              width: 600,
              height: 600,
              borderRadius: '50%',
              backgroundColor: secondaryColor,
              transform: 'translate(-50%, -50%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: `${orb3X}%`,
              top: `${orb3Y}%`,
              width: 450,
              height: 450,
              borderRadius: '50%',
              backgroundColor: accentColor,
              transform: 'translate(-50%, -50%)',
            }}
          />
        </div>
      )}

      {/* 2. Blueprint Grid Mode */}
      {type === 'blueprint-grid' && (
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: gridOpacity * 3,
          }}
        >
          <defs>
            <pattern id="lib-bg-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#fff" strokeWidth="1" />
              <circle cx="0" cy="0" r="1.5" fill="#fff" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#lib-bg-grid)" />
        </svg>
      )}

      {/* 3. Radial Spotlight Mode */}
      {type === 'radial-spotlight' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at 50% 35%, ${primaryColor}22 0%, #09090b 70%)`,
          }}
        />
      )}

      {/* 4. Starfield Dust Particles Mode */}
      {type === 'starfield' && (
        <div style={{ position: 'absolute', inset: 0 }}>
          {Array.from({ length: 35 }).map((_, i) => {
            const seedX = ((i * 137.5) % 100);
            const seedY = ((i * 223.1) % 100);
            const speedMod = 0.5 + (i % 5) * 0.2;
            const floatY = (seedY + frame * 0.05 * speedMod) % 100;
            const pulse = (Math.sin(frame * 0.08 + i) + 1) / 2;

            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: `${seedX}%`,
                  top: `${floatY}%`,
                  width: i % 3 === 0 ? 3 : 2,
                  height: i % 3 === 0 ? 3 : 2,
                  borderRadius: '50%',
                  backgroundColor: i % 2 === 0 ? primaryColor : '#fff',
                  opacity: 0.2 + pulse * 0.6,
                  boxShadow: i % 4 === 0 ? `0 0 6px ${primaryColor}` : 'none',
                }}
              />
            );
          })}
        </div>
      )}

      {/* Architectural Dot Matrix Layer on top */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          opacity: gridOpacity,
          pointerEvents: 'none',
        }}
      />

      {/* Foreground Child Elements */}
      {children && (
        <div style={{ position: 'relative', width: '100%', height: '100%', zIndex: 10 }}>
          {children}
        </div>
      )}
    </div>
  );
}

// Re-export full theme background for full backward compatibility
export { Background } from '../../components/Background';
export type { BackgroundProps } from '../../components/Background';
