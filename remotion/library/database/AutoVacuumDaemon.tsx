import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface AutoVacuumDaemonProps {
  workersCount?: number;
  tablesMonitored?: number;
  className?: string;
}

export const AutoVacuumDaemon: React.FC<AutoVacuumDaemonProps> = ({
  workersCount = 3,
  tablesMonitored = 48,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30 flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>AUTOVACUUM DAEMON</span>
        </span>
        <span className="text-emerald-400 font-bold">ACTIVE</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-5 flex flex-col justify-between font-mono">
        <div>
          <div className="text-sm font-bold text-white">Background Autonomous Maintenance</div>
          <div className="text-xs text-white/50 mt-1">{workersCount} Workers active across {tablesMonitored} tables</div>
        </div>

        <div className="p-3 bg-zinc-950 rounded border border-white/10 text-xs text-white/80 my-2">
          Threshold: 50 tuples + 20% table scale factor triggers automated vacuum & analyze.
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>COST LIMIT: 200 DELAY 2ms</span>
        <span>ZERO PERFORMANCE DEGRADATION</span>
      </div>
    </div>
  );
};
