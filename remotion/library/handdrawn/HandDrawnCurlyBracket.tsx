import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

export interface HandDrawnCurlyBracketProps {
  summaryLabel?: string;
  items?: string[];
  color?: string;
  className?: string;
}

export const HandDrawnCurlyBracket: React.FC<HandDrawnCurlyBracketProps> = ({
  summaryLabel = 'High-Retention Short Form Hooks',
  items = ['Pattern Interrupt in first 2s', 'Kinetic Karaoke Subtitles', 'Sound Effect on Word Drop'],
  color = '#a855f7',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const bracketProgress = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-purple-500/20 text-purple-400 font-bold border border-purple-500/30">
          HAND-DRAWN CURLY BRACE
        </span>
        <span className="text-white/40">SYNTHESIS GROUPING</span>
      </div>

      <div className="flex-1 my-4 flex items-center justify-center space-x-4">
        <div className="space-y-2 text-xs text-white/80">
          {items.map((it, i) => (
            <div key={i} className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              <span>{it}</span>
            </div>
          ))}
        </div>

        <svg width="40" height="120" viewBox="0 0 40 120">
          <path
            d="M 10,5 C 25,15 25,45 35,60 C 25,75 25,105 10,115"
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="140"
            strokeDashoffset={140 * (1 - bracketProgress)}
          />
        </svg>

        <div className="p-3 bg-purple-950/40 border border-purple-500/40 rounded-xl text-xs font-bold text-purple-300 max-w-[140px]">
          {summaryLabel}
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>BRACE ORIENTATION: VERTICAL RIGHT</span>
        <span>CONCEPT TAXONOMY</span>
      </div>
    </div>
  );
};
