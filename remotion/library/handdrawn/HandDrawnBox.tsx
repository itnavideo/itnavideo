import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

export interface HandDrawnBoxProps {
  color?: string;
  label?: string;
  className?: string;
}

export const HandDrawnBox: React.FC<HandDrawnBoxProps> = ({
  color = '#ef4444',
  label = 'KEY TAKEAWAY',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-red-500/20 text-red-400 font-bold border border-red-500/30">
          HAND-DRAWN FRAMING BOX
        </span>
        <span className="text-white/40">OVERLAPPING CORNERS</span>
      </div>

      <div className="flex-1 my-4 relative flex items-center justify-center p-6">
        <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 300 150">
          <path
            d="M 20,25 C 90,20 220,26 285,22 C 288,50 282,100 285,130 C 220,135 90,128 15,132 C 18,95 24,55 20,25 Z"
            fill="none"
            stroke={color}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="800"
            strokeDashoffset={800 * (1 - progress)}
          />
        </svg>
        <div className="text-center z-10">
          <div className="text-xs font-mono font-bold text-red-400 mb-1">{label}</div>
          <div className="text-base font-bold text-white max-w-xs">Focus 80% of energy on the 20% that moves the needle.</div>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>CONTOUR: WOBBLY PEN OVERLAY</span>
        <span>CORNER EXTENSION: ACTIVE</span>
      </div>
    </div>
  );
};
