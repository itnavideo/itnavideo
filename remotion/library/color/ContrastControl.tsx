import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface ContrastControlProps {
  contrast?: number; // -100 to +100
  pivot?: number; // 0 to 1
  className?: string;
}

export const ContrastControl: React.FC<ContrastControlProps> = ({
  contrast = 28,
  pivot = 0.435,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-zinc-500/20 text-zinc-300 font-bold border border-zinc-500/30">
          CONTRAST & PIVOT S-CURVE
        </span>
        <span className="text-white/40">DYNAMIC RANGE</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-5 flex flex-col items-center justify-center">
        <div className="text-3xl font-extrabold mb-1">+{contrast}% CONTRAST</div>
        <div className="text-xs text-white/50 mb-3">Pivot Point: {pivot} (Middle Gray)</div>
        <div className="w-full flex justify-between text-[10px] text-white/40 border-t border-white/10 pt-2">
          <span>Deep Blacks Roll-off</span>
          <span>Clean Highlight Crest</span>
        </div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>S-CURVE EXPANSION</span>
        <span>GAMMA: 2.4</span>
      </div>
    </div>
  );
};
