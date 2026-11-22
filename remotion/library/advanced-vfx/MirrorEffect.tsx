import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface MirrorEffectProps {
  axis?: 'horizontal' | 'vertical';
  className?: string;
}

export const MirrorEffect: React.FC<MirrorEffectProps> = ({
  axis = 'vertical',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30">
          BILATERAL MIRROR EFFECT
        </span>
        <span className="text-white/40">AXIS: {axis.toUpperCase()}</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 relative p-4 flex">
        <div className="flex-1 h-full flex items-center justify-center bg-cyan-950/30 border-r border-cyan-400/80 text-xs font-bold text-cyan-300">
          ORIGINAL
        </div>
        <div className="flex-1 h-full flex items-center justify-center bg-cyan-950/30 text-xs font-bold text-cyan-300 -scale-x-100">
          MIRRORED
        </div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>SEAM SMOOTHING: 0px</span>
        <span>REFLECT ANGLE: 180°</span>
      </div>
    </div>
  );
};
