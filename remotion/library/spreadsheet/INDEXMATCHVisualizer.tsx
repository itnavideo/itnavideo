import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface INDEXMATCHVisualizerProps {
  lookupRowItem?: string;
  lookupColItem?: string;
  matchedRowIndex?: number;
  matchedColIndex?: number;
  intersectionResult?: string;
  className?: string;
}

export const INDEXMATCHVisualizer: React.FC<INDEXMATCHVisualizerProps> = ({
  lookupRowItem = "Q3 2026",
  lookupColItem = "Operating Profit",
  matchedRowIndex = 4,
  matchedColIndex = 3,
  intersectionResult = "$1,840,000",
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
            INDEX + MATCH (2-WAY MATRIX LOOKUP)
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
          Grid Matrix
        </span>
      </div>

      <div className="p-3 rounded-xl bg-black/60 border border-zinc-800 font-mono text-xs mb-3">
        <code>=INDEX(DataRange, MATCH("{lookupRowItem}", RowRange, 0), MATCH("{lookupColItem}", ColRange, 0))</code>
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-xs mb-3">
        <div className="p-2.5 rounded-xl bg-indigo-950/20 border border-indigo-500/30">
          <div className="text-[10px] text-indigo-400 uppercase">Row Coordinate</div>
          <div className="text-white font-bold text-xs mt-0.5">Row #{matchedRowIndex} ("{lookupRowItem}")</div>
        </div>
        <div className="p-2.5 rounded-xl bg-sky-950/20 border border-sky-500/30">
          <div className="text-[10px] text-sky-400 uppercase">Column Coordinate</div>
          <div className="text-white font-bold text-xs mt-0.5">Col #{matchedColIndex} ("{lookupColItem}")</div>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 font-mono text-xs flex justify-between items-center">
        <span className="text-emerald-400 font-bold">Matrix Intersection [R{matchedRowIndex}, C{matchedColIndex}]:</span>
        <span className="text-white font-bold text-base">{intersectionResult}</span>
      </div>
    </div>
  );
};
