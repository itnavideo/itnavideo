import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface MarketSizeTAMProps {
  tam?: string;
  sam?: string;
  som?: string;
  className?: string;
}

export const MarketSizeTAM: React.FC<MarketSizeTAMProps> = ({
  tam = '$142 Billion (Global Video Software)',
  sam = '$24.5 Billion (AI Video & Social Automation)',
  som = '$1.8 Billion (Short-Form Creator Studio)',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
          TAM / SAM / SOM MARKET SIZING
        </span>
        <span className="text-white/40">MARKET OPPORTUNITY</span>
      </div>

      <div className="flex-1 my-4 flex flex-col items-center justify-center space-y-2">
        <div className="w-64 p-2.5 bg-zinc-900 border border-white/10 rounded-xl text-center">
          <div className="text-[10px] text-white/40 font-mono font-bold">TAM (TOTAL ADDRESSABLE MARKET)</div>
          <div className="text-xs font-bold text-zinc-300 mt-0.5">{tam}</div>
        </div>
        <div className="w-52 p-2.5 bg-amber-950/40 border border-amber-500/40 rounded-xl text-center">
          <div className="text-[10px] text-amber-400 font-mono font-bold">SAM (SERVICEABLE ADDRESSABLE)</div>
          <div className="text-xs font-bold text-amber-300 mt-0.5">{sam}</div>
        </div>
        <div className="w-40 p-2.5 bg-emerald-950/50 border border-emerald-500 rounded-xl text-center shadow-lg">
          <div className="text-[10px] text-emerald-400 font-mono font-bold">SOM (SERVICEABLE OBTAINABLE)</div>
          <div className="text-xs font-black text-emerald-300 mt-0.5">{som}</div>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>CAGR: 28.4% ANNUALLY</span>
        <span>PRIMARY SOURCE: STATISTA 2026</span>
      </div>
    </div>
  );
};
