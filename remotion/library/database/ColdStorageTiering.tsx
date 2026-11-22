import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface ColdStorageTieringProps {
  hotStorageGB?: number;
  coldStorageTB?: number;
  monthlySavingsPercent?: number;
  tieringPolicy?: string;
  className?: string;
}

export const ColdStorageTiering: React.FC<ColdStorageTieringProps> = ({
  hotStorageGB = 850,
  coldStorageTB = 24.8,
  monthlySavingsPercent = 89.2,
  tieringPolicy = "30d Standard -> 90d Glacier -> 365d Deep Archive",
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-indigo-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
          <span className="text-xs uppercase tracking-wider text-indigo-400 font-bold">
            BACKUP COLD STORAGE TIERING
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/20 font-bold">
          {monthlySavingsPercent}% COST REDUCTION
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-xs mb-3">
        <div className="p-3 rounded-xl bg-sky-950/20 border border-sky-500/30">
          <div className="text-[10px] text-sky-400 uppercase">Hot Tier (S3 Standard)</div>
          <div className="text-white font-bold text-lg mt-1">{hotStorageGB} GB</div>
          <div className="text-[10px] text-zinc-500 mt-1">Instant retrieval (Last 30 Days)</div>
        </div>

        <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/30">
          <div className="text-[10px] text-indigo-400 uppercase">Cold Tier (Glacier Deep)</div>
          <div className="text-indigo-300 font-bold text-lg mt-1">{coldStorageTB} TB</div>
          <div className="text-[10px] text-zinc-500 mt-1">$0.00099 / GB / Month</div>
        </div>
      </div>

      <div className="text-[10px] font-mono text-zinc-400 flex justify-between border-t border-zinc-800/80 pt-2">
        <span>Policy: {tieringPolicy}</span>
      </div>
    </div>
  );
};
