import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

export interface TerminalAnimationProps {
  command?: string;
  outputLines?: string[];
  durationInFrames?: number;
  className?: string;
}

const DEFAULT_OUTPUT = [
  '[PASS] services/ai/reelPlanner.ts validated',
  '[PASS] Remotion 30fps root compositions audited',
  '[PASS] Zero Local Heavy Compute Policy enforced',
  '✔ ALL 11/11 PIPELINE CHECKS PASSED (exit code 0)',
];

export const TerminalAnimation: React.FC<TerminalAnimationProps> = ({
  command = 'node scripts/validate-all-video-types.mjs',
  outputLines = DEFAULT_OUTPUT,
  durationInFrames = 60,
  className = '',
}) => {
  const frame = useCurrentFrame();

  // Typewriter effect on prompt command
  const typedLength = Math.min(command.length, Math.floor(frame * 1.5));
  const typedCommand = command.slice(0, typedLength);
  const showOutput = frame > command.length * 0.7;

  return (
    <div
      className={`relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden select-none font-mono text-xs ${className}`}
    >
      {/* Top Window Bar */}
      <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
        </div>
        <span className="text-zinc-500 text-[10px] font-bold">bash — 80x24</span>
      </div>

      {/* Terminal Body */}
      <div className="p-5 space-y-2 text-zinc-300">
        <div className="flex items-center gap-2">
          <span className="text-emerald-400 font-bold">itnavideo@cloud-run:~$</span>
          <span>{typedCommand}</span>
          <span className="w-2 h-4 bg-emerald-400 inline-block animate-pulse" />
        </div>

        {showOutput && (
          <div className="space-y-1 text-zinc-400 pt-2 border-t border-zinc-800/80">
            {outputLines.map((line, idx) => (
              <div key={idx} className="truncate">
                {line}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
