import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface VectorDatabaseCardProps {
  engineName?: string;
  dimensions?: number;
  distanceMetric?: string;
  indexAlgorithm?: string;
  searchLatencyMs?: number;
  className?: string;
}

export const VectorDatabaseCard: React.FC<VectorDatabaseCardProps> = ({
  engineName = "Pinecone / Qdrant / pgvector",
  dimensions = 1536,
  distanceMetric = "Cosine Similarity",
  indexAlgorithm = "HNSW (Hierarchical Navigable Small World)",
  searchLatencyMs = 4.8,
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
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse" />
          <span className="text-xs uppercase tracking-wider text-indigo-400 font-bold">
            VECTOR EMBEDDING DATABASE
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/20 font-bold">
          AI / RAG NATIVE
        </span>
      </div>

      <div className="flex justify-between items-baseline mb-4 font-mono">
        <div>
          <span className="text-2xl font-bold text-white">{engineName}</span>
        </div>
        <div className="text-right">
          <span className="text-2xl font-extrabold text-emerald-400">{searchLatencyMs} ms</span>
          <span className="text-[10px] text-zinc-400 block">k-NN Search Latency</span>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-black/60 border border-zinc-800 font-mono text-xs mb-3">
        <div className="text-[10px] text-zinc-500 uppercase mb-0.5">Vector Index Architecture</div>
        <div className="text-indigo-300 font-bold">{indexAlgorithm}</div>
        <div className="text-[10px] text-zinc-400 mt-1">
          {dimensions}-dimensional embeddings | Metric: {distanceMetric}
        </div>
      </div>

      <div className="text-[10px] font-mono text-zinc-400 flex justify-between">
        <span>Use Cases: Semantic Search, LLM Memory, Recommendation</span>
        <span className="text-emerald-400 font-bold">Zero-Copy Indexing</span>
      </div>
    </div>
  );
};
