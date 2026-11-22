import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface WideColumnStoreCardProps {
  engineName?: string;
  partitionKey?: string;
  clusteringColumn?: string;
  replicationFactor?: number;
  consistencyLevel?: string;
  className?: string;
}

export const WideColumnStoreCard: React.FC<WideColumnStoreCardProps> = ({
  engineName = "Apache Cassandra / ScyllaDB",
  partitionKey = "user_id (Murmur3Partitioner)",
  clusteringColumn = "created_at DESC",
  replicationFactor = 3,
  consistencyLevel = "LOCAL_QUORUM",
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-purple-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-purple-400" />
          <span className="text-xs uppercase tracking-wider text-purple-400 font-bold">
            WIDE-COLUMN STORE (COLUMN FAMILY)
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
          Peer-to-Peer Ring
        </span>
      </div>

      <div className="flex justify-between items-baseline mb-4 font-mono">
        <div>
          <span className="text-2xl font-bold text-white">{engineName}</span>
        </div>
        <span className="text-xs text-purple-300 font-bold">Linear Write Scalability</span>
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-xs mb-3">
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Partition Key</div>
          <div className="text-white font-bold text-xs mt-1">{partitionKey}</div>
          <div className="text-[10px] text-zinc-500">Determines node placement</div>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Clustering Order</div>
          <div className="text-purple-300 font-bold text-xs mt-1">{clusteringColumn}</div>
          <div className="text-[10px] text-zinc-500">Sort order on disk</div>
        </div>
      </div>

      <div className="text-[10px] font-mono text-zinc-400 flex justify-between">
        <span>RF: {replicationFactor} | Consistency: {consistencyLevel}</span>
        <span className="text-emerald-400 font-bold">Tunable AP/CP</span>
      </div>
    </div>
  );
};
