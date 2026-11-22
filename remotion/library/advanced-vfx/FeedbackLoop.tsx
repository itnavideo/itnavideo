import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface FeedbackLoopProps {
  className?: string;
}

export const FeedbackLoop: React.FC<FeedbackLoopProps> = ({
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-fuchsia-500/20 text-fuchsia-400 font-bold border border-fuchsia-500/30">
          INFINITE VIDEO FEEDBACK
        </span>
        <span className="text-white/40">RECURSIVE DRIFT</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 relative p-4 flex items-center justify-center overflow-hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded border border-fuchsia-500/40"
            style={{
              width: (220 - i * 45) + "px",
              height: (140 - i * 30) + "px",
              transform: "rotate(" + (i * 6) + "deg)",
            }}
          />
        ))}
        <span className="text-xs text-fuchsia-300 font-bold z-10">RECURSIVE MIRROR</span>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>SCALE STEP: 104%</span>
        <span>ROTATIONAL SHIFT: 2.5°/f</span>
      </div>
    </div>
  );
};
