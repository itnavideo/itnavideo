import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface PixelationProps {
  pixelSize?: number; // 4 to 64
  className?: string;
}

export const Pixelation: React.FC<PixelationProps> = ({
  pixelSize = 16,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-yellow-500/20 text-yellow-400 font-bold border border-yellow-500/30">
          RETRO PIXELATION MOSAIC
        </span>
        <span className="text-white/40">BLOCK: {pixelSize}px</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-4 flex flex-col items-center justify-center">
        <div className="grid grid-cols-8 gap-1 mb-2">
          {Array.from({ length: 32 }).map((_, i) => (
            <div key={i} className="w-5 h-5 bg-amber-500/60 rounded-xs" />
          ))}
        </div>
        <div className="text-xs text-white/60">8-BIT CHUNK DOWNSCALE</div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>SAMPLING: NEAREST NEIGHBOR</span>
        <span>ASPECT: 1:1 SQUARE</span>
      </div>
    </div>
  );
};
