import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

export interface ScanlineEffectProps {
  children?: React.ReactNode;
  lineSpacing?: number; // Distance between raster lines (e.g. 3px)
  opacity?: number; // 0.1 to 0.5
  rollBar?: boolean; // Animated CRT beam rolling vertically
  rollSpeed?: number;
  flicker?: boolean;
  vignette?: boolean;
  className?: string;
}

export const ScanlineEffect: React.FC<ScanlineEffectProps> = ({
  children,
  lineSpacing = 3,
  opacity = 0.22,
  rollBar = true,
  rollSpeed = 0.5,
  flicker = true,
  vignette = true,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Vertical CRT beam roll bar position 0% - 100%
  const rollCycle = fps * 4 * (1 / rollSpeed);
  const rollY = interpolate(frame % rollCycle, [0, rollCycle], [0, 100]);

  // Subtle phosphor flicker
  let phosphorOpacity = opacity;
  if (flicker) {
    const flickerNoise = Math.sin(frame * 18.2) * 0.04;
    phosphorOpacity = Math.max(0.05, opacity + flickerNoise);
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Under Content */}
      <div className="relative z-10">{children}</div>

      {/* Static Raster Lines */}
      <div
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          opacity: phosphorOpacity,
          backgroundImage: `repeating-linear-gradient(0deg, rgba(0,0,0,0.8) 0px, rgba(0,0,0,0.8) 1px, transparent 1px, transparent ${lineSpacing}px)`,
        }}
      />

      {/* Moving CRT Roll Bar */}
      {rollBar && (
        <div
          className="absolute inset-x-0 pointer-events-none z-30 mix-blend-overlay"
          style={{
            top: `${rollY}%`,
            height: '15%',
            background:
              'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
            filter: 'blur(2px)',
          }}
        />
      )}

      {/* Retro Curved Vignette */}
      {vignette && (
        <div
          className="absolute inset-0 pointer-events-none z-40"
          style={{
            background:
              'radial-gradient(circle at center, transparent 65%, rgba(0,0,0,0.6) 100%)',
          }}
        />
      )}
    </div>
  );
};
