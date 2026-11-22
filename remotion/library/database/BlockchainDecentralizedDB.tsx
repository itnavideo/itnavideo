import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface BlockchainDecentralizedDBProps {
  consensusAlgorithm?: string;
  peerNodesCount?: number;
  smartContractEngine?: string;
  immutableLedger?: boolean;
  className?: string;
}

export const BlockchainDecentralizedDB: React.FC<BlockchainDecentralizedDBProps> = ({
  consensusAlgorithm = "Byzantine Fault Tolerant (PBFT / Tendermint)",
  peerNodesCount = 16,
  smartContractEngine = "WebAssembly (WASM) / EVM",
  immutableLedger = true,
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
            DECENTRALIZED BLOCKCHAIN LEDGER
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/20 font-bold">
          BFT CONSENSUS
        </span>
      </div>

      <div className="space-y-2 font-mono text-xs mb-3">
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex justify-between">
          <span className="text-zinc-400">Consensus:</span>
          <span className="text-indigo-300 font-bold text-xs">{consensusAlgorithm}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex justify-between">
          <span className="text-zinc-400">Validator Nodes:</span>
          <span className="text-white font-bold">{peerNodesCount} Global Peers</span>
        </div>
      </div>

      <div className="text-[10px] font-mono text-zinc-400 flex justify-between">
        <span>Contracts: {smartContractEngine}</span>
        <span className="text-emerald-400 font-bold">Zero Central Authority</span>
      </div>
    </div>
  );
};
