import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface ScenarioManagerCardProps {
  scenarios?: { name: string; revenue: string; ebitda: string; margin: string }[];
  className?: string;
}

export const ScenarioManagerCard: React.FC<ScenarioManagerCardProps> = ({
  scenarios = [
    { name: "Best Case", revenue: "$4.5M", ebitda: "$1.2M", margin: "26.7%" },
    { name: "Base Case", revenue: "$3.2M", ebitda: "$750K", margin: "23.4%" },
    { name: "Worst Case", revenue: "$2.1M", ebitda: "$280K", margin: "13.3%" },
  ],
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-emerald-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
            SCENARIO MANAGER (SENSITIVITY)
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
          Financial Model
        </span>
      </div>

      <div className="space-y-2 font-mono text-xs">
        {scenarios.map((s, idx) => (
          <div key={idx} className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 flex justify-between items-center">
            <span className="text-white font-bold w-28">{s.name}</span>
            <span className="text-emerald-400 font-bold">{s.revenue} Rev</span>
            <span className="text-sky-300">{s.ebitda} EBITDA</span>
            <span className="text-purple-300 font-bold">{s.margin}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
