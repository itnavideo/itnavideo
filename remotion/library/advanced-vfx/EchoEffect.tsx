import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface EchoEffectProps {
  numEchoes?: number;
  className?: string;
}

export const EchoEffect: React.FC<EchoEffectProps> = ({
  numEchoes = 4,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-400 font-bold border border-indigo-500/30">
          TEMPORAL VIDEO ECHO
        </span>
        <span className="text-white/40">STACK: {numEchoes} COPIES</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-5 flex flex-col items-center justify-center">
        <div className="text-3xl font-black text-indigo-400 mb-1">ECHO STACK ACCUMULATOR</div>
        <div className="text-xs text-white/50">Delayed Motion Instances Blended</div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>ECHO TIME: -0.15s</span>
        <span>OPERATOR: MAXIMUM/SCREEN</span>
      </div>
    </div>
  );
};
