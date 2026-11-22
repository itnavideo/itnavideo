import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface SpectrumAnalyzerProps {
  octaves?: string[];
  className?: string;
}

export const SpectrumAnalyzer: React.FC<SpectrumAnalyzerProps> = ({
  octaves = ['60Hz', '170Hz', '310Hz', '600Hz', '1kHz', '3kHz', '6kHz', '12kHz', '16kHz'],
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
          OCTAVE SPECTRUM ANALYZER
        </span>
        <span className="text-white/40">1/3 OCTAVE RESOLUTION</span>
      </div>

      <div className="flex-1 my-4 bg-black/60 rounded-xl border border-white/10 p-4 flex flex-col justify-end">
        <div className="flex items-end justify-between h-36 space-x-2">
          {octaves.map((hz, i) => {
            const h = Math.abs(Math.sin((frame * 0.1) + i * 0.7)) * 75 + 15;
            return (
              <div key={i} className="flex-1 flex flex-col items-center h-full justify-end">
                <div
                  className="w-full bg-gradient-to-t from-emerald-500 via-amber-500 to-rose-500 rounded-xs"
                  style={{ height: h + '%' }}
                />
                <span className="text-[9px] text-white/40 mt-2 truncate w-full text-center">{hz}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>DYNAMIC RANGE: 60 dB</span>
        <span>FFT SIZE: 2048</span>
      </div>
    </div>
  );
};
