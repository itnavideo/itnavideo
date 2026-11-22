import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface HabitLoopProps {
  cue?: string;
  craving?: string;
  response?: string;
  reward?: string;
  className?: string;
}

export const HabitLoop: React.FC<HabitLoopProps> = ({
  cue = '1. CUE: Raw voiceover recording or script written',
  craving = '2. CRAVING: Wanting viral social shorts without hours of manual video editing',
  response = '3. RESPONSE: Upload to Itnavideo studio with automated kinetic captions',
  reward = '4. REWARD: Published 1080p reel gaining views and engagement',
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
            NEUROLOGICAL HABIT LOOP
          </div>
          <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            CUE ➔ CRAVING ➔ RESPONSE ➔ REWARD
          </h3>
        </div>
      </div>

      {/* 4 Quadrants Habit Progression */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-zinc-900 border-l-4 border-l-sky-400 border-y border-r border-zinc-800 rounded-r-xl p-4">
          <span className="text-[10px] font-mono font-bold text-sky-400 uppercase">STAGE 1</span>
          <p className="text-xs font-sans text-zinc-200 mt-1 font-semibold">{cue}</p>
        </div>
        <div className="bg-zinc-900 border-l-4 border-l-amber-400 border-y border-r border-zinc-800 rounded-r-xl p-4">
          <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">STAGE 2</span>
          <p className="text-xs font-sans text-zinc-200 mt-1 font-semibold">{craving}</p>
        </div>
        <div className="bg-zinc-900 border-l-4 border-l-emerald-400 border-y border-r border-zinc-800 rounded-r-xl p-4">
          <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">STAGE 3</span>
          <p className="text-xs font-sans text-zinc-200 mt-1 font-semibold">{response}</p>
        </div>
        <div className="bg-zinc-900 border-l-4 border-l-pink-400 border-y border-r border-zinc-800 rounded-r-xl p-4">
          <span className="text-[10px] font-mono font-bold text-pink-400 uppercase">STAGE 4</span>
          <p className="text-xs font-sans text-zinc-200 mt-1 font-semibold">{reward}</p>
        </div>
      </div>
    </div>
  );
};
