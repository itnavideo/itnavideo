import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface ShotComparisonProps {
  leftLabel?: string;
  rightLabel?: string;
  splitPercent?: number;
  className?: string;
}

export const ShotComparison: React.FC<ShotComparisonProps> = ({
  leftLabel = 'RAW S-LOG3 UNGRADED',
  rightLabel = 'ACES COLOR GRADED',
  splitPercent = 50,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between overflow-hidden " + className}>
      <div className="flex justify-between items-center font-mono text-xs z-10">
        <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
          A / B SHOT COMPARISON
        </span>
        <span className="text-white/40">SPLIT: {splitPercent}%</span>
      </div>

      <div className="flex-1 my-4 rounded-xl border border-white/10 relative overflow-hidden flex">
        <div
          className="h-full bg-zinc-800 flex items-center justify-center font-mono text-xs font-bold text-white/60 p-4 border-r-2 border-white"
          style={{ width: splitPercent + '%' }}
        >
          {leftLabel}
        </div>
        <div
          className="h-full bg-gradient-to-tr from-amber-950 to-indigo-950 flex items-center justify-center font-mono text-xs font-bold text-amber-200 p-4 flex-1"
        >
          {rightLabel}
        </div>
      </div>

      <div className="font-mono text-xs text-white/50 flex justify-between z-10">
        <span>COLOR SPACE: REC.709</span>
        <span>LUT: KODAK 2383 EMULATION</span>
      </div>
    </div>
  );
};
