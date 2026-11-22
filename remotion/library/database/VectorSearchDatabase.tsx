import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface VectorSearchDatabaseProps {
  dimensions?: number;
  metric?: string;
  algorithm?: string;
  className?: string;
}

export const VectorSearchDatabase: React.FC<VectorSearchDatabaseProps> = ({
  dimensions = 1536,
  metric = 'Cosine Similarity',
  algorithm = 'HNSW (Hierarchical Navigable Small World)',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-violet-500/20 text-violet-400 font-bold border border-violet-500/30">
          VECTOR DATABASE INDEX
        </span>
        <span className="text-violet-400 font-bold">AI EMBEDDINGS</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-5 flex flex-col justify-between font-mono">
        <div>
          <div className="text-sm font-bold text-white">pgvector Semantic Search Index</div>
          <div className="text-xs text-violet-300 mt-0.5">{dimensions} Floating-Point Dimensions</div>
        </div>

        <div className="grid grid-cols-2 gap-3 my-2">
          <div className="p-3 bg-zinc-950 rounded border border-white/10 text-center">
            <div className="text-[10px] text-white/40 font-bold">INDEX ALGORITHM</div>
            <div className="text-xs font-bold text-white mt-1">{algorithm}</div>
          </div>
          <div className="p-3 bg-zinc-950 rounded border border-white/10 text-center">
            <div className="text-[10px] text-white/40 font-bold">DISTANCE METRIC</div>
            <div className="text-xs font-bold text-violet-400 mt-1">{metric}</div>
          </div>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>TOP-K RETRIEVAL: 1.8ms</span>
        <span>RAG PIPELINE ACCELERATOR</span>
      </div>
    </div>
  );
};
