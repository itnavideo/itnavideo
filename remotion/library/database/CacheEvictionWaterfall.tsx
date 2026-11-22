import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface CacheEvictionWaterfallProps {
  memoryUsagePercent?: number;
  evictedKeysCount?: number;
  reclaimedMemoryMB?: number;
  className?: string;
}

export const CacheEvictionWaterfall: React.FC<CacheEvictionWaterfallProps> = ({
  memoryUsagePercent = 94.2,
  evictedKeysCount = 48200,
  reclaimedMemoryMB = 850,
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
            CACHE EVICTION WATERFALL
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/20 font-bold">
          MAXMEMORY REACHED
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-xs mb-3">
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Keys Evicted</div>
          <div className="text-amber-400 font-bold text-base mt-1">{evictedKeysCount.toLocaleString()} Keys</div>
          <div className="text-[10px] text-zinc-500">Volatile LRU policy</div>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Memory Reclaimed</div>
          <div className="text-emerald-400 font-bold text-base mt-1">{reclaimedMemoryMB} MB</div>
          <div className="text-[10px] text-zinc-500">Buffer pressure relieved</div>
        </div>
      </div>
    </div>
  );
};
