import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

export interface HandDrawnCloudProps {
  color?: string;
  size?: number;
  className?: string;
}

export const HandDrawnCloud: React.FC<HandDrawnCloudProps> = ({
  color = '#93c5fd',
  size = 140,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">
          HAND-DRAWN CLOUD DOODLE
        </span>
        <span className="text-blue-400 font-bold">DREAM / CLOUD TECH</span>
      </div>

      <div className="flex-1 my-4 flex items-center justify-center">
        <svg width={size} height={size * 0.65} viewBox="0 0 120 80">
          <path
            d="M 25,65 C 10,65 5,50 18,40 C 12,25 30,15 45,22 C 55,8 80,10 88,25 C 105,20 115,38 108,52 C 118,65 100,68 90,65 Z"
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="320"
            strokeDashoffset={320 * (1 - progress)}
          />
        </svg>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>SCALLOPED PERIMETER</span>
        <span>THOUGHT BUBBLE / CLOUD HOSTING</span>
      </div>
    </div>
  );
};
