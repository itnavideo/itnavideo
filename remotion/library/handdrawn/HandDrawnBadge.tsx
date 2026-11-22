import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

export interface HandDrawnBadgeProps {
  badgeText?: string;
  color?: string;
  className?: string;
}

export const HandDrawnBadge: React.FC<HandDrawnBadgeProps> = ({
  badgeText = '100% VERIFIED',
  color = '#10b981',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
          HAND-DRAWN ROSETTE BADGE
        </span>
        <span className="text-emerald-400 font-bold">CERTIFIED SEAL</span>
      </div>

      <div className="flex-1 my-4 flex items-center justify-center relative">
        <svg width="150" height="150" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="38"
            fill="none"
            stroke={color}
            strokeWidth="3.5"
            strokeDasharray="240"
            strokeDashoffset={240 * (1 - progress)}
          />
          {/* Inner sketch dashed circle */}
          <circle
            cx="50"
            cy="50"
            r="32"
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
        </svg>
        <div className="absolute text-center">
          <div className="text-xs font-black text-emerald-400 font-mono tracking-wider">{badgeText}</div>
          <div className="text-[9px] text-white/50">ORIGINAL</div>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>CONCENTRIC SKETCH PERIMETER</span>
        <span>QUALITY ASSURANCE STAMP</span>
      </div>
    </div>
  );
};
