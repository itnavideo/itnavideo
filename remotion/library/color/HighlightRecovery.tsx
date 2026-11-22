import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface HighlightRecoveryProps {
  recoveryAmount?: number; // 0 to 100
  softKnee?: boolean;
  className?: string;
}

export const HighlightRecovery: React.FC<HighlightRecoveryProps> = ({
  recoveryAmount = 75,
  softKnee = true,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
          HIGHLIGHT RECOVERY & ROLL-OFF
        </span>
        <span className="text-white/40">CLIPPING RECON</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-5 flex flex-col items-center justify-center">
        <div className="text-3xl font-black text-amber-300 mb-1">{recoveryAmount}% RECOVERED</div>
        <div className="text-xs text-white/50 mb-2">Unclipped Channel Synthesis</div>
        <div className="text-[10px] text-white/40">Soft Knee Compression: {softKnee ? 'ACTIVE' : 'HARD CLIP'}</div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>THRESHOLD: 95 IRE</span>
        <span>LATITUDE EXTENSION: +1.5 STOPS</span>
      </div>
    </div>
  );
};
