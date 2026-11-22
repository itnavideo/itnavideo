import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

export interface HandDrawnStarProps {
  color?: string;
  size?: number;
  className?: string;
}

export const HandDrawnStar: React.FC<HandDrawnStarProps> = ({
  color = '#f59e0b',
  size = 120,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
          HAND-DRAWN 5-POINT STAR
        </span>
        <span className="text-amber-400 font-bold">FAVORITE / RATING</span>
      </div>

      <div className="flex-1 my-4 flex items-center justify-center">
        <svg width={size} height={size} viewBox="0 0 100 100">
          <path
            d="M 50,12 L 63,40 L 92,42 L 70,62 L 77,90 L 50,74 L 23,90 L 30,62 L 8,42 L 37,40 Z"
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="320"
            strokeDashoffset={320 * (1 - progress)}
          />
        </svg>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>DRAWING PATH: CONTINUOUS CONTOUR</span>
        <span>SKETCH SHUFFLE: 12 FPS</span>
      </div>
    </div>
  );
};
