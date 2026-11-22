import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface LogicBranch {
  issue: string;
  subIssues: string[];
}

export interface LogicTreeProps {
  coreQuestion?: string;
  branches?: LogicBranch[];
  className?: string;
}

const DEFAULT_BRANCHES: LogicBranch[] = [
  { issue: 'INCREASE REVENUE', subIssues: ['Grow user subscriber base', 'Expand credit consumption', 'Introduce annual tiers'] },
  { issue: 'REDUCE COST', subIssues: ['Cloud Run concurrency tuning', 'Groq Whisper batching', 'S3 lifecycle expiration'] },
];

export const LogicTree: React.FC<LogicTreeProps> = ({
  coreQuestion = 'HOW TO MAXIMIZE ITNAVIDEO OPERATING PROFITABILITY?',
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
      className={`relative w-full max-w-5xl bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl select-none overflow-hidden ${className}`}
      style={{ opacity: entry }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-6">
        <div>
          <div className="text-[10px] font-mono tracking-widest text-sky-400 uppercase font-bold">
            MECE LOGIC TREE BREAKDOWN
          </div>
          <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            MCKINSEY ISSUE HIERARCHY
          </h3>
        </div>
      </div>

      {/* MECE Tree Grid */}
      <div className="space-y-4">
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-center">
          <span className="text-xs sm:text-sm font-serif font-black text-amber-400 uppercase">
            {coreQuestion}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {branches.map((b, idx) => {
            const itemSpring = spring({
              frame: Math.max(0, frame - idx * 6),
              fps,
              config: { damping: 12, mass: 0.8, stiffness: 90 },
            });

            return (
              <div
                key={idx}
                className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5"
                style={{
                  transform: `scale(${itemSpring})`,
                  opacity: itemSpring,
                }}
              >
                <h4 className="text-xs font-mono font-bold text-sky-400 uppercase tracking-widest border-b border-zinc-800 pb-2 mb-3">
                  {b.issue}
                </h4>
                <ul className="space-y-2">
                  {b.subIssues.map((sub, sIdx) => (
                    <li key={sIdx} className="flex items-center gap-2 text-xs font-sans text-zinc-300">
                      <span className="text-sky-500">↳</span>
                      <span>{sub}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
