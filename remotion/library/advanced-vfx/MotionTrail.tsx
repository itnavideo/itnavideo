import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface MotionTrailProps {
  trailColor?: string;
  className?: string;
}

export const MotionTrail: React.FC<MotionTrailProps> = ({
  trailColor = '#38bdf8',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-sky-500/20 text-sky-400 font-bold border border-sky-500/30">
          KINETIC MOTION TRAILS
        </span>
        <span className="text-white/40">FRAME ECHO DECAY</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 relative p-4 flex items-center justify-center space-x-3">
        <div className="w-12 h-12 rounded-full bg-sky-400/20 blur-sm" />
        <div className="w-12 h-12 rounded-full bg-sky-400/40 blur-xs" />
        <div className="w-12 h-12 rounded-full bg-sky-400/70" />
        <div className="w-12 h-12 rounded-full bg-white shadow-xl" />
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>TRAIL LENGTH: 8 FRAMES</span>
        <span>FALLOFF: EXPONENTIAL</span>
      </div>
    </div>
  );
};
