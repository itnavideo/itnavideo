import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface CommandStep {
  cmd: string;
  duration: string;
  status: 'SUCCESS' | 'RUNNING' | 'WAITING';
}

export interface CommandLineSequenceProps {
  title?: string;
  steps?: CommandStep[];
  className?: string;
}

const DEFAULT_STEPS: CommandStep[] = [
  { cmd: 'git pull origin main --rebase', duration: '0.8s', status: 'SUCCESS' },
  { cmd: 'npm run test:video-pipelines', duration: '1.4s', status: 'SUCCESS' },
  { cmd: 'gcloud run deploy itnavideo-web --region=us-central1', duration: '48.2s', status: 'SUCCESS' },
];

export const CommandLineSequence: React.FC<CommandLineSequenceProps> = ({
  title = 'CONTINUOUS INTEGRATION (CI/CD) EXECUTION SEQUENCE',
  steps = DEFAULT_STEPS,
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
            AUTOMATED DEPLOYMENT
          </div>
          <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            {title}
          </h3>
        </div>
      </div>

      {/* Commands List */}
      <div className="space-y-3 font-mono text-xs">
        {steps.map((s, idx) => {
          const itemSpring = spring({
            frame: Math.max(0, frame - idx * 6),
            fps,
            config: { damping: 12, mass: 0.8, stiffness: 90 },
          });

          return (
            <div
              key={idx}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3"
              style={{
                transform: `scale(${itemSpring})`,
                opacity: itemSpring,
              }}
            >
              <div className="flex items-center gap-2 w-full sm:w-auto truncate">
                <span className="text-emerald-400 font-bold">$</span>
                <span className="text-zinc-200 truncate">{s.cmd}</span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-zinc-500 text-[10px]">{s.duration}</span>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9px] font-bold px-2 py-0.5 rounded">
                  ✓ {s.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
