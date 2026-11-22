import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface UserPersonaProps {
  name?: string;
  role?: string;
  quote?: string;
  goals?: string[];
  frustrations?: string[];
  className?: string;
}

export const UserPersona: React.FC<UserPersonaProps> = ({
  name = 'ALEX R. — SOLO CREATOR',
  role = 'Full-Time YouTuber & Podcaster',
  quote = '"I spend 6 hours editing subtitles by hand when I should be recording new stories."',
  goals = ['Publish 3 viral shorts daily', 'Automate word-level kinetic captions', 'Grow channel subscriber base'],
  frustrations = ['Desktop timeline editing is painfully slow', 'Complex keyframing and font drift'],
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
      <div className="flex items-center gap-4 border-b border-zinc-800 pb-4 mb-6">
        <div className="w-14 h-14 rounded-full bg-sky-500/20 border-2 border-sky-400 flex items-center justify-center text-xl font-bold text-sky-400">
          👤
        </div>
        <div>
          <h3 className="text-base sm:text-xl font-serif font-black text-zinc-100 uppercase">
            {name}
          </h3>
          <span className="text-xs font-mono text-zinc-400">{role}</span>
        </div>
      </div>

      <blockquote className="text-xs sm:text-sm font-sans italic text-amber-400 bg-zinc-900/80 p-3.5 rounded-xl border border-zinc-800 mb-6">
        {quote}
      </blockquote>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <span className="text-emerald-400 font-bold uppercase text-[10px] block mb-2">
            PRIMARY GOALS
          </span>
          <ul className="space-y-1.5 text-zinc-300 font-sans">
            {goals.map((g, i) => (
              <li key={i}>✓ {g}</li>
            ))}
          </ul>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <span className="text-red-400 font-bold uppercase text-[10px] block mb-2">
            CORE FRUSTRATIONS
          </span>
          <ul className="space-y-1.5 text-zinc-300 font-sans">
            {frustrations.map((f, i) => (
              <li key={i}>✕ {f}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
