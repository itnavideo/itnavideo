import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface MemoryMappedDatabaseProps {
  engineName?: string;
  readThroughputOPS?: number;
  zeroCopyPaging?: boolean;
  className?: string;
}

export const MemoryMappedDatabase: React.FC<MemoryMappedDatabaseProps> = ({
  engineName = "Lightning Memory-Mapped Database (LMDB)",
  readThroughputOPS = 1450000,
  zeroCopyPaging = true,
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-purple-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-purple-400" />
          <span className="text-xs uppercase tracking-wider text-purple-400 font-bold">
            ZERO-COPY MEMORY-MAPPED (mmap)
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/20 font-bold">
          OS PAGE CACHE NATIVE
        </span>
      </div>

      <div className="flex justify-between items-baseline mb-4 font-mono">
        <div>
          <span className="text-xl font-bold text-white">{engineName}</span>
        </div>
        <span className="text-2xl font-extrabold text-purple-400">{(readThroughputOPS / 1000000).toFixed(2)}M OPS</span>
      </div>

      <div className="text-[10px] font-mono text-zinc-400 flex justify-between border-t border-zinc-800/80 pt-2">
        <span>Direct pointers into kernel virtual memory space</span>
        <span className="text-emerald-400 font-bold">Zero User-Space Buffer Copies</span>
      </div>
    </div>
  );
};
