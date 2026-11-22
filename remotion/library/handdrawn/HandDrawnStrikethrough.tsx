import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

export interface HandDrawnStrikethroughProps {
  wrongText?: string;
  correctText?: string;
  color?: string;
  className?: string;
}

export const HandDrawnStrikethrough: React.FC<HandDrawnStrikethroughProps> = ({
  wrongText = 'Manual Desktop Editing (6 Hours)',
  correctText = 'Itnavideo Cloud Engine (45 Seconds)',
  color = '#ef4444',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const strikeProgress = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-red-500/20 text-red-400 font-bold border border-red-500/30">
          SCRIBBLE STRIKETHROUGH
        </span>
        <span className="text-white/40">BEFORE / AFTER EDIT</span>
      </div>

      <div className="flex-1 my-4 flex flex-col items-center justify-center space-y-4">
        <div className="relative inline-block">
          <span className="text-lg font-bold text-zinc-500 font-mono line-through decoration-transparent">
            {wrongText}
          </span>
          <svg className="absolute -inset-x-2 top-1/2 -translate-y-1/2 w-[calc(100%+16px)] h-8 overflow-visible" viewBox="0 0 200 20">
            <path
              d="M 5,10 Q 50,4 95,14 Q 140,6 195,12"
              fill="none"
              stroke={color}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="200"
              strokeDashoffset={200 * (1 - strikeProgress)}
            />
          </svg>
        </div>
        <div className="text-xl font-black text-emerald-400 font-mono animate-bounce">
          → {correctText}
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>STROKE TYPE: RED INK SCRIBBLE</span>
        <span>ERROR CORRECTION VISUAL</span>
      </div>
    </div>
  );
};
