import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface TempFileSpillProps {
  tempBytesMB?: number;
  tempFilesCount?: number;
  operation?: string;
  workMemMB?: number;
  className?: string;
}

export const TempFileSpill: React.FC<TempFileSpillProps> = ({
  tempBytesMB = 340,
  tempFilesCount = 6,
  operation = "External Sort on disk",
  workMemMB = 64,
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const animBytes = interpolate(frame, [0, 40], [0, tempBytesMB], { extrapolateRight: 'clamp' });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-amber-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
            TEMP FILE DISK SPILL
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/20">
          MEMORY EXHAUSTION
        </span>
      </div>

      <div className="p-3 rounded-lg bg-black/60 border border-zinc-800 mb-4 font-mono text-xs text-amber-300">
        <code>{operation} (exceeded work_mem={workMemMB}MB)</code>
      </div>

      <div className="grid grid-cols-3 gap-3 font-mono text-xs mb-3">
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Spilled to Disk</div>
          <div className="text-amber-400 font-bold text-lg mt-1">{animBytes.toFixed(0)} MB</div>
        </div>
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Temp Files</div>
          <div className="text-zinc-200 font-bold text-lg mt-1">{tempFilesCount} files</div>
        </div>
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Configured RAM</div>
          <div className="text-sky-400 font-bold text-lg mt-1">{workMemMB} MB</div>
        </div>
      </div>

      <div className="text-[10px] font-mono text-zinc-400 flex items-center justify-between">
        <span>Remedy: Increase work_mem for session</span>
        <span className="text-sky-400 font-bold">SET work_mem = '512MB';</span>
      </div>
    </div>
  );
};
