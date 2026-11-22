import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface NestedIFStatementProps {
  score?: number;
  gradeResult?: string;
  branches?: { condition: string; outcome: string; matched: boolean }[];
  className?: string;
}

export const NestedIFStatement: React.FC<NestedIFStatementProps> = ({
  score = 88,
  gradeResult = "B+ (Honors)",
  branches = [
    { condition: "score >= 90", outcome: "'A' Distinction", matched: false },
    { condition: "score >= 80", outcome: "'B+' Honors", matched: true },
    { condition: "score >= 70", outcome: "'C' Pass", matched: false },
    { condition: "TRUE", outcome: "'F' Fail", matched: false },
  ],
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
            NESTED IF / IFS DECISION TREE
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
          Score: {score}
        </span>
      </div>

      <div className="space-y-2 font-mono text-xs mb-3">
        {branches.map((b, idx) => (
          <div
            key={idx}
            className={`p-2.5 rounded-xl border flex justify-between items-center ${
              b.matched
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 font-bold'
                : 'bg-zinc-900/60 border-zinc-800 text-zinc-500'
            }`}
          >
            <span>{b.condition}</span>
            <span>-&gt; {b.outcome} {b.matched && '✔'}</span>
          </div>
        ))}
      </div>

      <div className="text-[10px] font-mono text-zinc-400 flex justify-between">
        <span>Result: <span className="text-white font-bold">{gradeResult}</span></span>
        <span className="text-emerald-400 font-bold">Short-Circuit Evaluated</span>
      </div>
    </div>
  );
};
