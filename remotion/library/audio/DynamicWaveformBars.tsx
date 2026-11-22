import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface DynamicWaveformBarsProps {
  barCount?: number;
  barColor?: string;
  peakColor?: string;
  className?: string;
}

export const DynamicWaveformBars: React.FC<DynamicWaveformBarsProps> = ({
  barCount = 24,
  barColor = '#10b981',
  peakColor = '#34d399',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
          DYNAMIC AUDIO EQUALIZER
        </span>
        <span className="text-white/40">24-BAND REALTIME</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-4 flex items-end justify-center space-x-1.5 h-44">
        {Array.from({ length: barCount }).map((_, i) => {
          const height = Math.abs(Math.sin((frame * 0.15) + (i * 0.4))) * 80 + 15;
          return (
            <div key={i} className="flex-1 max-w-[12px] flex flex-col justify-end items-center h-full">
              <div
                className="w-full rounded-xs transition-all"
                style={{
                  height: height + '%',
                  backgroundColor: barColor,
                  boxShadow: '0 0 8px ' + barColor + '40',
                }}
              />
            </div>
          );
        })}
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>FREQ: 20Hz - 20kHz</span>
        <span>PEAK HOLD: 0.2s DECAY</span>
      </div>
    </div>
  );
};
