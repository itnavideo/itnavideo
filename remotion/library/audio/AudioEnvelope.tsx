import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface AudioEnvelopeProps {
  className?: string;
}

export const AudioEnvelope: React.FC<AudioEnvelopeProps> = ({
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-mono flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-yellow-500/20 text-yellow-400 font-bold border border-yellow-500/30">
          ADSR ENVELOPE CURVE
        </span>
        <span className="text-white/40">DYNAMICS</span>
      </div>

      <div className="flex-1 my-4 bg-black/60 rounded-xl border border-white/10 p-4 relative flex items-center justify-center">
        <svg className="w-full h-32" viewBox="0 0 100 50">
          <polyline points="0,50 20,5 40,25 80,25 100,50" fill="none" stroke="#eab308" strokeWidth="2.5" />
          <line x1={(frame % 100)} y1="0" x2={(frame % 100)} y2="50" stroke="#fff" strokeWidth="1" strokeDasharray="2 2" />
        </svg>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>ATTACK: 20ms • DECAY: 40ms</span>
        <span>SUSTAIN: 70% • RELEASE: 150ms</span>
      </div>
    </div>
  );
};
