import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface StereoPannerProps {
  className?: string;
}

export const StereoPanner: React.FC<StereoPannerProps> = ({
  className = '',
}) => {
  const frame = useCurrentFrame();
  const panPos = Math.sin(frame * 0.08) * 80;

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-teal-500/20 text-teal-400 font-bold border border-teal-500/30">
          STEREO SOUNDFIELD RADAR
        </span>
        <span className="text-white/40">PAN: {panPos > 0 ? ('R ' + panPos.toFixed(0) + '%') : ('L ' + Math.abs(panPos).toFixed(0) + '%')}</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-5 flex flex-col items-center justify-center relative">
        <div className="w-56 h-2 bg-zinc-700 rounded-full relative flex items-center">
          <div
            className="w-6 h-6 rounded-full bg-teal-400 shadow-lg absolute -ml-3 transition-transform"
            style={{ left: (50 + (panPos / 2)) + '%' }}
          />
        </div>
        <div className="flex justify-between w-56 text-[10px] text-white/50 mt-3">
          <span>100% LEFT</span>
          <span>CENTER</span>
          <span>100% RIGHT</span>
        </div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>CORRELATION: +0.92</span>
        <span>STEREO WIDTH: 120%</span>
      </div>
    </div>
  );
};
