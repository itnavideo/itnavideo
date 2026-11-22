import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

export interface HandDrawnLightningBoltProps {
  color?: string;
  size?: number;
  className?: string;
}

export const HandDrawnLightningBolt: React.FC<HandDrawnLightningBoltProps> = ({
  color = '#facc15',
  size = 120,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-yellow-500/20 text-yellow-400 font-bold border border-yellow-500/30">
          HAND-DRAWN LIGHTNING BOLT
        </span>
        <span className="text-yellow-400 font-bold">ENERGY / SPEED</span>
      </div>

      <div className="flex-1 my-4 flex items-center justify-center">
        <svg width={size} height={size} viewBox="0 0 100 100">
          <path
            d="M 55,10 L 25,52 L 50,52 L 40,92 L 75,44 L 50,44 Z"
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="260"
            strokeDashoffset={260 * (1 - progress)}
          />
        </svg>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>ZIGZAG SHOCKWAVE CONTOUR</span>
        <span>FAST MOTION ACCELERATION</span>
      </div>
    </div>
  );
};
