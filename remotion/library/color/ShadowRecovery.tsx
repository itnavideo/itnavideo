import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface ShadowRecoveryProps {
  boostAmount?: number;
  noiseFloorDamping?: boolean;
  className?: string;
}

export const ShadowRecovery: React.FC<ShadowRecoveryProps> = ({
  boostAmount = 60,
  noiseFloorDamping = true,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-teal-500/20 text-teal-400 font-bold border border-teal-500/30">
          SHADOW RECOVERY & TOE LIFT
        </span>
        <span className="text-white/40">BLACK LEVEL +{boostAmount}%</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-5 flex flex-col items-center justify-center">
        <div className="text-3xl font-black text-teal-400 mb-1">SHADOW DETAIL UNLOCKED</div>
        <div className="text-xs text-white/50 mb-2">Deep Underexposed Regions Lifted</div>
        <div className="text-[10px] text-teal-300/80">Noise Floor Damping: {noiseFloorDamping ? 'ENABLED' : 'OFF'}</div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>BLACK POINT: 0.00 IRE</span>
        <span>CHROMA NOISE DAMPING: 85%</span>
      </div>
    </div>
  );
};
