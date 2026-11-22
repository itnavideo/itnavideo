import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface ConnectionDrainProps {
  gracePeriodSec?: number;
  drainedClients?: number;
  className?: string;
}

export const ConnectionDrain: React.FC<ConnectionDrainProps> = ({
  gracePeriodSec = 30,
  drainedClients = 184,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
          CONNECTION DRAIN
        </span>
        <span className="text-amber-400 font-bold">MAINTENANCE MODE</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-5 flex flex-col justify-between font-mono">
        <div>
          <div className="text-sm font-bold text-white">Graceful Pool Drain in Progress</div>
          <div className="text-xs text-white/50 mt-1">{gracePeriodSec}s Grace Period for In-Flight Transactions</div>
        </div>

        <div className="p-3 bg-zinc-950 rounded border border-white/10 text-xs text-white/80 my-2">
          {drainedClients} clients redirected to warm standby replica. Zero dropped queries.
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>FAILOVER READY</span>
        <span>ZERO CLIENT TIMEOUTS</span>
      </div>
    </div>
  );
};
