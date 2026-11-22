import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface AnimatedCompassProps {
  headingDegrees?: number;
  size?: number;
  className?: string;
}

export const AnimatedCompass: React.FC<AnimatedCompassProps> = ({
  headingDegrees = 42,
  size = 200,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entry = spring({
    frame,
    fps,
    config: { damping: 14, mass: 1, stiffness: 80 },
  });

  // Oscillating needle wobble
  const wobble = Math.sin(frame * 0.2) * 3;
  const currentHeading = headingDegrees + wobble;

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center p-4 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl select-none ${className}`}
      style={{ transform: `scale(${entry})` }}
    >
      <div
        className="relative rounded-full border-2 border-zinc-700 bg-zinc-900/90 shadow-inner flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        {/* Compass Cardinal Points */}
        <span className="absolute top-2 text-xs font-mono font-black text-red-500">N</span>
        <span className="absolute bottom-2 text-xs font-mono font-black text-zinc-400">S</span>
        <span className="absolute left-3 text-xs font-mono font-black text-zinc-400">W</span>
        <span className="absolute right-3 text-xs font-mono font-black text-zinc-400">E</span>

        {/* Magnetic Needle */}
        <div
          className="absolute w-2 rounded-full transition-transform"
          style={{
            height: size * 0.75,
            transform: `rotate(${currentHeading}deg)`,
            transformOrigin: 'center center',
          }}
        >
          {/* North Red Arrow */}
          <div className="w-full h-1/2 bg-red-500 rounded-t-full shadow-[0_0_8px_#ef4444]" />
          {/* South Silver Arrow */}
          <div className="w-full h-1/2 bg-zinc-400 rounded-b-full" />
        </div>

        {/* Center Pivot Brass Pin */}
        <div className="w-4 h-4 rounded-full bg-amber-400 border-2 border-zinc-950 z-20 shadow" />
      </div>

      <div className="mt-3 text-xs font-mono font-bold text-zinc-200">
        BEARING: <span className="text-amber-400">{Math.round(currentHeading)}° NNE</span>
      </div>
    </div>
  );
};
