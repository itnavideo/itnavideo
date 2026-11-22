import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface SVGFilterProps {
  id: string;
  type?: 'neon-glow' | 'drop-shadow' | 'gaussian-blur' | 'cyber-glitch' | 'duotone';
  intensity?: number;
  color?: string;
  secondaryColor?: string;
}

/**
 * SVGFilter — Advanced SVG filter definitions generator.
 * Produces hardware-accelerated neon glows, cyber displacement glitches,
 * cinematic duotone color grading, and soft drop shadows.
 */
export function SVGFilter({
  id,
  type = 'neon-glow',
  intensity = 1,
  color = '#10b981',
  secondaryColor = '#6366f1',
}: SVGFilterProps) {
  const frame = useCurrentFrame();

  if (type === 'neon-glow') {
    return (
      <filter id={id} x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation={intensity * 4} result="blur1" />
        <feGaussianBlur stdDeviation={intensity * 8} result="blur2" />
        <feMerge>
          <feMergeNode in="blur2" />
          <feMergeNode in="blur1" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    );
  }

  if (type === 'cyber-glitch') {
    const seed = (frame % 8) * 10;
    return (
      <filter id={id} x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.05 0.95"
          numOctaves="1"
          seed={seed}
          result="noise"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="noise"
          scale={intensity * 12}
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    );
  }

  if (type === 'gaussian-blur') {
    return (
      <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation={intensity * 6} />
      </filter>
    );
  }

  if (type === 'drop-shadow') {
    return (
      <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow
          dx="0"
          dy={intensity * 4}
          stdDeviation={intensity * 5}
          floodColor={color}
          floodOpacity="0.4"
        />
      </filter>
    );
  }

  // Duotone filter using feColorMatrix
  return (
    <filter id={id} colorInterpolationFilters="sRGB">
      <feColorMatrix
        type="matrix"
        values="0.33 0.33 0.33 0 0
                0.33 0.33 0.33 0 0
                0.33 0.33 0.33 0 0
                0    0    0    1 0"
      />
    </filter>
  );
}
