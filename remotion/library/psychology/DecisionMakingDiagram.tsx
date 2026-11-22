import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface DecisionMakingDiagramProps {
  title?: string;
  system1Title?: string;
  system1Desc?: string;
  system2Title?: string;
  system2Desc?: string;
  className?: string;
}

export const DecisionMakingDiagram: React.FC<DecisionMakingDiagramProps> = ({
  title = 'DUAL PROCESS COGNITIVE DECISION THEORY (KAHNEMAN)',
  system1Title = 'SYSTEM 1: FAST & INTUITIVE',
  system1Desc = 'Automatic, unconscious, rapid heuristics, low effort, prone to emotional bias & cognitive shortcuts.',
  system2Title = 'SYSTEM 2: SLOW & DELIBERATIVE',
  system2Desc = 'Conscious, logical reasoning, heavy cognitive effort, analytical calculation, error-correcting.',
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
          <div className="text-[10px] font-mono tracking-widest text-amber-500 uppercase font-bold">
            BEHAVIORAL ECONOMICS
          </div>
          <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            {title}
          </h3>
        </div>
      </div>

      {/* Dual Split Systems */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col justify-between shadow-lg border-l-4 border-l-amber-500">
          <div>
            <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">
              95% OF DAILY CHOICES
            </span>
            <h4 className="text-sm sm:text-base font-serif font-black text-zinc-100 uppercase mt-1 mb-2">
              {system1Title}
            </h4>
            <p className="text-xs font-sans text-zinc-300 leading-relaxed italic">
              "{system1Desc}"
            </p>
          </div>
          <div className="mt-4 pt-2 border-t border-zinc-800 text-[10px] font-mono text-zinc-500">
            SPEED: 0.1s • ENERGY: MINIMAL
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col justify-between shadow-lg border-l-4 border-l-sky-500">
          <div>
            <span className="text-[10px] font-mono font-bold text-sky-400 uppercase tracking-widest">
              5% OF CRITICAL EVALUATION
            </span>
            <h4 className="text-sm sm:text-base font-serif font-black text-zinc-100 uppercase mt-1 mb-2">
              {system2Title}
            </h4>
            <p className="text-xs font-sans text-zinc-300 leading-relaxed italic">
              "{system2Desc}"
            </p>
          </div>
          <div className="mt-4 pt-2 border-t border-zinc-800 text-[10px] font-mono text-zinc-500">
            SPEED: SLOW • ENERGY: HIGH
          </div>
        </div>
      </div>
    </div>
  );
};
