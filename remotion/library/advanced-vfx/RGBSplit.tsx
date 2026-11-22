import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface RGBSplitProps {
  offset?: number;
  className?: string;
}

export const RGBSplit: React.FC<RGBSplitProps> = ({
  offset = 8,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-red-500/20 text-red-400 font-bold border border-red-500/30">
          CHROMATIC RGB SPLIT
        </span>
        <span className="text-white/40">OFFSET: {offset}px</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-4 relative flex items-center justify-center">
        <div className="text-4xl font-black text-red-500 absolute -translate-x-2 mix-blend-screen">GLITCH</div>
        <div className="text-4xl font-black text-green-500 absolute mix-blend-screen">GLITCH</div>
        <div className="text-4xl font-black text-blue-500 absolute translate-x-2 mix-blend-screen">GLITCH</div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>DISPERSION: HORIZONTAL</span>
        <span>BLEND: ADDITIVE SCREEN</span>
      </div>
    </div>
  );
};
