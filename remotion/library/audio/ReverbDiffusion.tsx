import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface ReverbDiffusionProps {
  decayTimeSeconds?: number;
  roomSize?: string;
  className?: string;
}

export const ReverbDiffusion: React.FC<ReverbDiffusionProps> = ({
  decayTimeSeconds = 2.4,
  roomSize = 'Concert Hall',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
          ACOUSTIC REVERB DIFFUSION
        </span>
        <span className="text-white/40">{roomSize}</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-5 flex flex-col items-center justify-center">
        <div className="text-3xl font-black text-emerald-400 mb-1">{decayTimeSeconds}s RT60</div>
        <div className="text-xs text-white/50">Convolution Impulse Decay</div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>PRE-DELAY: 25ms</span>
        <span>DAMPING: HIGH-FREQ 4kHz</span>
      </div>
    </div>
  );
};
