import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface PerformanceInsightsDashboardProps {
  maxvCPU?: number;
  currentAAS?: number;
  topWaitEvent?: string;
  className?: string;
}

export const PerformanceInsightsDashboard: React.FC<PerformanceInsightsDashboardProps> = ({
  maxvCPU = 8.0,
  currentAAS = 4.2,
  topWaitEvent = "wait/io/table/sql/handler (42% of load)",
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
            PERFORMANCE INSIGHTS (AAS)
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/20 font-bold">
          UNDER vCPU LIMIT
        </span>
      </div>

      <div className="flex justify-between items-baseline mb-3 font-mono">
        <div>
          <span className="text-3xl font-extrabold text-white">{currentAAS}</span>
          <span className="text-xs text-zinc-400 ml-1">/ {maxvCPU} Average Active Sessions (AAS)</span>
        </div>
        <span className="text-xs text-sky-400 font-bold">{((currentAAS / maxvCPU) * 100).toFixed(0)}% vCPU</span>
      </div>

      <div className="p-3 rounded-xl bg-black/60 border border-zinc-800 font-mono text-xs mb-3">
        <div className="text-[10px] text-zinc-500 uppercase mb-0.5">Dominant Wait State</div>
        <code className="text-amber-400">{topWaitEvent}</code>
      </div>

      <div className="text-[10px] font-mono text-zinc-400 flex justify-between">
        <span>7-day rolling performance metrics retained</span>
      </div>
    </div>
  );
};
