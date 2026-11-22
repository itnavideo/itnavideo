import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface KeyValueStoreCardProps {
  engineName?: string;
  avgLatencyUs?: number;
  dataStructures?: string[];
  persistenceMode?: string;
  className?: string;
}

export const KeyValueStoreCard: React.FC<KeyValueStoreCardProps> = ({
  engineName = "Redis Enterprise / Memcached",
  avgLatencyUs = 450,
  dataStructures = ["Strings", "Hashes", "Lists", "Sets", "Sorted Sets", "Bitmaps"],
  persistenceMode = "RDB Snapshots + AOF Log",
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const pulse = Math.sin(frame / 6) * 0.15 + 0.85;

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-red-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" style={{ opacity: pulse }} />
          <span className="text-xs uppercase tracking-wider text-red-400 font-bold">
            KEY-VALUE IN-MEMORY STORE
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/20 font-bold">
          O(1) COMPLEXITY
        </span>
      </div>

      <div className="flex justify-between items-baseline mb-3 font-mono">
        <div>
          <span className="text-2xl font-bold text-white">{engineName}</span>
        </div>
        <div className="text-right">
          <span className="text-2xl font-extrabold text-emerald-400">{avgLatencyUs} μs</span>
          <span className="text-[10px] text-zinc-400 block">Sub-millisecond</span>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-black/60 border border-zinc-800 font-mono text-xs mb-3">
        <div className="text-[10px] text-zinc-500 uppercase mb-1">Native In-Memory Data Types</div>
        <div className="flex flex-wrap gap-1">
          {dataStructures.map((ds, idx) => (
            <span key={idx} className="px-2 py-0.5 rounded bg-zinc-800 text-red-300 text-[10px]">
              {ds}
            </span>
          ))}
        </div>
      </div>

      <div className="text-[10px] font-mono text-zinc-400 flex justify-between">
        <span>Persistence: {persistenceMode}</span>
        <span className="text-emerald-400 font-bold">100k+ OPS / Core</span>
      </div>
    </div>
  );
};
