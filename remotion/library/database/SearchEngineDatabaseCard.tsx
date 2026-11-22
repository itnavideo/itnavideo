import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface SearchEngineDatabaseCardProps {
  engineName?: string;
  scoringAlgorithm?: string;
  shardsCount?: number;
  replicasCount?: number;
  className?: string;
}

export const SearchEngineDatabaseCard: React.FC<SearchEngineDatabaseCardProps> = ({
  engineName = "Elasticsearch 8 / OpenSearch 2.14",
  scoringAlgorithm = "Okapi BM25 + Lucene Core",
  shardsCount = 10,
  replicasCount = 2,
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-amber-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
            SEARCH & ANALYTICS ENGINE
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
          Inverted Index
        </span>
      </div>

      <div className="flex justify-between items-baseline mb-4 font-mono">
        <div>
          <span className="text-2xl font-bold text-white">{engineName}</span>
        </div>
        <span className="text-xs text-amber-400 font-bold">{scoringAlgorithm}</span>
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-xs mb-3">
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Primary Shards</div>
          <div className="text-white font-bold text-base mt-1">{shardsCount} Shards</div>
          <div className="text-[10px] text-zinc-500">Horizontal partition</div>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Replica Shards</div>
          <div className="text-emerald-400 font-bold text-base mt-1">{replicasCount} Replicas / Shard</div>
          <div className="text-[10px] text-zinc-500">High search throughput</div>
        </div>
      </div>

      <div className="text-[10px] font-mono text-zinc-400 flex justify-between">
        <span>Full-text Tokenizers, N-grams, Fuzzy Match, Aggregations</span>
      </div>
    </div>
  );
};
