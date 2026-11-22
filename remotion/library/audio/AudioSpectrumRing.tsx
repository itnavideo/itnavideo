import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface AudioSpectrumRingProps {
  spikeCount?: number;
  accentColor?: string;
  className?: string;
}

export const AudioSpectrumRing: React.FC<AudioSpectrumRingProps> = ({
  spikeCount = 48,
  accentColor = '#f43f5e',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-mono flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
          POLAR SPECTRUM RING
        </span>
        <span className="text-white/40">360° RADIAL</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-4 flex items-center justify-center relative overflow-hidden">
        <div className="w-44 h-44 rounded-full border border-rose-500/30 relative flex items-center justify-center">
          {Array.from({ length: spikeCount }).map((_, i) => {
            const angle = i * (360 / spikeCount);
            const len = Math.abs(Math.sin((frame * 0.14) + (i * 0.4))) * 22 + 6;
            return (
              <div
                key={i}
                className="absolute w-0.5 rounded-full bg-rose-400"
                style={{
                  height: len + 'px',
                  transform: 'rotate(' + angle + 'deg) translateY(-80px)',
                  transformOrigin: 'bottom center',
                }}
              />
            );
          })}
          <div className="w-14 h-14 rounded-full bg-rose-950 border border-rose-400/80 flex items-center justify-center text-xs font-bold text-rose-300">
            SOUND
          </div>
        </div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>RESOLUTION: {spikeCount} SPIKES</span>
        <span>POLAR FFT</span>
      </div>
    </div>
  );
};
