import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

export interface GlitchTransitionProps {
  durationInFrames?: number;
  intensity?: number;
  direction?: 'horizontal' | 'vertical';
  slices?: number;
  className?: string;
  children?: React.ReactNode;
}

export const GlitchTransition: React.FC<GlitchTransitionProps> = ({
  durationInFrames = 25,
  intensity = 1.0,
  direction = 'horizontal',
  slices = 10,
  className = '',
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Progress 0 -> 1 over duration
  const progress = Math.min(1, Math.max(0, frame / durationInFrames));

  // Glitch flash bell-curve peaked in the middle (frame ~ 12)
  const glitchPeak = Math.sin(progress * Math.PI) * intensity;

  // Flash whiteout opacity
  const flash = interpolate(progress, [0.35, 0.5, 0.65], [0, 0.85 * intensity, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Calculate slice displacement offsets
  const sliceElements = Array.from({ length: slices }).map((_, i) => {
    const hash = Math.sin((frame + i) * 43.123) * 12345.67;
    const rand = hash - Math.floor(hash);
    const offset = (rand * 2 - 1) * 60 * glitchPeak;
    const pStart = (i / slices) * 100;
    const pEnd = 100 - ((i + 1) / slices) * 100;

    return {
      id: i,
      offset,
      clipPath:
        direction === 'horizontal'
          ? `inset(${pStart}% 0 ${pEnd}% 0)`
          : `inset(0 ${pEnd}% 0 ${pStart}%)`,
    };
  });

  const rgbDisplacement = glitchPeak * 14;

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Base content */}
      <div className="relative w-full h-full">{children}</div>

      {/* Glitch sliced overlay during transition */}
      {glitchPeak > 0.05 && (
        <>
          {sliceElements.map((s) => (
            <div
              key={s.id}
              className="absolute inset-0 pointer-events-none"
              style={{
                clipPath: s.clipPath,
                transform:
                  direction === 'horizontal'
                    ? `translateX(${s.offset}px)`
                    : `translateY(${s.offset}px)`,
                filter: `brightness(${1 + glitchPeak * 0.4}) contrast(${1 + glitchPeak * 0.5})`,
              }}
            >
              {children}
            </div>
          ))}

          {/* Chromatic RGB split channels */}
          <div
            className="absolute inset-0 pointer-events-none mix-blend-screen opacity-70"
            style={{
              transform: `translate(${rgbDisplacement}px, ${rgbDisplacement * 0.3}px)`,
              filter: 'drop-shadow(0 0 4px rgba(255, 0, 80, 0.9))',
            }}
          >
            {children}
          </div>
          <div
            className="absolute inset-0 pointer-events-none mix-blend-screen opacity-70"
            style={{
              transform: `translate(${-rgbDisplacement}px, ${-rgbDisplacement * 0.3}px)`,
              filter: 'drop-shadow(0 0 4px rgba(0, 240, 255, 0.9))',
            }}
          >
            {children}
          </div>
        </>
      )}

      {/* Optical white flash burst */}
      {flash > 0.01 && (
        <div
          className="absolute inset-0 pointer-events-none bg-white mix-blend-overlay"
          style={{ opacity: flash }}
        />
      )}
    </div>
  );
};
