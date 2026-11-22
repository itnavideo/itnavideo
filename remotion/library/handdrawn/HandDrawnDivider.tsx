import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

export interface HandDrawnDividerProps {
  color?: string;
  className?: string;
}

export const HandDrawnDivider: React.FC<HandDrawnDividerProps> = ({
  color = '#10b981',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
          HAND-DRAWN SECTION DIVIDER
        </span>
        <span className="text-white/40">SQUIGGLE SEPARATOR</span>
      </div>

      <div className="flex-1 my-4 flex flex-col items-center justify-center space-y-4">
        <span className="text-sm font-mono text-white/60">CHAPTER 02 — THE SOLUTION</span>
        <svg className="w-80 h-10 overflow-visible" viewBox="0 0 240 24">
          <path
            d="M 10,12 Q 30,4 50,12 T 90,12 T 130,12 T 170,12 T 210,12 T 230,12"
            fill="none"
            stroke={color}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="240"
            strokeDashoffset={240 * (1 - progress)}
          />
        </svg>
        <span className="text-xs text-white/40 font-mono">NEXT GENERATION CLOUD PIPELINE</span>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>WAVE FREQUENCY: 6 PERIODS</span>
        <span>CONTENT PACING BREAK</span>
      </div>
    </div>
  );
};
