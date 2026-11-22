import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface GoalSeekSolverProps {
  setCell?: string;
  toValue?: string | number;
  byChangingCell?: string;
  solutionFound?: boolean;
  className?: string;
}

export const GoalSeekSolver: React.FC<GoalSeekSolverProps> = ({
  setCell = "Total_Gross_Profit (B14)",
  toValue = "$100,000",
  byChangingCell = "Price_Per_Unit (C2)",
  solutionFound = true,
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-amber-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
            GOAL SEEK (WHAT-IF SOLVER)
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/20 font-bold">
          CONVERGED
        </span>
      </div>

      <div className="space-y-2.5 font-mono text-xs mb-3">
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex justify-between">
          <span className="text-zinc-400">Set Cell:</span>
          <span className="text-white font-bold">{setCell}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex justify-between">
          <span className="text-zinc-400">To Value Target:</span>
          <span className="text-emerald-400 font-bold text-sm">{toValue}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex justify-between">
          <span className="text-zinc-400">By Changing Cell:</span>
          <span className="text-sky-300 font-bold">{byChangingCell}</span>
        </div>
      </div>

      <div className="text-[10px] font-mono text-zinc-400 flex justify-between">
        <span>Newton-Raphson Iteration</span>
        <span className="text-emerald-400 font-bold">Solution Found in 8 Iterations</span>
      </div>
    </div>
  );
};
