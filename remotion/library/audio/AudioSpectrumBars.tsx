import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface AudioSpectrumBarsProps {
  barCount?: number;
  barColor?: string;
  className?: string;
}

export const AudioSpectrumBars: React.FC<AudioSpectrumBarsProps> = ({
  barCount = 32,
  barColor = '#06b6d4',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-mono flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30">
          DUAL-SIDED SPECTRUM BARS
        </span>
        <span className="text-white/40">32-BAND SYMMETRIC</span>
      </div>

      <div className="flex-1 my-4 bg-black/60 rounded-xl border border-white/10 p-4 flex items-center justify-center space-x-1.5 h-44">
        {Array.from({ length: barCount }).map((_, i) => {
          const h = Math.abs(Math.sin((frame * 0.16) + (i * 0.35))) * 65 + 10;
          return (
            <div key={i} className="flex-1 max-w-[8px] flex flex-col justify-center items-center h-full">
              <div
                className="w-full rounded-full transition-all"
                style={{
                  height: h + '%',
                  backgroundColor: barColor,
                  boxShadow: '0 0 10px ' + barColor + '80',
                }}
              />
            </div>
          );
        })}
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>SYMMETRIC MIRROR</span>
        <span>PEAK AMPLITUDE: 94%</span>
      </div>
    </div>
  );
};
