import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface BeatPulseProps {
  bpm?: number;
  className?: string;
}

export const BeatPulse: React.FC<BeatPulseProps> = ({
  bpm = 120,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const isPulse = (frame % 15) < 3;

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-mono flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-red-500/20 text-red-400 font-bold border border-red-500/30">
          RHYTHM BEAT PULSE
        </span>
        <span className="text-white/40">{bpm} BPM</span>
      </div>

      <div className={"flex-1 my-4 rounded-xl border-2 transition-all p-5 flex flex-col items-center justify-center " + (
        isPulse ? 'border-red-500 bg-red-950/40 shadow-2xl' : 'border-white/10 bg-zinc-900/60'
      )}>
        <div className="text-4xl font-black mb-1">{isPulse ? 'PULSE HIT!' : 'IDLE BEAT'}</div>
        <div className="text-xs text-white/50">Quarter Note Cadence Trigger</div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>TIME SIGNATURE: 4/4</span>
        <span>TRANSIENT ATTACK: 10ms</span>
      </div>
    </div>
  );
};
