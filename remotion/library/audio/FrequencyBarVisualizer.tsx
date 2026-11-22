import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface FrequencyBarVisualizerProps {
  ladderSteps?: number;
  className?: string;
}

export const FrequencyBarVisualizer: React.FC<FrequencyBarVisualizerProps> = ({
  ladderSteps = 12,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const activeLevel = Math.round((Math.sin(frame * 0.15) * 0.5 + 0.5) * ladderSteps);

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-yellow-500/20 text-yellow-400 font-bold border border-yellow-500/30">
          STEPPED LED dB LEVEL METER
        </span>
        <span className="text-white/40">CLIP LIMITER: 0 dB</span>
      </div>

      <div className="flex-1 my-4 bg-black/70 rounded-xl border border-white/10 p-5 flex items-center justify-center space-x-6">
        {['CH L', 'CH R'].map((ch, idx) => (
          <div key={idx} className="flex flex-col items-center space-y-1">
            <span className="text-[10px] text-white/50 mb-1">{ch}</span>
            <div className="flex flex-col-reverse space-y-reverse space-y-1">
              {Array.from({ length: ladderSteps }).map((_, step) => {
                const isLit = step <= (activeLevel + (idx === 1 ? -1 : 0));
                const color = step >= 10 ? '#ef4444' : step >= 7 ? '#eab308' : '#10b981';
                return (
                  <div
                    key={step}
                    className="w-12 h-2 rounded-xs"
                    style={{
                      backgroundColor: isLit ? color : '#27272a',
                      boxShadow: isLit ? ('0 0 6px ' + color + '60') : 'none',
                    }}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>NOMINAL: -14 LUFS</span>
        <span>TRUE PEAK: -0.1 dBTP</span>
      </div>
    </div>
  );
};
