import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface AudioFrequencyBandsProps {
  className?: string;
}

export const AudioFrequencyBands: React.FC<AudioFrequencyBandsProps> = ({
  className = '',
}) => {
  const frame = useCurrentFrame();
  const bands = [
    { label: 'SUB-BASS', range: '20-60Hz', color: '#ef4444' },
    { label: 'BASS', range: '60-250Hz', color: '#f59e0b' },
    { label: 'LOW-MID', range: '250-500Hz', color: '#eab308' },
    { label: 'MIDRANGE', range: '500-2kHz', color: '#10b981' },
    { label: 'PRESENCE', range: '2k-6kHz', color: '#06b6d4' },
    { label: 'BRILLIANCE', range: '6k-20kHz', color: '#8b5cf6' },
  ];

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-mono flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
          6-BAND FREQUENCY CROSSOVER
        </span>
        <span className="text-white/40">ISOLATION</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-4 grid grid-cols-6 gap-2">
        {bands.map((b, i) => {
          const h = Math.abs(Math.sin((frame * 0.12) + i * 0.8)) * 80 + 15;
          return (
            <div key={i} className="flex flex-col justify-end items-center h-full">
              <div
                className="w-full rounded-sm transition-all mb-2"
                style={{ height: h + '%', backgroundColor: b.color }}
              />
              <span className="text-[9px] font-bold truncate w-full text-center">{b.label}</span>
              <span className="text-[8px] text-white/40">{b.range}</span>
            </div>
          );
        })}
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>CROSSOVER FILTERS: LINKWITZ-RILEY</span>
        <span>SLOPE: 24dB/OCT</span>
      </div>
    </div>
  );
};
