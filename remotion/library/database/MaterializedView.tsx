import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface MaterializedViewProps {
  matViewName?: string;
  lastRefreshed?: string;
  refreshFrequency?: string;
  className?: string;
}

export const MaterializedView: React.FC<MaterializedViewProps> = ({
  matViewName = 'mv_daily_analytics_cache',
  lastRefreshed = '4 minutes ago',
  refreshFrequency = 'Every 15 minutes (CRON)',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-purple-500/20 text-purple-400 font-bold border border-purple-500/30">
          MATERIALIZED VIEW
        </span>
        <span className="text-emerald-400 font-bold">DISK PERSISTED CACHE</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-5 flex flex-col justify-between font-mono">
        <div>
          <div className="text-sm font-bold text-white">⚡ {matViewName}</div>
          <div className="text-xs text-purple-300 mt-0.5">Pre-computed aggregation cached to disk</div>
        </div>

        <div className="grid grid-cols-2 gap-3 my-2">
          <div className="p-3 bg-zinc-950 rounded border border-white/10 text-center">
            <div className="text-[10px] text-white/40 font-bold">LAST REFRESH</div>
            <div className="text-xs font-bold text-emerald-400 mt-1">{lastRefreshed}</div>
          </div>
          <div className="p-3 bg-zinc-950 rounded border border-white/10 text-center">
            <div className="text-[10px] text-white/40 font-bold">SCHEDULE</div>
            <div className="text-xs font-bold text-sky-400 mt-1">{refreshFrequency}</div>
          </div>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>REFRESH MATERIALIZED VIEW CONCURRENTLY</span>
        <span>INDEX SUPPORTED</span>
      </div>
    </div>
  );
};
