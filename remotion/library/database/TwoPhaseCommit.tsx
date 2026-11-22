import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface TwoPhaseCommitProps {
  coordinator?: string;
  participants?: string[];
  status?: string;
  className?: string;
}

export const TwoPhaseCommit: React.FC<TwoPhaseCommitProps> = ({
  coordinator = 'Distributed Tx Coordinator',
  participants = ['Auth DB Node', 'Billing DB Node', 'Render Jobs DB'],
  status = 'PHASE 2: GLOBAL COMMIT',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-400 font-bold border border-indigo-500/30">
          TWO-PHASE COMMIT (2PC)
        </span>
        <span className="text-emerald-400 font-bold">{status}</span>
      </div>

      <div className="flex-1 my-4 flex flex-col items-center justify-center space-y-3 font-mono">
        <div className="px-5 py-2 bg-indigo-950 border border-indigo-500/50 rounded-lg text-center">
          <div className="text-xs font-bold text-indigo-300">⚙ {coordinator}</div>
          <div className="text-[9px] text-white/40">PREPARE / COMMIT ORCHESTRATOR</div>
        </div>

        <div className="w-0.5 h-3 bg-white/20" />

        <div className="grid grid-cols-3 gap-2 w-full">
          {participants.map((p, i) => (
            <div key={i} className="p-2.5 bg-zinc-900 border border-emerald-500/40 rounded-lg text-center">
              <div className="text-[10px] font-bold text-white truncate">{p}</div>
              <div className="text-[10px] text-emerald-400 mt-1 font-bold">✓ VOTE: COMMIT</div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>DISTRIBUTED ACID ASSURANCE</span>
        <span>TRANSACTION ID: TX-840291</span>
      </div>
    </div>
  );
};
