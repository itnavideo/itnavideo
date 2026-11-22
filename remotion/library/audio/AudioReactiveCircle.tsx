import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface AudioReactiveCircleProps {
  circleColor?: string;
  className?: string;
}

export const AudioReactiveCircle: React.FC<AudioReactiveCircleProps> = ({
  circleColor = '#06b6d4',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const radius = 40 + Math.sin(frame * 0.2) * 15;

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30">
          AUDIO-REACTIVE EXPANDING DISC
        </span>
        <span className="text-white/40">CADENCE SYNC</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-4 flex items-center justify-center relative overflow-hidden">
        <div
          className="rounded-full border-2 border-cyan-400 bg-cyan-950/40 shadow-xl transition-all"
          style={{
            width: (radius * 2) + 'px',
            height: (radius * 2) + 'px',
            boxShadow: '0 0 25px ' + circleColor + '60',
          }}
        />
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>PULSE FREQ: 140 BPM</span>
        <span>DECAY FACTOR: 0.85</span>
      </div>
    </div>
  );
};
