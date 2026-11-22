import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface IndexFragmentationLevelProps {
  indexName?: string;
  fragmentationPercent?: number;
  leafPages?: number;
  fillfactor?: number;
  className?: string;
}

export const IndexFragmentationLevel: React.FC<IndexFragmentationLevelProps> = ({
  indexName = "idx_orders_customer_id",
  fragmentationPercent = 46.8,
  leafPages = 14200,
  fillfactor = 90,
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const animFrag = interpolate(frame, [0, 45], [0, fragmentationPercent], { extrapolateRight: 'clamp' });
  const isHigh = animFrag > 30;

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-amber-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className={`w-2.5 h-2.5 rounded-full ${isHigh ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
          <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
            B-TREE INDEX FRAGMENTATION
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
          {indexName}
        </span>
      </div>

      <div className="flex justify-between items-baseline mb-2 font-mono">
        <div>
          <span className="text-4xl font-extrabold text-amber-400">{animFrag.toFixed(1)}%</span>
          <span className="text-xs text-zinc-400 ml-2">Page Fragmentation</span>
        </div>
        <span className="text-xs px-2 py-1 rounded font-bold uppercase bg-amber-950 text-amber-300 border border-amber-500/20">
          REINDEX RECOMMENDED
        </span>
      </div>

      <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-red-500"
          style={{ width: `${animFrag}%` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-xs">
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Leaf Pages Scanned</div>
          <div className="text-white font-bold text-base mt-1">{leafPages.toLocaleString()}</div>
          <div className="text-[10px] text-zinc-500">B-Tree structure depth: 3</div>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Target Fillfactor</div>
          <div className="text-sky-400 font-bold text-base mt-1">{fillfactor}%</div>
          <div className="text-[10px] text-zinc-500">Reserved page free-space</div>
        </div>
      </div>
    </div>
  );
};
