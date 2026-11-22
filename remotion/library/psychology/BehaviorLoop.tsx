import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface BehaviorLoopProps {
  title?: string;
  formula?: string; // B = MAP
  motivationText?: string;
  abilityText?: string;
  promptText?: string;
  className?: string;
}

export const BehaviorLoop: React.FC<BehaviorLoopProps> = ({
  title = 'BJ FOGG BEHAVIOR DESIGN MODEL',
  formula = 'BEHAVIOR = MOTIVATION × ABILITY × PROMPT (B = MAP)',
  motivationText = 'HIGH MOTIVATION (Desire to create studio-quality video)',
  abilityText = 'HIGH ABILITY (Zero-learning curve, automated rendering)',
  promptText = 'TIMELY PROMPT (One-click "Generate Video" CTA button)',
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
            BEHAVIOR ARCHITECTURE
          </div>
          <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            {title}
          </h3>
        </div>
      </div>

      <div className="bg-zinc-900 border border-emerald-500/60 rounded-xl p-3 text-center mb-6 shadow">
        <span className="text-xs font-mono font-bold text-emerald-400">{formula}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-4 border-t-2 border-t-sky-400">
          <span className="text-[10px] text-zinc-500 uppercase font-bold">M — MOTIVATION</span>
          <p className="text-zinc-200 font-sans mt-2 leading-relaxed">{motivationText}</p>
        </div>
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-4 border-t-2 border-t-emerald-400">
          <span className="text-[10px] text-zinc-500 uppercase font-bold">A — ABILITY</span>
          <p className="text-zinc-200 font-sans mt-2 leading-relaxed">{abilityText}</p>
        </div>
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-4 border-t-2 border-t-amber-400">
          <span className="text-[10px] text-zinc-500 uppercase font-bold">P — PROMPT</span>
          <p className="text-zinc-200 font-sans mt-2 leading-relaxed">{promptText}</p>
        </div>
      </div>
    </div>
  );
};
