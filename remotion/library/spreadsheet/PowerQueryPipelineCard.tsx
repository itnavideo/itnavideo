import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface PowerQueryPipelineCardProps {
  steps?: string[];
  rowsProcessedCount?: number;
  className?: string;
}

export const PowerQueryPipelineCard: React.FC<PowerQueryPipelineCardProps> = ({
  steps = [
    "Source = Csv.Document(File.Contents(\"sales.csv\"))",
    "Promoted Headers = Table.PromoteHeaders(Source)",
    "Changed Type = Table.TransformColumnTypes(...)",
    "Filtered Rows = Table.SelectRows(..., each [Revenue] > 0)",
  ],
  rowsProcessedCount = 48500,
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
            POWER QUERY ETL (M LANGUAGE)
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/20 font-bold">
          {rowsProcessedCount.toLocaleString()} ROWS LOADED
        </span>
      </div>

      <div className="space-y-1.5 font-mono text-xs mb-3">
        <div className="text-[10px] text-zinc-500 uppercase">Applied Transformation Steps (M)</div>
        {steps.map((st, idx) => (
          <div key={idx} className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800 text-zinc-300 flex items-center space-x-2">
            <span className="text-emerald-400 font-bold">#{idx + 1}</span>
            <code className="text-[11px] overflow-hidden text-ellipsis whitespace-nowrap">{st}</code>
          </div>
        ))}
      </div>

      <div className="text-[10px] font-mono text-zinc-400 flex justify-between">
        <span>Refresh: Automated on workbook open</span>
        <span className="text-emerald-400 font-bold">Zero Manual Data Entry</span>
      </div>
    </div>
  );
};
