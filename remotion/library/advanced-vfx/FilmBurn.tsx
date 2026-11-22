import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface FilmBurnProps {
  burnIntensity?: number;
  className?: string;
}

export const FilmBurn: React.FC<FilmBurnProps> = ({
  burnIntensity = 90,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono overflow-hidden " + className}>
      <div className="flex justify-between items-center text-xs z-10">
        <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
          ORGANIC FILM LEADER BURN
        </span>
        <span className="text-white/40">16MM EMULSION</span>
      </div>

      <div className="flex-1 my-4 rounded-xl border border-white/10 p-5 flex flex-col items-center justify-center bg-gradient-to-tr from-amber-600 via-rose-600 to-yellow-400 relative overflow-hidden">
        <div className="text-3xl font-black text-black drop-shadow-lg">EMULSION SCORCH</div>
        <div className="text-xs text-black/80 font-bold mt-1">Overexposed Head & Tail Flare</div>
      </div>

      <div className="text-xs text-white/40 flex justify-between z-10">
        <span>FLASH SPREAD: {burnIntensity}%</span>
        <span>PERFORATION FLICKER: ACTIVE</span>
      </div>
    </div>
  );
};
