import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface DatabaseCloneCopyProps {
  sourceDb?: string;
  cloneDb?: string;
  sourceSizeGB?: number;
  cloneCreationSec?: number;
  className?: string;
}

export const DatabaseCloneCopy: React.FC<DatabaseCloneCopyProps> = ({
  sourceDb = "production_aurora_cluster",
  cloneDb = "staging_qa_clone_preview",
  sourceSizeGB = 1200,
  cloneCreationSec = 2.4,
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-sky-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-sky-400" />
          <span className="text-xs uppercase tracking-wider text-sky-400 font-bold">
            ZERO-COPY THIN CLONE (CoW)
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-500/20 font-bold">
          INSTANT SPAWN
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-xs mb-3">
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Source Database</div>
          <div className="text-white font-bold text-sm mt-1">{sourceDb}</div>
          <div className="text-[10px] text-zinc-500">{sourceSizeGB} GB storage pointer</div>
        </div>

        <div className="p-3 rounded-xl bg-sky-950/20 border border-sky-500/30">
          <div className="text-[10px] text-sky-400 uppercase">Isolated Clone</div>
          <div className="text-sky-300 font-bold text-sm mt-1">{cloneDb}</div>
          <div className="text-[10px] text-emerald-400 mt-1">Ready in {cloneCreationSec}s</div>
        </div>
      </div>

      <div className="text-[10px] font-mono text-zinc-400 flex justify-between">
        <span>Storage Allocated: 0 MB (Allocated on first write)</span>
        <span className="text-emerald-400 font-bold">Zero Impact on Production</span>
      </div>
    </div>
  );
};
