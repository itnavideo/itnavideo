import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface CircularWaveformProps {
  spokeCount?: number;
  ringColor?: string;
  className?: string;
}

export const CircularWaveform: React.FC<CircularWaveformProps> = ({
  spokeCount = 36,
  ringColor = '#38bdf8',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-sky-500/20 text-sky-400 font-bold border border-sky-500/30">
          RADIAL CIRCULAR WAVEFORM
        </span>
        <span className="text-white/40">360° SOUND RING</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-4 flex items-center justify-center relative overflow-hidden">
        <div className="w-48 h-48 rounded-full border border-sky-500/30 relative flex items-center justify-center">
          {Array.from({ length: spokeCount }).map((_, i) => {
            const angle = (i * (360 / spokeCount));
            const len = Math.abs(Math.sin((frame * 0.12) + (i * 0.5))) * 24 + 8;
            return (
              <div
                key={i}
                className="absolute w-1 rounded-full bg-sky-400"
                style={{
                  height: len + 'px',
                  transform: 'rotate(' + angle + 'deg) translateY(-85px)',
                  transformOrigin: 'bottom center',
                }}
              />
            );
          })}
          <div className="w-16 h-16 rounded-full bg-sky-950 border border-sky-400/80 flex items-center justify-center text-xs font-bold text-sky-300">
            ♫ BASS
          </div>
        </div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>POLAR MAPPING: ACTIVE</span>
        <span>RADIAL RESOLUTION: {spokeCount} SPOKES</span>
      </div>
    </div>
  );
};
