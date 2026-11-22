import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface FrequencyAnalyzerProps {
  className?: string;
}

export const FrequencyAnalyzer: React.FC<FrequencyAnalyzerProps> = ({
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-mono flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-400 font-bold border border-indigo-500/30">
          REAL-TIME FFT ANALYZER (RTA)
        </span>
        <span className="text-white/40">2048 SAMPLES</span>
      </div>

      <div className="flex-1 my-4 bg-black/70 rounded-xl border border-white/10 p-4 relative flex items-center justify-center">
        <svg className="w-full h-32" viewBox="0 0 100 50">
          <path
            d={"M 0,45 Q 20," + (10 + Math.sin(frame * 0.2) * 8) + " 40,30 T 70," + (20 + Math.cos(frame * 0.2) * 10) + " T 100,45"}
            fill="none"
            stroke="#6366f1"
            strokeWidth="2"
          />
        </svg>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>WINDOWING: HANNING</span>
        <span>WEIGHTING: A-WEIGHTED</span>
      </div>
    </div>
  );
};
