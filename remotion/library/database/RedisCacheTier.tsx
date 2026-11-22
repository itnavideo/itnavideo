import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface RedisCacheTierProps {
  hitRatio?: number;
  memoryUsed?: string;
  opsPerSec?: string;
  className?: string;
}

export const RedisCacheTier: React.FC<RedisCacheTierProps> = ({
  hitRatio = 94.2,
  memoryUsed = '4.2 GB / 16 GB',
  opsPerSec = '85,000 Ops/Sec',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-red-500/20 text-red-400 font-bold border border-red-500/30">
          IN-MEMORY REDIS CACHE
        </span>
        <span className="text-emerald-400 font-bold">SUB-MILLISECOND</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-5 flex flex-col justify-between font-mono">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm font-bold text-white">Redis Cluster Cache Tier</div>
            <div className="text-xs text-red-400 mt-0.5">{opsPerSec} Ingestion Rate</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-emerald-400">{hitRatio}%</div>
            <div className="text-[9px] text-white/40">CACHE HIT RATIO</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 my-2">
          <div className="p-3 bg-zinc-950 rounded border border-white/10 text-center">
            <div className="text-[10px] text-white/40 font-bold">MEMORY FOOTPRINT</div>
            <div className="text-xs font-bold text-white mt-1">{memoryUsed}</div>
          </div>
          <div className="p-3 bg-zinc-950 rounded border border-white/10 text-center">
            <div className="text-[10px] text-white/40 font-bold">EVICTION POLICY</div>
            <div className="text-xs font-bold text-amber-300 mt-1">allkeys-lru</div>
          </div>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>READ-THROUGH CACHE: ACTIVE</span>
        <span>LATENCY: 0.18ms</span>
      </div>
    </div>
  );
};
