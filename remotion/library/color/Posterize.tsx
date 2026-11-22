import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface PosterizeProps {
  levels?: number; // 2 to 16 color quantization levels
  className?: string;
}

export const Posterize: React.FC<PosterizeProps> = ({
  levels = 6,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-violet-500/20 text-violet-400 font-bold border border-violet-500/30">
          POSTERIZE QUANTIZATION
        </span>
        <span className="text-white/40">COLOR BIT DEPTH</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-5 flex flex-col items-center justify-center">
        <div className="text-4xl font-black text-violet-400 mb-1">{levels} COLOR BANDS</div>
        <div className="text-xs text-white/50 mb-3">Retro Quantized Palette</div>
        <div className="flex space-x-1 w-48 h-4 rounded overflow-hidden">
          {Array.from({ length: levels }).map((_, i) => (
            <div key={i} className="flex-1" style={{ backgroundColor: 'hsl(' + (i * (360 / levels)) + ', 70%, 50%)' }} />
          ))}
        </div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>DITHER: FLOYD-STEINBERG</span>
        <span>BIT DEPTH: {Math.ceil(Math.log2(levels))} BITS</span>
      </div>
    </div>
  );
};
