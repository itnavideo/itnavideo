import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface WALArchivingStreamProps {
  currentSegment?: string;
  archivedCount?: number;
  currentLSN?: string;
  uploadSpeedMBps?: number;
  className?: string;
}

export const WALArchivingStream: React.FC<WALArchivingStreamProps> = ({
  currentSegment = "000000010000016B000000F4",
  archivedCount = 1420,
  currentLSN = "16B/F4000028",
  uploadSpeedMBps = 45.2,
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const pulse = Math.sin(frame / 6) * 0.15 + 0.85;

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-purple-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-purple-400" style={{ opacity: pulse }} />
          <span className="text-xs uppercase tracking-wider text-purple-400 font-bold">
            CONTINUOUS WAL ARCHIVING STREAM
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/20 font-bold">
          LIVE STREAMING
        </span>
      </div>

      <div className="p-3 rounded-xl bg-black/60 border border-zinc-800 font-mono text-xs mb-3">
        <div className="text-[10px] text-zinc-500 uppercase mb-0.5">Current Active WAL Segment</div>
        <code className="text-purple-300 text-xs block overflow-hidden text-ellipsis">{currentSegment}</code>
      </div>

      <div className="grid grid-cols-3 gap-2 font-mono text-xs mb-3">
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Archived Files</div>
          <div className="text-white font-bold text-sm mt-0.5">{archivedCount.toLocaleString()}</div>
        </div>
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Log Sequence (LSN)</div>
          <div className="text-sky-400 font-bold text-sm mt-0.5">{currentLSN}</div>
        </div>
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Push Speed</div>
          <div className="text-emerald-400 font-bold text-sm mt-0.5">{uploadSpeedMBps} MB/s</div>
        </div>
      </div>

      <div className="text-[10px] font-mono text-zinc-400 flex justify-between">
        <span>Target: Amazon S3 (Cold Storage Sync)</span>
        <span className="text-purple-300 font-bold">Zero WAL Lag</span>
      </div>
    </div>
  );
};
