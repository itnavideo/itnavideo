import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface SUMIFSFormulaCardProps {
  sumRange?: string;
  criteria1?: string;
  criteria2?: string;
  aggregatedTotal?: string;
  className?: string;
}

export const SUMIFSFormulaCard: React.FC<SUMIFSFormulaCardProps> = ({
  sumRange = "Sales[Amount]",
  criteria1 = "Sales[Region] = 'APAC'",
  criteria2 = "Sales[Status] = 'Closed'",
  aggregatedTotal = "$1,450,800.00",
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-sky-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-sky-400" />
          <span className="text-xs uppercase tracking-wider text-sky-400 font-bold">
            SUMIFS (MULTI-CRITERIA SUM)
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
          Math & Trig
        </span>
      </div>

      <div className="p-3 rounded-xl bg-black/60 border border-zinc-800 font-mono text-xs mb-3">
        <code>=SUMIFS(<span className="text-emerald-400">{sumRange}</span>, <span className="text-sky-300">{criteria1}</span>, <span className="text-amber-400">{criteria2}</span>)</code>
      </div>

      <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 font-mono text-xs flex justify-between items-center">
        <span className="text-emerald-400">Summed Output:</span>
        <span className="text-white font-extrabold text-base">{aggregatedTotal}</span>
      </div>
    </div>
  );
};
