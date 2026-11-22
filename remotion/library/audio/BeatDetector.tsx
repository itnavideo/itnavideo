import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface BeatDetectorProps {
  confidence?: number;
  className?: string;
}

export const BeatDetector: React.FC<BeatDetectorProps> = ({
  confidence = 98.4,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-mono flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
          AI ONSET BEAT DETECTOR
        </span>
        <span className="text-white/40">CONFIDENCE: {confidence}%</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-5 flex flex-col items-center justify-center">
        <div className="w-full flex justify-between items-center space-x-2 my-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className={"flex-1 h-8 rounded border flex items-center justify-center text-xs font-bold " + (
                i === (Math.floor(frame / 10) % 8) ? 'border-amber-400 bg-amber-500/30 text-amber-300' : 'border-white/10 text-white/30'
              )}
            >
              B{i + 1}
            </div>
          ))}
        </div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>SPECTRAL FLUX ALGORITHM</span>
        <span>TEMPO DRIFT: 0.0 BPM</span>
      </div>
    </div>
  );
};
