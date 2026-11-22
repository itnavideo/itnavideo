import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface GlitchDisplacementProps {
  slices?: number;
  className?: string;
}

export const GlitchDisplacement: React.FC<GlitchDisplacementProps> = ({
  slices = 5,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
          GLITCH MAP DISPLACEMENT
        </span>
        <span className="text-white/40">DATAMOSH SLICES</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-4 flex flex-col justify-center space-y-2">
        {Array.from({ length: slices }).map((_, i) => (
          <div
            key={i}
            className="h-4 bg-rose-500/40 rounded-xs border-l-4 border-rose-400"
            style={{ transform: "translateX(" + (Math.sin((frame + i * 4) * 0.8) * 16) + "px)" }}
          />
        ))}
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>TEARING AXIS: HORIZONTAL</span>
        <span>BUFFER CORRUPTION: 12%</span>
      </div>
    </div>
  );
};
