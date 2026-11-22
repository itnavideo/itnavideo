import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface LUTFilterProps {
  lutName?: string;
  strength?: number;
  format?: '3DL' | 'CUBE' | 'VLT';
  className?: string;
}

export const LUTFilter: React.FC<LUTFilterProps> = ({
  lutName = 'Kodak_Vision3_5219_D65.cube',
  strength = 100,
  format = 'CUBE',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
          3D LUT PROCESSOR
        </span>
        <span className="text-white/40">{format} 33x33x33</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/90 rounded-xl border border-white/10 p-5 flex flex-col items-center justify-center">
        <div className="w-16 h-16 mb-3 rounded-lg border border-amber-500/40 bg-gradient-to-tr from-cyan-500 via-amber-500 to-rose-500 opacity-80 shadow-lg" />
        <div className="text-sm font-bold text-white mb-1">{lutName}</div>
        <div className="text-xs text-amber-300">Interpolation: Tetrahedral • Strength: {strength}%</div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>INPUT: ACEScg</span>
        <span>OUTPUT: sRGB/Rec.709</span>
      </div>
    </div>
  );
};
