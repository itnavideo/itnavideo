import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface DisplacementMapProps {
  children?: React.ReactNode;
  scale?: number; // Displacement scale magnitude
  type?: 'fractal' | 'turbulence';
  baseFrequency?: string; // e.g. "0.04 0.04"
  numOctaves?: number;
  animated?: boolean;
  speed?: number;
  className?: string;
}

export const DisplacementMap: React.FC<DisplacementMapProps> = ({
  children,
  scale = 25,
  type = 'fractal',
  baseFrequency = '0.03 0.03',
  numOctaves = 2,
  animated = true,
  speed = 1.0,
  className = '',
}) => {
  const frame = useCurrentFrame();

  const id = React.useId().replace(/[:]/g, '');
  const filterId = `disp-map-${id}`;

  const seed = animated ? Math.floor(frame * 0.2 * speed) % 100 : 1;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* SVG Displacement Filter definition */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type={type === 'fractal' ? 'fractalNoise' : 'turbulence'}
              baseFrequency={baseFrequency}
              numOctaves={numOctaves}
              seed={seed}
              result="noiseTexture"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noiseTexture"
              scale={scale}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <div
        className="w-full h-full"
        style={{
          filter: `url(#${filterId})`,
        }}
      >
        {children}
      </div>
    </div>
  );
};
