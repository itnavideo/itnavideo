import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface BufferPoolHitMissProps {
  cacheHitRatio?: number;
  sharedBuffersSize?: string;
  className?: string;
}

export const BufferPoolHitMiss: React.FC<BufferPoolHitMissProps> = ({
  cacheHitRatio = 99.8,
  sharedBuffersSize = '16 GB RAM (shared_buffers)',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-teal-500/20 text-teal-400 font-bold border border-teal-500/30">
          SHARED BUFFERS CACHE
        </span>
        <span className="text-emerald-400 font-bold">{cacheHitRatio}% HIT RATIO</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-5 flex flex-col justify-between font-mono">
        <div>
          <div className="text-sm font-bold text-white">PostgreSQL Buffer Pool Monitor</div>
          <div className="text-xs text-teal-300 mt-0.5">{sharedBuffersSize}</div>
        </div>

        <div className="p-3 bg-zinc-950 rounded border border-white/10 text-xs text-white/80 my-2">
          99.8% of query reads served directly from RAM. Physical NVMe SSD reads bypassed.
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>CLOCK SWEEP ALGORITHM ACTIVE</span>
        <span>CACHE HEALTH: OPTIMAL</span>
      </div>
    </div>
  );
};
