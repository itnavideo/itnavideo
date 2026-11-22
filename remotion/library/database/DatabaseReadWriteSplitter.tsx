import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface DatabaseReadWriteSplitterProps {
  writerQps?: number;
  readerQps?: number;
  offloadedPercentage?: number;
  className?: string;
}

export const DatabaseReadWriteSplitter: React.FC<DatabaseReadWriteSplitterProps> = ({
  writerQps = 3200,
  readerQps = 28400,
  offloadedPercentage = 89.8,
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
            READ / WRITE TRAFFIC SPLITTER
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/20 font-bold">
          {offloadedPercentage}% OFFLOADED
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-xs mb-3">
        <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30">
          <div className="text-[10px] text-amber-400 uppercase">Writer (Primary)</div>
          <div className="text-white font-bold text-base mt-1">{writerQps.toLocaleString()} QPS</div>
          <div className="text-[10px] text-zinc-500">INSERT / UPDATE / DELETE</div>
        </div>

        <div className="p-3 rounded-xl bg-sky-950/20 border border-sky-500/30">
          <div className="text-[10px] text-sky-400 uppercase">Readers (5 Replicas)</div>
          <div className="text-sky-300 font-bold text-base mt-1">{readerQps.toLocaleString()} QPS</div>
          <div className="text-[10px] text-zinc-500">SELECT / Analytics queries</div>
        </div>
      </div>
    </div>
  );
};
