import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface KaleidoscopeProps {
  segments?: number;
  className?: string;
}

export const Kaleidoscope: React.FC<KaleidoscopeProps> = ({
  segments = 8,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const rotation = frame * 1.5;

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-purple-500/20 text-purple-400 font-bold border border-purple-500/30">
          RADIAL KALEIDOSCOPE
        </span>
        <span className="text-white/40">{segments}-WAY SYMMETRY</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-4 relative flex items-center justify-center overflow-hidden">
        <div
          className="w-40 h-40 rounded-full border-4 border-dashed border-purple-400 flex items-center justify-center"
          style={{ transform: "rotate(" + rotation + "deg)" }}
        >
          <div className="w-20 h-20 bg-purple-950/60 border border-purple-400/80 rotate-45" />
        </div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>PRISM ROTATION: {rotation.toFixed(0)}°</span>
        <span>MIRROR SECTORS: {segments}</span>
      </div>
    </div>
  );
};
