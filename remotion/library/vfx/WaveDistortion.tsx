import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

export interface WaveDistortionProps {
  children?: React.ReactNode;
  amplitude?: number; // Wave height in px
  frequency?: number; // Sine cycle frequency
  speed?: number; // Motion speed
  direction?: 'horizontal' | 'vertical' | 'radial';
  className?: string;
}

export const WaveDistortion: React.FC<WaveDistortionProps> = ({
  children,
  amplitude = 12,
  frequency = 0.05,
  speed = 1.0,
  direction = 'horizontal',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const id = React.useId().replace(/[:]/g, '');
  const filterId = `wave-distort-${id}`;

  const phase = (frame / fps) * Math.PI * 2 * speed;
  const freqX = direction === 'vertical' ? 0.005 : frequency;
  const freqY = direction === 'horizontal' ? 0.005 : frequency;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* SVG Sine Wave Ripple Filter */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence
              type="turbulence"
              baseFrequency={`${freqX} ${freqY}`}
              numOctaves={1}
              seed={Math.floor(phase * 4)}
              result="wave"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="wave"
              scale={amplitude}
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
