import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface DataLineageFlowDiagramProps {
  stages?: { stage: string; table: string; rows: string }[];
  pipelineEngine?: string;
  className?: string;
}

export const DataLineageFlowDiagram: React.FC<DataLineageFlowDiagramProps> = ({
  stages = [
    { stage: "RAW INGEST", table: "raw.events_stream", rows: "14.2M rows" },
    { stage: "STAGING TRANSFORM", table: "stg.cleaned_events", rows: "14.1M rows" },
    { stage: "DATA MART", table: "analytics.daily_active_users", rows: "450K rows" },
  ],
  pipelineEngine = "dbt Core + DuckDB",
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
            DATA LINEAGE PIPELINE (DAG)
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
          {pipelineEngine}
        </span>
      </div>

      <div className="space-y-2 font-mono text-xs">
        {stages.map((s, idx) => (
          <div key={idx} className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex justify-between items-center">
            <div>
              <span className="text-[10px] text-sky-400 uppercase font-bold block">{s.stage}</span>
              <span className="text-white font-bold">{s.table}</span>
            </div>
            <span className="text-xs text-emerald-400 font-bold">{s.rows}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
