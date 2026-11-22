import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface PointerTrailProps {
  className?: string;
}

export const PointerTrail: React.FC<PointerTrailProps> = ({
  className = '',
}) => {
  const frame = useCurrentFrame();
  const px = Math.sin(frame * 0.1) * 60;
  const py = Math.cos(frame * 0.08) * 30;

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-mono flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
          MOUSE POINTER TRAIL
        </span>
        <span className="text-white/40">BEZIER CURSOR</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 relative p-4 flex items-center justify-center overflow-hidden">
        <div
          className="w-5 h-5 rounded-full border-2 border-rose-400 bg-rose-500/40 absolute flex items-center justify-center shadow-lg"
          style={{ transform: "translate(" + px + "px, " + py + "px)" }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-white" />
        </div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>SMOOTHING: EXPONENTIAL</span>
        <span>CLICK ANIM: WAVE</span>
      </div>
    </div>
  );
};
