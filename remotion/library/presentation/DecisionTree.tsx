import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface DecisionBranch {
  decision: string;
  probability: string;
  payoff: string;
  isRecommended?: boolean;
}

export interface DecisionTreeProps {
  rootQuestion?: string;
  branches?: DecisionBranch[];
  className?: string;
}

const DEFAULT_BRANCHES: DecisionBranch[] = [
  { decision: 'Local Heavy Chromium Render', probability: 'P = 0.20', payoff: 'OOM Crash (-$500)', isRecommended: false },
  { decision: 'AWS Lambda Headless Cluster', probability: 'P = 0.99', payoff: 'Under 2 min (+$4,200)', isRecommended: true },
  { decision: 'Client Side WebGL Render', probability: 'P = 0.60', payoff: 'Mobile lag (-$300)', isRecommended: false },
];

export const DecisionTree: React.FC<DecisionTreeProps> = ({
  rootQuestion = 'RENDER ARCHITECTURE SELECTION',
  branches = DEFAULT_BRANCHES,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entry = spring({
    frame,
    fps,
    config: { damping: 14, mass: 1, stiffness: 80 },
  });

  return (
    <div
      className={`relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl select-none overflow-hidden ${className}`}
      style={{ opacity: entry }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-6">
        <div>
          <div className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-bold">
            STRATEGIC DECISION TREE
          </div>
          <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            EXPECTED VALUE PAYOFF MATRIX
          </h3>
        </div>
      </div>

      {/* Tree Structure */}
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Root Decision Node (Square) */}
        <div className="w-44 bg-zinc-900 border-2 border-zinc-600 rounded-xl p-4 text-center shrink-0 shadow-xl">
          <div className="w-6 h-6 mx-auto mb-2 bg-sky-500 rounded flex items-center justify-center text-zinc-950 font-black text-xs">
            ■
          </div>
          <h4 className="text-xs font-serif font-bold text-zinc-100 uppercase">
            {rootQuestion}
          </h4>
        </div>

        {/* Branches */}
        <div className="flex-1 space-y-3 w-full">
          {branches.map((b, idx) => {
            const itemSpring = spring({
              frame: Math.max(0, frame - idx * 5),
              fps,
              config: { damping: 12, mass: 0.8, stiffness: 90 },
            });

            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                  b.isRecommended
                    ? 'bg-emerald-950/40 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                    : 'bg-zinc-900/60 border-zinc-800'
                }`}
                style={{
                  transform: `scale(${itemSpring})`,
                  opacity: itemSpring,
                }}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-500" />
                    <span className="text-xs font-serif font-bold text-zinc-200">
                      {b.decision}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400">{b.probability}</span>
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-amber-400">{b.payoff}</div>
                  {b.isRecommended && (
                    <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase">
                      ★ OPTIMAL PATH
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
