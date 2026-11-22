import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface GammaCorrectionProps {
  gammaValue?: number; // e.g. 2.2 or 2.4
  targetStandard?: string;
  className?: string;
}

export const GammaCorrection: React.FC<GammaCorrectionProps> = ({
  gammaValue = 2.4,
  targetStandard = 'BT.1886 / Rec.709',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30">
          GAMMA CORRECTION (POWER LAW)
        </span>
        <span className="text-white/40">γ = {gammaValue.toFixed(2)}</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-5 flex flex-col items-center justify-center">
        <div className="text-4xl font-mono font-black text-cyan-400 mb-1">γ {gammaValue.toFixed(2)}</div>
        <div className="text-xs text-white/60 mb-2">Display Transfer Function</div>
        <div className="text-[10px] text-cyan-300/80 bg-cyan-950/40 px-3 py-1 rounded border border-cyan-500/30">
          Standard: {targetStandard}
        </div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>POWER EXPONENT: V_out = V_in^γ</span>
        <span>CALIBRATION: PASSED</span>
      </div>
    </div>
  );
};
