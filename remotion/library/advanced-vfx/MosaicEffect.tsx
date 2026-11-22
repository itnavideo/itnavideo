import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface MosaicEffectProps {
  tiles?: number;
  className?: string;
}

export const MosaicEffect: React.FC<MosaicEffectProps> = ({
  tiles = 64,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-teal-500/20 text-teal-400 font-bold border border-teal-500/30">
          STAINED GLASS MOSAIC
        </span>
        <span className="text-white/40">CELLS: {tiles}</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-4 flex items-center justify-center">
        <div className="grid grid-cols-6 gap-1 w-48 h-32 border border-teal-500/40 p-1">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="bg-teal-700/40 border border-teal-500/30" />
          ))}
        </div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>GROUT LINE: 1.0px</span>
        <span>BEVEL HIGHLIGHT: ACTIVE</span>
      </div>
    </div>
  );
};
