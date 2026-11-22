import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface TableStorageTreeMapProps {
  tableName?: string;
  heapSizeMB?: number;
  indexSizeMB?: number;
  toastSizeMB?: number;
  className?: string;
}

export const TableStorageTreeMap: React.FC<TableStorageTreeMapProps> = ({
  tableName = "public.audit_logs",
  heapSizeMB = 4850,
  indexSizeMB = 3120,
  toastSizeMB = 1240,
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const totalMB = heapSizeMB + indexSizeMB + toastSizeMB;

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-indigo-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
          <span className="text-xs uppercase tracking-wider text-indigo-400 font-bold">
            TABLE STORAGE BREAKDOWN
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
          {(totalMB / 1024).toFixed(2)} GB Total
        </span>
      </div>

      <div className="w-full bg-zinc-800 h-4 rounded-full overflow-hidden flex mb-4 font-mono text-[10px]">
        <div className="h-full bg-indigo-500" style={{ width: `${(heapSizeMB / totalMB) * 100}%` }} />
        <div className="h-full bg-sky-500" style={{ width: `${(indexSizeMB / totalMB) * 100}%` }} />
        <div className="h-full bg-amber-500" style={{ width: `${(toastSizeMB / totalMB) * 100}%` }} />
      </div>

      <div className="grid grid-cols-3 gap-2 font-mono text-xs">
        <div className="p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20">
          <div className="text-[10px] text-zinc-400 uppercase">Heap Data</div>
          <div className="text-indigo-300 font-bold mt-0.5">{(heapSizeMB / 1024).toFixed(2)} GB</div>
        </div>
        <div className="p-2.5 rounded-xl bg-sky-950/30 border border-sky-500/20">
          <div className="text-[10px] text-zinc-400 uppercase">B-Tree Indexes</div>
          <div className="text-sky-300 font-bold mt-0.5">{(indexSizeMB / 1024).toFixed(2)} GB</div>
        </div>
        <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/20">
          <div className="text-[10px] text-zinc-400 uppercase">TOAST (LOB)</div>
          <div className="text-amber-300 font-bold mt-0.5">{(toastSizeMB / 1024).toFixed(2)} GB</div>
        </div>
      </div>
    </div>
  );
};
