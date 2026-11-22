import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface GitCommit {
  hash: string;
  message: string;
  branch: 'main' | 'feature';
  author: string;
}

export interface GitBranchGraphProps {
  title?: string;
  commits?: GitCommit[];
  className?: string;
}

const DEFAULT_COMMITS: GitCommit[] = [
  { hash: '6f15643', message: 'feat: add 6 e-commerce suite components', branch: 'main', author: 'rohi' },
  { hash: '79bbff1', message: 'feat: add 20 advanced motion graphics & VFX', branch: 'main', author: 'rohi' },
  { hash: '544fd2e', message: 'feat: add 20 cinematic documentary components', branch: 'feature', author: 'rohi' },
  { hash: 'b869d8d', message: 'feat: add 24 powerpoint & presentation graphics', branch: 'main', author: 'rohi' },
];

export const GitBranchGraph: React.FC<GitBranchGraphProps> = ({
  title = 'VERSION CONTROL COMMIT TIMELINE (GIT GRAPH)',
  commits = DEFAULT_COMMITS,
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
          <div className="text-[10px] font-mono tracking-widest text-sky-400 uppercase font-bold">
            GIT VERSION CONTROL
          </div>
          <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            {title}
          </h3>
        </div>
      </div>

      {/* Sequential Git Commit Nodes */}
      <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-zinc-800">
        {commits.map((c, idx) => {
          const itemSpring = spring({
            frame: Math.max(0, frame - idx * 5),
            fps,
            config: { damping: 12, mass: 0.8, stiffness: 90 },
          });

          const isMain = c.branch === 'main';

          return (
            <div
              key={c.hash}
              className="relative pl-8 flex items-center justify-between"
              style={{
                transform: `scale(${itemSpring})`,
                opacity: itemSpring,
              }}
            >
              {/* Commit Circle Node */}
              <div
                className={`absolute left-1.5 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-zinc-950 ${
                  isMain ? 'bg-sky-400 shadow-[0_0_8px_#38bdf8]' : 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                }`}
              />

              <div className="flex items-center gap-3">
                <span className="font-mono text-xs bg-zinc-800 text-amber-400 px-2 py-0.5 rounded font-bold">
                  {c.hash}
                </span>
                <span className="text-xs sm:text-sm font-sans font-semibold text-zinc-200">
                  {c.message}
                </span>
              </div>

              <span className="text-[10px] font-mono text-zinc-500 uppercase">
                {c.branch} • {c.author}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
