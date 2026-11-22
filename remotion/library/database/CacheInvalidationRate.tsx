import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface CacheInvalidationRateProps {
  evictionsPerSec?: number;
  expirationsPerSec?: number;
  cacheStore?: string;
  memoryReclaimedMB?: number;
  className?: string;
}

export const CacheInvalidationRate: React.FC<CacheInvalidationRateProps> = ({
  evictionsPerSec = 1420,
  expirationsPerSec = 3850,
  cacheStore = "Redis Cluster (6 Nodes)",
  memoryReclaimedMB = 480,
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const animEvict = interpolate(frame, [0, 40], [0, evictionsPerSec], { extrapolateRight: 'clamp' });
  const animExp = interpolate(frame, [0, 40], [0, expirationsPerSec], { extrapolateRight: 'clamp' });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-purple-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-purple-400" />
          <span className="text-xs uppercase tracking-wider text-purple-400 font-bold">
            CACHE INVALIDATION & CHURN
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
          {cacheStore}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono mb-3">
        <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/20">
          <div className="text-[10px] text-zinc-400 uppercase">Key Expirations / Sec</div>
          <div className="text-2xl font-bold text-purple-400 mt-1">{animExp.toFixed(0)}/s</div>
          <div className="text-[10px] text-zinc-500">TTL expired keys</div>
        </div>

        <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/20">
          <div className="text-[10px] text-zinc-400 uppercase">Memory Evictions / Sec</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">{animEvict.toFixed(0)}/s</div>
          <div className="text-[10px] text-zinc-500">LRU/LFU maxmemory policy</div>
        </div>
      </div>

      <div className="flex justify-between items-center text-xs font-mono text-zinc-400 border-t border-zinc-800 pt-2">
        <span>Memory Reclaimed:</span>
        <span className="text-purple-300 font-bold">{memoryReclaimedMB} MB / min</span>
      </div>
    </div>
  );
};
