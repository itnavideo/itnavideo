import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

export interface HandDrawnExclamationProps {
  color?: string;
  size?: number;
  className?: string;
}

export const HandDrawnExclamation: React.FC<HandDrawnExclamationProps> = ({
  color = '#f59e0b',
  size = 120,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const stroke = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: 'clamp' });
  const dot = interpolate(frame, [18, 26], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
          HAND-DRAWN EXCLAMATION
        </span>
        <span className="text-amber-400 font-bold">URGENCY / IMPACT</span>
      </div>

      <div className="flex-1 my-4 flex items-center justify-center">
        <svg width={size} height={size} viewBox="0 0 100 100">
          <path
            d="M 50,15 L 50,65"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="60"
            strokeDashoffset={60 * (1 - stroke)}
          />
          <circle cx="50" cy="84" r={5.5 * dot} fill={color} />
          {/* Accent dashes */}
          <line x1="25" y1="25" x2="18" y2="20" stroke={color} strokeWidth="3" strokeLinecap="round" />
          <line x1="75" y1="25" x2="82" y2="20" stroke={color} strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>DYNAMIC IMPACT ACCENTS</span>
        <span>SOUND FX SYNC COMPATIBLE</span>
      </div>
    </div>
  );
};
