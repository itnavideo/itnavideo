import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

export interface HandDrawnCrownProps {
  color?: string;
  size?: number;
  className?: string;
  title?: string;
}

export const HandDrawnCrown: React.FC<HandDrawnCrownProps> = ({
  color = '#f59e0b',
  size = 110,
  className = '',
  title = 'MARKET LEADER',
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
          HAND-DRAWN CROWN DOODLE
        </span>
        <span className="text-amber-400 font-bold">PREMIUM STATUS</span>
      </div>

      <div className="flex-1 my-4 flex flex-col items-center justify-center space-y-2">
        <svg width={size} height={size * 0.6} viewBox="0 0 100 60">
          <path
            d="M 12,50 L 15,22 L 35,38 L 50,15 L 65,38 L 85,22 L 88,50 Z"
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="220"
            strokeDashoffset={220 * (1 - progress)}
          />
          {/* Jewels */}
          <circle cx="15" cy="18" r="3" fill={color} />
          <circle cx="50" cy="11" r="3" fill={color} />
          <circle cx="85" cy="18" r="3" fill={color} />
        </svg>
        <div className="text-base font-black text-amber-400 tracking-wider font-mono">{title}</div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>3-POINT ROYAL EMBLEM</span>
        <span>CREATOR AUTHORITY HOOK</span>
      </div>
    </div>
  );
};
