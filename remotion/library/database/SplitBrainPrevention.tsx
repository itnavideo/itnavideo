import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface SplitBrainPreventionProps {
  quorumNodesTotal?: number;
  quorumNodesActive?: number;
  fencedNode?: string;
  consensusProtocol?: string;
  className?: string;
}

export const SplitBrainPrevention: React.FC<SplitBrainPreventionProps> = ({
  quorumNodesTotal = 3,
  quorumNodesActive = 2,
  fencedNode = "db-node-03 (STONITH Fenced)",
  consensusProtocol = "Raft Consensus / Corosync",
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-red-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <span className="text-xs uppercase tracking-wider text-red-400 font-bold">
            SPLIT-BRAIN FENCING (STONITH)
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/20 font-bold">
          QUORUM HEALTHY
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-xs mb-3">
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Quorum Consensus</div>
          <div className="text-emerald-400 font-bold text-base mt-1">{quorumNodesActive} / {quorumNodesTotal} Nodes</div>
          <div className="text-[10px] text-zinc-500">Majority maintained</div>
        </div>

        <div className="p-3 rounded-xl bg-red-950/20 border border-red-500/30">
          <div className="text-[10px] text-red-400 uppercase">Isolated / Fenced Node</div>
          <div className="text-red-400 font-bold text-xs mt-1">{fencedNode}</div>
          <div className="text-[10px] text-zinc-500">Power cut to prevent corruption</div>
        </div>
      </div>

      <div className="text-[10px] font-mono text-zinc-400 flex justify-between">
        <span>Protocol: {consensusProtocol}</span>
        <span className="text-emerald-400 font-bold">Single-Writer Guaranteed</span>
      </div>
    </div>
  );
};
