import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

export interface HandDrawnUnderlineProps {
  color?: string;
  strokeWidth?: number;
  className?: string;
}

export const HandDrawnUnderline: React.FC<HandDrawnUnderlineProps> = ({
  color = '#f59e0b',
  strokeWidth = 5,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
          HAND-DRAWN UNDERLINE
        </span>
        <span className="text-white/40">ORGANIC EMPHASIS</span>
      </div>

      <div className="flex-1 my-4 flex flex-col items-center justify-center space-y-4">
        <span className="text-3xl font-black tracking-wide text-white">REVENUE TRIPLED</span>
        <svg className="w-72 h-8 overflow-visible" viewBox="0 0 200 20">
          <path
            d="M 5,14 Q 50,6 100,15 T 195,10"
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray="200"
            strokeDashoffset={200 * (1 - progress)}
          />
        </svg>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>STROKE TYPE: FELT MARKER</span>
        <span>VELOCITY: VARIABLE TAPER</span>
      </div>
    </div>
  );
};
