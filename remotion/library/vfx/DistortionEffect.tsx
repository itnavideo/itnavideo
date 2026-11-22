import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface DistortionEffectProps {
  children?: React.ReactNode;
  frequency?: number; // Base frequency for turbulence (e.g. 0.02)
  scale?: number; // Displacement scale in px (e.g. 20)
  speed?: number; // Animation speed
  className?: string;
}

export const DistortionEffect: React.FC<DistortionEffectProps> = ({
  children,
  frequency = 0.025,
  scale = 18,
  speed = 1.0,
  className = '',
}) => {
  const frame = useCurrentFrame();

  const id = React.useId().replace(/[:]/g, '');
  const filterId = `distortion-${id}`;

  // Temporal offset for continuous organic ripple
  const time = (frame * 0.08 * speed);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* SVG Displacement Filter definition */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence
              type="turbulence"
              baseFrequency={`${frequency} ${frequency * 1.5}`}
              numOctaves={2}
              seed={Math.floor(frame * 0.15 * speed) % 50}
              result="turbulence"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="turbulence"
              scale={scale}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Render children with applied distortion filter */}
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
