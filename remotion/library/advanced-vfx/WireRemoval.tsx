import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface WireRemovalProps {
  label?: string;
  className?: string;
}

export const WireRemoval: React.FC<WireRemovalProps> = ({
  label = 'STUNT RIG WIRE ERASED',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-red-500/20 text-red-400 font-bold border border-red-500/30">
          CLEAN PLATE WIRE REMOVAL
        </span>
        <span className="text-white/40">INPAINTING MASK</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-5 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="w-full h-1 border-t-2 border-dashed border-red-500/50 mb-3" />
        <div className="text-sm font-bold text-white mb-1">{label}</div>
        <div className="text-xs text-white/50">Stunt Cable Seamlessly Blended</div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>STROKE WIDTH: 6px</span>
        <span>TEMPORAL CONSISTENCY: 99.8%</span>
      </div>
    </div>
  );
};
