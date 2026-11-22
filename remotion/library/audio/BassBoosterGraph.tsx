import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface BassBoosterGraphProps {
  boostDb?: number;
  cutoffHz?: number;
  className?: string;
}

export const BassBoosterGraph: React.FC<BassBoosterGraphProps> = ({
  boostDb = 6.5,
  cutoffHz = 80,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-red-500/20 text-red-400 font-bold border border-red-500/30">
          SUB-BASS EQ BOOST CURVE
        </span>
        <span className="text-white/40">+{boostDb} dB @ {cutoffHz}Hz</span>
      </div>

      <div className="flex-1 my-4 bg-black/60 rounded-xl border border-white/10 p-4 relative flex items-center justify-center">
        <svg className="w-full h-32" viewBox="0 0 100 60">
          <path d="M 0,20 Q 25,15 40,40 T 100,40" fill="none" stroke="#ef4444" strokeWidth="2.5" />
          <line x1="25" y1="0" x2="25" y2="60" stroke="#fff" strokeOpacity="0.2" strokeDasharray="2 2" />
        </svg>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>Q FACTOR: 1.414</span>
        <span>FILTER: LOW SHELF</span>
      </div>
    </div>
  );
};
