import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface SlowQueryParetoChartProps {
  topQueriesPercent?: number;
  totalLoadGeneratedPercent?: number;
  topQueryFingerprint?: string;
  className?: string;
}

export const SlowQueryParetoChart: React.FC<SlowQueryParetoChartProps> = ({
  topQueriesPercent = 4.2,
  totalLoadGeneratedPercent = 78.4,
  topQueryFingerprint = "SELECT * FROM orders WHERE user_id = $1 ORDER BY id DESC",
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
            PARETO LOAD ANALYSIS (80/20)
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/20 font-bold">
          HIGH CONCENTRATION
        </span>
      </div>

      <div className="flex justify-between items-baseline mb-3 font-mono">
        <div>
          <span className="text-3xl font-extrabold text-amber-400">{totalLoadGeneratedPercent}%</span>
          <span className="text-xs text-zinc-400 ml-2">Total DB CPU Consumed</span>
        </div>
        <span className="text-xs text-zinc-400">By only {topQueriesPercent}% of Query Types</span>
      </div>

      <div className="p-3 rounded-xl bg-black/60 border border-zinc-800 font-mono text-xs text-zinc-200">
        <code>{topQueryFingerprint}</code>
      </div>
    </div>
  );
};
