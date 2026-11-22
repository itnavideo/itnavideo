import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface RaftConsensusClusterProps {
  term?: number;
  leader?: string;
  nodes?: string[];
  className?: string;
}

export const RaftConsensusCluster: React.FC<RaftConsensusClusterProps> = ({
  term = 42,
  leader = 'Node-01 (Leader)',
  nodes = ['Node-02 (Follower)', 'Node-03 (Follower)'],
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
          RAFT CONSENSUS CLUSTER
        </span>
        <span className="text-white/40">TERM: {term}</span>
      </div>

      <div className="flex-1 my-4 grid grid-cols-3 gap-3 items-center font-mono">
        <div className="p-3 bg-amber-950/60 border-2 border-amber-500 rounded-xl text-center shadow-lg">
          <div className="text-xs font-black text-amber-300">★ {leader}</div>
          <div className="text-[9px] text-amber-400 mt-1">HEARTBEAT BROADCASTER</div>
        </div>
        {nodes.map((n, i) => (
          <div key={i} className="p-3 bg-zinc-900 border border-white/10 rounded-xl text-center">
            <div className="text-xs font-bold text-white">{n}</div>
            <div className="text-[9px] text-emerald-400 mt-1">LOG MATCHED (QUORUM)</div>
          </div>
        ))}
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>QUORUM: 2 OF 3 NODES AGREED</span>
        <span>LEADER ELECTION: STABLE</span>
      </div>
    </div>
  );
};
