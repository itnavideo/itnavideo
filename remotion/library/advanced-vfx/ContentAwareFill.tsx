import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface ContentAwareFillProps {
  fillProgress?: number;
  className?: string;
}

export const ContentAwareFill: React.FC<ContentAwareFillProps> = ({
  fillProgress = 100,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-teal-500/20 text-teal-400 font-bold border border-teal-500/30">
          CONTENT-AWARE FILL FOR VIDEO
        </span>
        <span className="text-white/40">TEMPORAL PATCH</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-5 flex flex-col items-center justify-center">
        <div className="text-2xl font-black text-teal-400 mb-2">SYNTHESIS COMPLETE</div>
        <div className="text-xs text-white/50">Pixel Flow Matching Across Reference Frames</div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>REFERENCE FRAMES: ±15</span>
        <span>FILL CONFIDENCE: {fillProgress}%</span>
      </div>
    </div>
  );
};
