import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface GraphDatabaseCardProps {
  engineName?: string;
  queryLanguage?: string;
  nodeLabelsCount?: number;
  relationshipTypesCount?: number;
  indexFreeAdjacency?: boolean;
  className?: string;
}

export const GraphDatabaseCard: React.FC<GraphDatabaseCardProps> = ({
  engineName = "Neo4j Enterprise / Amazon Neptune",
  queryLanguage = "openCypher / Gremlin",
  nodeLabelsCount = 14,
  relationshipTypesCount = 28,
  indexFreeAdjacency = true,
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
            PROPERTY GRAPH DATABASE
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/20 font-bold">
          INDEX-FREE ADJACENCY
        </span>
      </div>

      <div className="flex justify-between items-baseline mb-4 font-mono">
        <div>
          <span className="text-2xl font-bold text-white">{engineName}</span>
        </div>
        <span className="text-xs text-indigo-300 font-bold font-mono">{queryLanguage}</span>
      </div>

      <div className="p-3 rounded-xl bg-black/60 border border-zinc-800 font-mono text-xs mb-3">
        <div className="text-[10px] text-zinc-500 uppercase mb-0.5">Sample Graph Pattern</div>
        <code className="text-indigo-300">(:Person)-[:WORKS_AT]-&gt;(:Company)&lt;-[:INVESTED_IN]-(:Fund)</code>
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-xs">
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Entity Labels</div>
          <div className="text-white font-bold text-sm mt-0.5">{nodeLabelsCount} Node Types</div>
        </div>
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Edge Relationships</div>
          <div className="text-emerald-400 font-bold text-sm mt-0.5">{relationshipTypesCount} Edge Types</div>
        </div>
      </div>
    </div>
  );
};
