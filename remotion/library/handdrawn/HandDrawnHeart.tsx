import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

export interface HandDrawnHeartProps {
  color?: string;
  size?: number;
  className?: string;
}

export const HandDrawnHeart: React.FC<HandDrawnHeartProps> = ({
  color = '#ec4899',
  size = 120,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-pink-500/20 text-pink-400 font-bold border border-pink-500/30">
          HAND-DRAWN DOODLE HEART
        </span>
        <span className="text-pink-400 font-bold">LOVE / ENGAGEMENT</span>
      </div>

      <div className="flex-1 my-4 flex items-center justify-center">
        <svg width={size} height={size} viewBox="0 0 100 100">
          <path
            d="M 50,85 C 15,60 10,25 32,18 C 44,14 48,25 50,30 C 52,25 56,14 68,18 C 90,25 85,60 50,85 Z"
            fill="none"
            stroke={color}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="260"
            strokeDashoffset={260 * (1 - progress)}
          />
        </svg>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>CHARCOAL TEXTURE SYNTHESIS</span>
        <span>PULSE FREQUENCY: 1.2 HZ</span>
      </div>
    </div>
  );
};
