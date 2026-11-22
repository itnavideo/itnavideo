import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface PivotTableBuilderProps {
  rowsField?: string;
  columnsField?: string;
  valuesField?: string;
  filtersField?: string;
  className?: string;
}

export const PivotTableBuilder: React.FC<PivotTableBuilderProps> = ({
  rowsField = "Sales_Representative",
  columnsField = "Quarter (Q1..Q4)",
  valuesField = "SUM(Gross_Revenue)",
  filtersField = "Region = 'North America'",
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-emerald-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
            PIVOT TABLE FIELD BUILDER
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
          OLAP Summary
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2.5 font-mono text-xs">
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-500 uppercase font-bold">Filters Quadrant</div>
          <div className="text-amber-400 font-bold text-xs mt-1">{filtersField}</div>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-500 uppercase font-bold">Columns Quadrant</div>
          <div className="text-sky-300 font-bold text-xs mt-1">{columnsField}</div>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-500 uppercase font-bold">Rows Quadrant</div>
          <div className="text-purple-300 font-bold text-xs mt-1">{rowsField}</div>
        </div>

        <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
          <div className="text-[10px] text-emerald-400 uppercase font-bold">Values (Aggregations)</div>
          <div className="text-emerald-300 font-bold text-xs mt-1">{valuesField}</div>
        </div>
      </div>
    </div>
  );
};
