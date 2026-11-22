import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface FilmGrainProps {
  intensity?: number; // 0.05 to 0.4
  iso?: 400 | 800 | 1600 | 3200;
  animated?: boolean;
  monochrome?: boolean;
  vignette?: boolean;
  className?: string;
}

export const FilmGrain: React.FC<FilmGrainProps> = ({
  intensity = 0.14,
  iso = 800,
  animated = true,
  monochrome = true,
  vignette = false,
  className = '',
}) => {
  const frame = useCurrentFrame();

  // Frequency tuned based on simulated film ISO speed
  const baseFreq =
    iso === 3200 ? '0.9 0.9' : iso === 1600 ? '0.75 0.75' : iso === 800 ? '0.6 0.6' : '0.45 0.45';

  const seed = animated ? (frame % 24) * 13 : 1;

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden mix-blend-overlay z-40 ${className}`}
      style={{ opacity: intensity }}
    >
      {/* SVG Analog Film Grain Canvas */}
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <filter id={`film-grain-${seed}`} x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency={baseFreq}
            numOctaves={3}
            seed={seed}
            result="grain"
          />
          {monochrome && (
            <feColorMatrix
              type="matrix"
              values="0.33 0.33 0.33 0 0
                      0.33 0.33 0.33 0 0
                      0.33 0.33 0.33 0 0
                      0    0    0    1 0"
              in="grain"
              result="monoGrain"
            />
          )}
        </filter>
        <rect width="100%" height="100%" filter={`url(#film-grain-${seed})`} />
      </svg>

      {/* Optional Subtle Film Vignette */}
      {vignette && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at center, transparent 60%, rgba(0,0,0,0.4) 100%)',
          }}
        />
      )}
    </div>
  );
};
