import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

export interface CACtoLTVGaugeProps {
  cac?: number;
  ltv?: number;
  className?: string;
}

export const CACtoLTVGauge: React.FC<CACtoLTVGaugeProps> = ({
  cac = 45,
  ltv = 240,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const ratio = (ltv / cac).toFixed(1);
  const rotation = interpolate(frame, [0, 45], [-90, 45], { extrapolateRight: 'clamp' });

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
          LTV : CAC EFFICIENCY METER
        </span>
        <span className="text-emerald-400 font-bold">HEALTHY &gt; 3.0x</span>
      </div>

      <div className="flex-1 my-4 flex flex-col items-center justify-center">
        <div className="relative w-48 h-24 overflow-hidden flex items-end justify-center">
          <div className="w-48 h-48 rounded-full border-[14px] border-zinc-800 border-t-amber-500 border-r-emerald-500" />
          <div
            className="absolute bottom-0 w-1 h-20 bg-white origin-bottom shadow-lg"
            style={{ transform: "rotate(" + rotation + "deg)" }}
          />
        </div>
        <div className="mt-3 text-3xl font-extrabold font-mono text-emerald-400">
          {ratio}x <span className="text-sm font-normal text-white/60">RATIO</span>
        </div>
        <div className="text-xs text-white/50 font-mono mt-1">CAC: ${cac} | LTV: ${ltv}</div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>PAYBACK PERIOD: 2.1 MONTHS</span>
        <span>STATUS: HYPERGROWTH SAFE</span>
      </div>
    </div>
  );
};
