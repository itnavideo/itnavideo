import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface HandDrawnArrowProps {
  arrowColor?: string;
  className?: string;
}

export const HandDrawnArrow: React.FC<HandDrawnArrowProps> = ({
  arrowColor = '#f59e0b',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-mono flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
          HAND-DRAWN POINTER ARROW
        </span>
        <span className="text-white/40">SKETCH STYLE</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-4 flex items-center justify-center">
        <svg className="w-56 h-32" viewBox="0 0 160 80">
          <path
            d="M 20,60 Q 70,75 120,35"
            fill="none"
            stroke={arrowColor}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <polyline
            points="105,25 125,35 115,55"
            fill="none"
            stroke={arrowColor}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>ORGANIC CURVATURE: BEZIER</span>
        <span>HEAD: DUAL-WING</span>
      </div>
    </div>
  );
};
