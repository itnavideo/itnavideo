import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface HandDrawnCircleProps {
  targetText?: string;
  circleColor?: string;
  className?: string;
}

export const HandDrawnCircle: React.FC<HandDrawnCircleProps> = ({
  targetText = '$1.2M MRR',
  circleColor = '#ef4444',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-mono flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-red-500/20 text-red-400 font-bold border border-red-500/30">
          HAND-DRAWN HIGHLIGHT CIRCLE
        </span>
        <span className="text-white/40">ORGANIC LOOP</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-4 flex items-center justify-center relative">
        <div className="relative flex items-center justify-center">
          <span className="text-3xl font-black text-white px-6 py-2">{targetText}</span>
          <svg className="w-56 h-24 absolute pointer-events-none" viewBox="0 0 200 80">
            <ellipse
              cx="100"
              cy="40"
              rx="85"
              ry="30"
              fill="none"
              stroke={circleColor}
              strokeWidth="3"
              strokeLinecap="round"
              transform="rotate(-2 100 40)"
            />
          </svg>
        </div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>ROUGHNESS: 1.8</span>
        <span>DOUBLE-STROKE: ENABLED</span>
      </div>
    </div>
  );
};
