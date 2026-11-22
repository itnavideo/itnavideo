import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

export interface HandDrawnQuestionMarkProps {
  color?: string;
  size?: number;
  className?: string;
}

export const HandDrawnQuestionMark: React.FC<HandDrawnQuestionMarkProps> = ({
  color = '#38bdf8',
  size = 120,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const curve = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  const dot = interpolate(frame, [20, 28], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-sky-500/20 text-sky-400 font-bold border border-sky-500/30">
          HAND-DRAWN QUESTION MARK
        </span>
        <span className="text-sky-400 font-bold">HOOK / CURIOSITY</span>
      </div>

      <div className="flex-1 my-4 flex items-center justify-center">
        <svg width={size} height={size} viewBox="0 0 100 100">
          <path
            d="M 30,35 C 28,15 68,12 68,35 C 68,52 50,55 50,70"
            fill="none"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray="110"
            strokeDashoffset={110 * (1 - curve)}
          />
          <circle cx="50" cy="86" r={5 * dot} fill={color} />
        </svg>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>HOOK RETENTION MECHANIC</span>
        <span>OPEN LOOP CURIOSITY</span>
      </div>
    </div>
  );
};
