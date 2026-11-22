import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface NarrativePerspective {
  speaker: string;
  source: string;
  statement: string;
  tag: string; // e.g. "OFFICIAL RECORD" or "WITNESS ACCOUNT"
  tagColor?: string;
}

export interface SplitNarrativeProps {
  title?: string;
  leftPerspective?: NarrativePerspective;
  rightPerspective?: NarrativePerspective;
  className?: string;
}

const DEFAULT_LEFT: NarrativePerspective = {
  speaker: 'OFFICIAL INQUIRY FINDINGS',
  source: 'Congressional Record • Vol. 118',
  statement: '"Radar contacts at 02:14 were determined to be atmospheric thermal inversion ducts."',
  tag: 'OFFICIAL REPORT',
  tagColor: '#3b82f6',
};

const DEFAULT_RIGHT: NarrativePerspective = {
  speaker: 'LT. COL. ROBERT HAYES',
  source: 'Lead Intercept Pilot (Sworn Testimony)',
  statement: '"We maintained visual acquisition for twelve minutes. Those flight surfaces were solid."',
  tag: 'EYEWITNESS CONTRADICTION',
  tagColor: '#ef4444',
};

export const SplitNarrative: React.FC<SplitNarrativeProps> = ({
  title = 'CONTRADICTORY ACCOUNTS OF THE 02:14 ENGAGEMENT',
  leftPerspective = DEFAULT_LEFT,
  rightPerspective = DEFAULT_RIGHT,
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
      className={`relative w-full max-w-5xl bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl select-none ${className}`}
      style={{ opacity: entry }}
    >
      {/* Top Dual Narrative Headline */}
      <div className="text-center border-b border-zinc-800 pb-4 mb-6">
        <div className="text-[10px] font-mono tracking-widest uppercase text-amber-500 font-bold mb-1">
          CROSS-EXAMINATION PERSPECTIVES
        </div>
        <h3 className="text-lg sm:text-2xl font-serif font-black tracking-wide text-zinc-100 uppercase">
          {title}
        </h3>
      </div>

      {/* Dual Split Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        {/* VS / Duel Center Badge */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700 items-center justify-center text-xs font-mono font-black text-amber-500 z-20 shadow-xl">
          VS
        </div>

        {/* Left Side Account */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <span
              className="text-[10px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded-full inline-block mb-3"
              style={{
                backgroundColor: `${leftPerspective.tagColor || '#3b82f6'}20`,
                color: leftPerspective.tagColor || '#3b82f6',
              }}
            >
              {leftPerspective.tag}
            </span>
            <h4 className="text-base font-serif font-bold text-zinc-100 uppercase mb-2">
              {leftPerspective.speaker}
            </h4>
            <blockquote className="text-xs sm:text-sm font-sans text-zinc-300 italic leading-relaxed border-l-2 border-zinc-700 pl-3 py-1">
              {leftPerspective.statement}
            </blockquote>
          </div>
          <div className="text-[10px] font-mono text-zinc-500 mt-4 border-t border-zinc-800/80 pt-2">
            {leftPerspective.source}
          </div>
        </div>

        {/* Right Side Account */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <span
              className="text-[10px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded-full inline-block mb-3"
              style={{
                backgroundColor: `${rightPerspective.tagColor || '#ef4444'}20`,
                color: rightPerspective.tagColor || '#ef4444',
              }}
            >
              {rightPerspective.tag}
            </span>
            <h4 className="text-base font-serif font-bold text-zinc-100 uppercase mb-2">
              {rightPerspective.speaker}
            </h4>
            <blockquote className="text-xs sm:text-sm font-sans text-zinc-300 italic leading-relaxed border-l-2 border-zinc-700 pl-3 py-1">
              {rightPerspective.statement}
            </blockquote>
          </div>
          <div className="text-[10px] font-mono text-zinc-500 mt-4 border-t border-zinc-800/80 pt-2">
            {rightPerspective.source}
          </div>
        </div>
      </div>
    </div>
  );
};
