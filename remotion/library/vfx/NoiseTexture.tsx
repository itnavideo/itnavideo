import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface NoiseTextureProps {
  opacity?: number; // 0.05 to 0.5
  intensity?: number; // Grain frequency scale
  animated?: boolean;
  blendMode?: 'overlay' | 'multiply' | 'screen' | 'soft-light' | 'color-dodge';
  className?: string;
}

export const NoiseTexture: React.FC<NoiseTextureProps> = ({
  opacity = 0.12,
  intensity = 0.65,
  animated = true,
  blendMode = 'overlay',
  className = '',
}) => {
  const frame = useCurrentFrame();

  // Frame seed creates animated jittering analog film grain
  const seed = animated ? (frame % 30) * 11 : 1;

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{
        opacity,
        mixBlendMode: blendMode,
      }}
    >
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <filter id={`grain-filter-${seed}`} x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency={`${intensity * 0.8} ${intensity * 0.8}`}
            numOctaves={3}
            seed={seed}
            result="noise"
          />
          <feColorMatrix
            type="matrix"
            values="0.33 0.33 0.33 0 0
                    0.33 0.33 0.33 0 0
                    0.33 0.33 0.33 0 0
                    0    0    0    1 0"
            in="noise"
            result="mono"
          />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-filter-${seed})`} />
      </svg>
    </div>
  );
};
