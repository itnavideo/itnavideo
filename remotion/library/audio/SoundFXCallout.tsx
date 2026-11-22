import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface SoundFXCalloutProps {
  text?: string;
  badgeColor?: string;
  className?: string;
}

export const SoundFXCallout: React.FC<SoundFXCalloutProps> = ({
  text = 'WHOOSH!',
  badgeColor = '#f59e0b',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
          COMIC SOUND EFFECT BADGE
        </span>
        <span className="text-white/40">FOLEY HIT CUE</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-5 flex items-center justify-center relative overflow-hidden">
        <div className="px-6 py-3 rounded-2xl bg-amber-500 text-black font-black text-4xl -rotate-6 shadow-2xl border-4 border-white tracking-widest uppercase">
          {text}
        </div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>AUDIO ASSET: foley_whoosh_03.wav</span>
        <span>LATENCY: 0ms IMPACT</span>
      </div>
    </div>
  );
};
