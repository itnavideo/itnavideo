import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface DatabaseShardingClusterProps {
  shardingKey?: string;
  shardsCount?: number;
  className?: string;
}

export const DatabaseShardingCluster: React.FC<DatabaseShardingClusterProps> = ({
  shardingKey = 'user_id (Consistent Hashing)',
  shardsCount = 4,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-purple-500/20 text-purple-400 font-bold border border-purple-500/30">
          DATABASE SHARDING CLUSTER
        </span>
        <span className="text-white/40">{shardsCount} PHYSICAL SHARDS</span>
      </div>

      <div className="flex-1 my-4 flex flex-col items-center justify-center space-y-3 font-mono">
        <div className="px-4 py-2 bg-purple-950 border border-purple-500/50 rounded-xl text-center">
          <div className="text-xs font-bold text-purple-300">SHARD ROUTER PROXY</div>
          <div className="text-[10px] text-white/50">HASH KEY: {shardingKey}</div>
        </div>

        <div className="w-0.5 h-3 bg-white/20" />

        <div className="grid grid-cols-4 gap-2 w-full">
          {[...Array(shardsCount)].map((_, i) => (
            <div key={i} className="p-2 bg-zinc-900 border border-white/10 rounded text-center">
              <div className="text-[10px] font-bold text-purple-400">SHARD {i + 1}</div>
              <div className="text-[9px] text-white/40 mt-0.5">Hash 0x{i}0..</div>
              <div className="text-[10px] text-emerald-400 mt-1">2.4 TB</div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>HORIZONTAL SCALE: 100K+ QPS</span>
        <span>RE-SHARDING: ZERO DOWNTIME</span>
      </div>
    </div>
  );
};
