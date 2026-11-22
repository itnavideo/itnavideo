import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface CRTDisplayProps {
  className?: string;
}

export const CRTDisplay: React.FC<CRTDisplayProps> = ({
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono overflow-hidden " + className}>
      <div className="flex justify-between items-center text-xs z-10">
        <span className="px-2.5 py-1 rounded bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">
          CRT CATHODE TUBE SIMULATION
        </span>
        <span className="text-white/40">APERTURE GRILLE</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 rounded-xl border border-white/10 p-5 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="text-3xl font-black text-white drop-shadow">SONY TRINITRON</div>
        <div className="text-xs text-white/50 mt-1">Phosphor Scanlines & Barrel Distortion</div>
      </div>

      <div className="text-xs text-white/40 flex justify-between z-10">
        <span>CURVATURE: 12%</span>
        <span>LINE COUNT: 480i</span>
      </div>
    </div>
  );
};
