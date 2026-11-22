import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

export interface ChromaticAberrationProps {
  children?: React.ReactNode;
  offset?: number; // Pixel dispersion amount (e.g. 6px)
  radial?: boolean; // Radial dispersion vs linear horizontal
  animated?: boolean;
  pulseSpeed?: number;
  className?: string;
}

export const ChromaticAberration: React.FC<ChromaticAberrationProps> = ({
  children,
  offset = 6,
  radial = false,
  animated = true,
  pulseSpeed = 1.2,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Dynamic subtle breathing displacement
  const pulse = animated
    ? 0.7 + 0.3 * Math.sin((frame / fps) * Math.PI * 2 * pulseSpeed)
    : 1;

  const currentOffset = offset * pulse;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Base Center Channel (Green/Normal) */}
      <div className="relative z-10">{children}</div>

      {/* Red Channel (Left / Upper Shift) */}
      <div
        className="absolute inset-0 pointer-events-none z-20 mix-blend-screen opacity-75"
        style={{
          transform: radial
            ? `scale(${1 + (currentOffset / 500)})`
            : `translate(${-currentOffset}px, ${-currentOffset * 0.25}px)`,
          filter: 'drop-shadow(0 0 1px rgba(255, 0, 0, 0.8)) hue-rotate(-60deg)',
        }}
      >
        {children}
      </div>

      {/* Cyan/Blue Channel (Right / Lower Shift) */}
      <div
        className="absolute inset-0 pointer-events-none z-20 mix-blend-screen opacity-75"
        style={{
          transform: radial
            ? `scale(${1 - (currentOffset / 500)})`
            : `translate(${currentOffset}px, ${currentOffset * 0.25}px)`,
          filter: 'drop-shadow(0 0 1px rgba(0, 200, 255, 0.8)) hue-rotate(90deg)',
        }}
      >
        {children}
      </div>
    </div>
  );
};
