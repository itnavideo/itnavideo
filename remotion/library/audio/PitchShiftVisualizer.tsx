import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface PitchShiftVisualizerProps {
  noteTarget?: string;
  centsDeviation?: number;
  className?: string;
}

export const PitchShiftVisualizer: React.FC<PitchShiftVisualizerProps> = ({
  noteTarget = 'A4 (440 Hz)',
  centsDeviation = 4,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-violet-500/20 text-violet-400 font-bold border border-violet-500/30">
          VOCAL PITCH TUNER & AUTOTUNE
        </span>
        <span className="text-white/40">{noteTarget}</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-5 flex flex-col items-center justify-center">
        <div className="text-4xl font-black text-violet-400 mb-1">+{centsDeviation} CENTS</div>
        <div className="text-xs text-white/50">Pitch Drift Correction Active</div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>RETUNE SPEED: 20ms</span>
        <span>SCALE: CHROMATIC</span>
      </div>
    </div>
  );
};
