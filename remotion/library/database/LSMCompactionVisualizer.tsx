import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface LSMCompactionVisualizerProps {
  memTableMB?: number;
  level0Count?: number;
  level1Count?: number;
  level2Count?: number;
  compactionStatus?: string;
  className?: string;
}

export const LSMCompactionVisualizer: React.FC<LSMCompactionVisualizerProps> = ({
  memTableMB = 64,
  level0Count = 4,
  level1Count = 12,
  level2Count = 48,
  compactionStatus = "LEVELED COMPACTION IN PROGRESS",
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
          <div className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
          <span className="text-xs uppercase tracking-wider text-purple-400 font-bold">
            LSM TREE COMPACTION ENGINE
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/20 font-bold">
          {compactionStatus}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2 font-mono text-center text-xs mb-3">
        <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20">
          <div className="text-[10px] text-zinc-400 uppercase">MemTable (RAM)</div>
          <div className="text-emerald-400 font-bold text-sm mt-1">{memTableMB} MB</div>
        </div>
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Level 0 (Disk)</div>
          <div className="text-white font-bold text-sm mt-1">{level0Count} SSTables</div>
        </div>
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Level 1 (Disk)</div>
          <div className="text-sky-400 font-bold text-sm mt-1">{level1Count} SSTables</div>
        </div>
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Level 2 (Disk)</div>
          <div className="text-purple-400 font-bold text-sm mt-1">{level2Count} SSTables</div>
        </div>
      </div>

      <div className="text-[10px] font-mono text-zinc-400 flex justify-between">
        <span>Engine: RocksDB / LevelDB</span>
        <span className="text-emerald-400 font-bold">Append-Only Write Speed</span>
      </div>
    </div>
  );
};
