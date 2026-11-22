import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface DiffLine {
  lineNum: number;
  type: 'add' | 'remove' | 'context';
  code: string;
}

export interface CodeDiffProps {
  filename?: string;
  additions?: number;
  deletions?: number;
  lines?: DiffLine[];
  className?: string;
}

const DEFAULT_LINES: DiffLine[] = [
  { lineNum: 24, type: 'context', code: '  // Zero Local Heavy Compute Policy' },
  { lineNum: 25, type: 'remove', code: '- npx remotion render --concurrency=4' },
  { lineNum: 26, type: 'add', code: '+ dispatchLambdaRenderJob({ fps: 30, region: "us-east-1" })' },
  { lineNum: 27, type: 'context', code: '  return { renderJobId, status: "DISPATCHED" };' },
];

export const CodeDiff: React.FC<CodeDiffProps> = ({
  filename = 'services/remotion/lambdaDispatcher.ts',
  additions = 1,
  deletions = 1,
  lines = DEFAULT_LINES,
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
      className={`relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl select-none overflow-hidden ${className}`}
      style={{ opacity: entry }}
    >
      {/* File Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-zinc-500 font-mono text-xs">📄</span>
          <span className="text-xs sm:text-sm font-mono font-bold text-zinc-200">
            {filename}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono font-bold">
          <span className="text-emerald-400">+{additions}</span>
          <span className="text-red-400">-{deletions}</span>
        </div>
      </div>

      {/* Diff Code Viewer */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden font-mono text-xs">
        {lines.map((l, idx) => {
          const isAdd = l.type === 'add';
          const isRem = l.type === 'remove';

          const bgColor = isAdd
            ? 'bg-emerald-950/40 text-emerald-300'
            : isRem
            ? 'bg-red-950/40 text-red-300'
            : 'text-zinc-400';

          return (
            <div
              key={idx}
              className={`flex items-center px-4 py-1 border-b border-zinc-800/40 ${bgColor}`}
            >
              <span className="w-8 text-[10px] text-zinc-600 select-none">{l.lineNum}</span>
              <span className="w-4 select-none font-bold">
                {isAdd ? '+' : isRem ? '-' : ' '}
              </span>
              <pre className="font-mono text-xs truncate">{l.code}</pre>
            </div>
          );
        })}
      </div>
    </div>
  );
};
