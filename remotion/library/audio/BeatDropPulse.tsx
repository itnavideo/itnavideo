import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface BeatDropPulseProps {
  bpm?: number;
  accentColor?: string;
  className?: string;
}

export const BeatDropPulse: React.FC<BeatDropPulseProps> = ({
  bpm = 128,
  accentColor = '#f43f5e',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const framesPerBeat = Math.round(1800 / bpm);
  const beatProgress = (frame % framesPerBeat) / framesPerBeat;
  const pulseScale = 1 + (1 - beatProgress) * 0.15;

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
          BEAT DROP & KICK DETECTOR
        </span>
        <span className="text-white/40">{bpm} BPM SYNC</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-4 flex flex-col items-center justify-center relative overflow-hidden">
        <div
          className="w-28 h-28 rounded-full border-4 border-rose-500 bg-rose-950/40 flex items-center justify-center shadow-2xl transition-transform"
          style={{
            transform: 'scale(' + pulseScale.toFixed(3) + ')',
            boxShadow: '0 0 ' + ((1 - beatProgress) * 40) + 'px ' + accentColor,
          }}
        >
          <span className="text-rose-400 font-black text-sm">808 BASS</span>
        </div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>SUB-BASS IMPACT: 45Hz</span>
        <span>PEAK TRANSIENT: TRIGGERED</span>
      </div>
    </div>
  );
};
