import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface QueryPlanRegressionProps {
  baselineCostMs?: number;
  regressedCostMs?: number;
  baselinePlan?: string;
  regressedPlan?: string;
  queryId?: string;
  className?: string;
}

export const QueryPlanRegression: React.FC<QueryPlanRegressionProps> = ({
  baselineCostMs = 145,
  regressedCostMs = 3840,
  baselinePlan = "Index Scan using idx_users_email",
  regressedPlan = "Seq Scan on users (Filter: email)",
  queryId = "q_842a901f",
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const regressionRatio = ((regressedCostMs - baselineCostMs) / baselineCostMs) * 100;
  const animRatio = interpolate(frame, [0, 45], [0, regressionRatio], { extrapolateRight: 'clamp' });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-red-500/40 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
          <span className="text-xs uppercase tracking-wider text-red-400 font-bold">
            QUERY PLAN REGRESSION DETECTED
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
          {queryId}
        </span>
      </div>

      <div className="flex justify-between items-baseline mb-4 font-mono">
        <div>
          <span className="text-4xl font-extrabold text-red-400">+{animRatio.toFixed(0)}%</span>
          <span className="text-xs text-zinc-400 ml-2">Latency Degradation</span>
        </div>
        <span className="text-xs px-2 py-1 rounded bg-red-950 text-red-300 border border-red-500/30 font-bold">
          PLAN FLIP ALERT
        </span>
      </div>

      <div className="space-y-2 font-mono text-xs">
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 flex justify-between items-center">
          <div>
            <div className="text-[10px] text-zinc-400 uppercase">Baseline Plan</div>
            <div className="text-emerald-400 font-bold mt-0.5">{baselinePlan}</div>
          </div>
          <div className="text-right font-bold text-emerald-400 text-sm">{baselineCostMs} ms</div>
        </div>

        <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/30 flex justify-between items-center">
          <div>
            <div className="text-[10px] text-red-400 uppercase">Regressed Plan</div>
            <div className="text-red-400 font-bold mt-0.5">{regressedPlan}</div>
          </div>
          <div className="text-right font-bold text-red-400 text-sm">{regressedCostMs} ms</div>
        </div>
      </div>
    </div>
  );
};
