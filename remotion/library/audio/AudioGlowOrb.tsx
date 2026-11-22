import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface AudioGlowOrbProps {
  orbColor?: string;
  className?: string;
}

export const AudioGlowOrb: React.FC<AudioGlowOrbProps> = ({
  orbColor = '#8b5cf6',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const pulse = 1 + Math.sin(frame * 0.18) * 0.2;

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-purple-500/20 text-purple-400 font-bold border border-purple-500/30">
          BIOLUMINESCENT AUDIO ORB
        </span>
        <span className="text-white/40">AMPLITUDE DRIVEN</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-4 flex items-center justify-center relative overflow-hidden">
        <div
          className="w-32 h-32 rounded-full border border-purple-400/40 bg-gradient-to-tr from-purple-600 to-indigo-400 shadow-2xl flex items-center justify-center"
          style={{
            transform: 'scale(' + pulse.toFixed(3) + ')',
            boxShadow: '0 0 ' + (pulse * 35) + 'px ' + orbColor,
          }}
        >
          <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm" />
        </div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>ENERGY FLOW: DYNAMIC</span>
        <span>HARMONIC COHERENCE: 98%</span>
      </div>
    </div>
  );
};
