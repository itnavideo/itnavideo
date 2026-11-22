import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface MultiModelDatabaseCardProps {
  engineName?: string;
  supportedModels?: string[];
  unifiedQueryLanguage?: string;
  className?: string;
}

export const MultiModelDatabaseCard: React.FC<MultiModelDatabaseCardProps> = ({
  engineName = "ArangoDB / Azure Cosmos DB",
  supportedModels = ["Document (JSON)", "Graph (Edges)", "Key-Value", "Search"],
  unifiedQueryLanguage = "AQL (ArangoDB Query Language)",
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
            MULTI-MODEL POLYGLOT DATABASE
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-500/20 font-bold">
          4-IN-1 CORE
        </span>
      </div>

      <div className="flex justify-between items-baseline mb-4 font-mono">
        <div>
          <span className="text-2xl font-bold text-white">{engineName}</span>
        </div>
        <span className="text-xs text-sky-300 font-bold">{unifiedQueryLanguage}</span>
      </div>

      <div className="p-3 rounded-xl bg-black/60 border border-zinc-800 font-mono text-xs mb-3">
        <div className="text-[10px] text-zinc-500 uppercase mb-1">Integrated Model Paradigms</div>
        <div className="flex flex-wrap gap-1.5">
          {supportedModels.map((m, idx) => (
            <span key={idx} className="px-2.5 py-1 rounded bg-zinc-800 text-sky-300 border border-zinc-700 text-xs">
              {m}
            </span>
          ))}
        </div>
      </div>

      <div className="text-[10px] font-mono text-zinc-400 flex justify-between">
        <span>No multi-database sync glue code required</span>
        <span className="text-emerald-400 font-bold">Zero Network Churn</span>
      </div>
    </div>
  );
};
