import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface ConnectionPoolManagerProps {
  poolName?: string;
  activeConn?: number;
  maxConn?: number;
  idleConn?: number;
  className?: string;
}

export const ConnectionPoolManager: React.FC<ConnectionPoolManagerProps> = ({
  poolName = 'PgBouncer Transaction Pool',
  activeConn = 34,
  maxConn = 100,
  idleConn = 12,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-teal-500/20 text-teal-400 font-bold border border-teal-500/30">
          CONNECTION POOL MANAGER
        </span>
        <span className="text-teal-400 font-bold">TRANSACTION MODE</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-5 flex flex-col justify-between font-mono">
        <div>
          <div className="text-base font-bold text-white">{poolName}</div>
          <div className="text-xs text-teal-300 mt-0.5">Multiplexing 1,200 serverless clients into {maxConn} Postgres connections</div>
        </div>

        <div className="grid grid-cols-3 gap-3 my-2">
          <div className="p-3 bg-zinc-950 rounded border border-white/10 text-center">
            <div className="text-[10px] text-white/40 font-bold">ACTIVE</div>
            <div className="text-xl font-black text-teal-400 mt-0.5">{activeConn}</div>
          </div>
          <div className="p-3 bg-zinc-950 rounded border border-white/10 text-center">
            <div className="text-[10px] text-white/40 font-bold">IDLE POOL</div>
            <div className="text-xl font-bold text-sky-400 mt-0.5">{idleConn}</div>
          </div>
          <div className="p-3 bg-zinc-950 rounded border border-white/10 text-center">
            <div className="text-[10px] text-white/40 font-bold">MAX LIMIT</div>
            <div className="text-xl font-bold text-white mt-0.5">{maxConn}</div>
          </div>
        </div>

        <div className="text-xs text-white/60 flex justify-between pt-2 border-t border-white/10">
          <span>AVG CHECKOUT LATENCY: 0.2ms</span>
          <span className="text-emerald-400">QUEUE DEPTH: 0</span>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>PREVENTS CONNECTION EXHAUSTION</span>
        <span>SUPABASE TRANSACTION POOL</span>
      </div>
    </div>
  );
};
