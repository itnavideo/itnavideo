import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface TextureProps {
  type?: 'film-grain' | 'halftone' | 'crt-scanlines' | 'vignette' | 'paper-fibers';
  opacity?: number;
  blendMode?: 'overlay' | 'screen' | 'multiply' | 'soft-light' | 'color-dodge';
  animated?: boolean;
  style?: React.CSSProperties;
}

/**
 * Texture — Cinematic texture overlay generator.
 * Emulates analog film grain, halftone dots, CRT retro scanlines,
 * edge vignette, and paper fiber tactile depth.
 */
export function Texture({
  type = 'film-grain',
  opacity = 0.12,
  blendMode = 'overlay',
  animated = true,
  style,
}: TextureProps) {
  const frame = useCurrentFrame();

  // Subtle frame jitter for analog feel
  const jitterSeed = animated ? (frame % 4) * 2 : 0;

  if (type === 'vignette') {
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(circle at center, transparent 40%, rgba(0, 0, 0, 0.85) 100%)',
          opacity,
          mixBlendMode: blendMode,
          zIndex: 40,
          ...style,
        }}
      />
    );
  }

  if (type === 'crt-scanlines') {
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage:
            'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.4) 50%)',
          backgroundSize: '100% 4px',
          opacity,
          mixBlendMode: blendMode,
          zIndex: 40,
          ...style,
        }}
      />
    );
  }

  if (type === 'halftone') {
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage:
            'radial-gradient(circle, rgba(255, 255, 255, 0.4) 1px, transparent 1.5px)',
          backgroundSize: '8px 8px',
          opacity,
          mixBlendMode: blendMode,
          zIndex: 40,
          ...style,
        }}
      />
    );
  }

  if (type === 'paper-fibers') {
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage:
            'radial-gradient(rgba(244, 244, 245, 0.2) 1px, transparent 0)',
          backgroundSize: '16px 16px',
          opacity,
          mixBlendMode: 'soft-light',
          filter: 'contrast(120%)',
          zIndex: 40,
          ...style,
        }}
      />
    );
  }

  // Film Grain SVG Filter Mode
  return (
    <div
      style={{
        position: 'absolute',
        inset: -20, // bleed beyond edges to handle jitter
        pointerEvents: 'none',
        opacity,
        mixBlendMode: blendMode,
        transform: `translate(${jitterSeed}px, ${jitterSeed}px)`,
        zIndex: 40,
        ...style,
      }}
    >
      <svg
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      >
        <filter id="lib-film-grain-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency={0.8}
            numOctaves={3}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#lib-film-grain-filter)" />
      </svg>
    </div>
  );
}
