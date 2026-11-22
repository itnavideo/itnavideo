import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

export interface LightSweepProps {
  children?: React.ReactNode;
  angle?: number; // Sweep angle in degrees (default 120deg)
  durationInFrames?: number; // Time for one full sweep
  delayInFrames?: number; // Delay between recurring sweeps
  sweepWidth?: number; // Width of the highlight beam in px
  color?: string; // Specular color (e.g. rgba(255,255,255,0.7))
  className?: string;
}

export const LightSweep: React.FC<LightSweepProps> = ({
  children,
  angle = 120,
  durationInFrames = 45,
  delayInFrames = 30,
  sweepWidth = 80,
  color = 'rgba(255, 255, 255, 0.75)',
  className = '',
}) => {
  const frame = useCurrentFrame();

  const cycleLength = durationInFrames + delayInFrames;
  const currentCycleFrame = frame % cycleLength;

  // Position sweeps across -100% to 200%
  const sweepPos = interpolate(
    currentCycleFrame,
    [0, durationInFrames],
    [-80, 180],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const isActive = currentCycleFrame <= durationInFrames;

  return (
    <div className={`relative inline-block overflow-hidden ${className}`}>
      {/* Base Content */}
      <div className="relative z-10">{children}</div>

      {/* Shimmering Specular Light Beam */}
      {isActive && (
        <div
          className="absolute inset-0 pointer-events-none z-20 mix-blend-overlay"
          style={{
            transform: `translateX(${sweepPos}%) rotate(${angle}deg)`,
            transformOrigin: 'center center',
            background: `linear-gradient(90deg, transparent 0%, ${color} 50%, transparent 100%)`,
            width: `${sweepWidth * 2}%`,
            left: `-${sweepWidth / 2}%`,
            filter: 'blur(4px)',
          }}
        />
      )}
    </div>
  );
};
