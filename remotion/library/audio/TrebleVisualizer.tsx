import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface TrebleVisualizerProps {
  className?: string;
}

export const TrebleVisualizer: React.FC<TrebleVisualizerProps> = ({
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-mono flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-sky-500/20 text-sky-400 font-bold border border-sky-500/30">
          TREBLE & AIR VISUALIZER
        </span>
        <span className="text-white/40">10kHz - 20kHz</span>
      </div>

      <div className="flex-1 my-4 bg-black/60 rounded-xl border border-white/10 p-5 flex flex-col items-center justify-center">
        <div className="text-3xl font-black text-sky-300 mb-2">SPARKLE & AIR</div>
        <div className="flex space-x-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="text-sky-400 animate-pulse">✦</span>
          ))}
        </div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>CYMBAL TRANSIENTS</span>
        <span>HIGH-SHELF DETECTOR</span>
      </div>
    </div>
  );
};
