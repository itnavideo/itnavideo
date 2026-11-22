import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

export interface GlitchEffectProps {
  children?: React.ReactNode;
  intensity?: number; // 0 to 1
  glitchFrequency?: number; // How often glitches trigger (0 to 1)
  rgbShift?: number; // Max pixel shift for chromatic dispersion
  sliceCount?: number; // Number of horizontal glitch slices
  scanlines?: boolean;
  className?: string;
}

export const GlitchEffect: React.FC<GlitchEffectProps> = ({
  children,
  intensity = 0.6,
  glitchFrequency = 0.35,
  rgbShift = 8,
  sliceCount = 5,
  scanlines = true,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Deterministic pseudo-randomness based on frame number
  const hash = Math.sin(frame * 12.9898 + 78.233) * 43758.5453;
  const randVal = hash - Math.floor(hash);
  const isGlitching = randVal < glitchFrequency;

  // Calculate RGB channel pixel offsets
  const shiftX = isGlitching ? (Math.sin(frame * 1.5) * rgbShift * intensity) : 0;
  const shiftY = isGlitching ? (Math.cos(frame * 2.1) * (rgbShift * 0.4) * intensity) : 0;

  // Generate slice clip paths
  const slices: { top: number; height: number; offset: number }[] = [];
  if (isGlitching) {
    for (let i = 0; i < sliceCount; i++) {
      const sliceHash = Math.sin((frame + i) * 37.1) * 23421.3;
      const sRand = sliceHash - Math.floor(sliceHash);
      const top = (i / sliceCount) * 100 + (sRand * 10 - 5);
      const height = (100 / sliceCount) * (0.4 + sRand * 0.8);
      const offset = (sRand * 2 - 1) * 16 * intensity;
      slices.push({ top, height, offset });
    }
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Base Layer */}
      <div className="relative z-10">{children}</div>

      {/* Red Channel Shift */}
      {isGlitching && (
        <div
          className="absolute inset-0 z-20 pointer-events-none mix-blend-screen opacity-80"
          style={{
            transform: `translate(${shiftX}px, ${shiftY}px)`,
            filter: 'drop-shadow(0 0 2px rgba(255, 0, 80, 0.9))',
          }}
        >
          {children}
        </div>
      )}

      {/* Cyan/Blue Channel Shift */}
      {isGlitching && (
        <div
          className="absolute inset-0 z-20 pointer-events-none mix-blend-screen opacity-80"
          style={{
            transform: `translate(${-shiftX}px, ${-shiftY}px)`,
            filter: 'drop-shadow(0 0 2px rgba(0, 240, 255, 0.9))',
          }}
        >
          {children}
        </div>
      )}

      {/* Displaced Slices */}
      {slices.map((slice, idx) => (
        <div
          key={idx}
          className="absolute inset-0 z-30 pointer-events-none opacity-90"
          style={{
            clipPath: `inset(${slice.top}% 0 ${100 - (slice.top + slice.height)}% 0)`,
            transform: `translateX(${slice.offset}px)`,
            filter: 'contrast(130%) brightness(110%)',
          }}
        >
          {children}
        </div>
      ))}

      {/* Optional CRT Scanlines */}
      {scanlines && (
        <div
          className="absolute inset-0 z-40 pointer-events-none opacity-25"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, rgba(0,0,0,0.6) 0px, rgba(0,0,0,0.6) 1px, transparent 1px, transparent 3px)',
          }}
        />
      )}
    </div>
  );
};
