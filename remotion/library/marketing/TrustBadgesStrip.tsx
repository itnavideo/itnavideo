import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface TrustBadgesStripProps {
  className?: string;
}

export const TrustBadgesStrip: React.FC<TrustBadgesStripProps> = ({
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-zinc-800 text-white/80 font-bold border border-white/20">
          ENTERPRISE TRUST STRIP
        </span>
        <span className="text-white/40">GLOBAL CHECKOUT COMPLIANCE</span>
      </div>

      <div className="flex-1 my-4 grid grid-cols-4 gap-2 items-center">
        <div className="p-3 bg-zinc-900 border border-white/10 rounded-xl text-center">
          <div className="text-sm font-black text-indigo-400">STRIPE</div>
          <div className="text-[9px] text-white/40 mt-1 font-mono">VERIFIED</div>
        </div>
        <div className="p-3 bg-zinc-900 border border-white/10 rounded-xl text-center">
          <div className="text-sm font-black text-emerald-400">256-BIT</div>
          <div className="text-[9px] text-white/40 mt-1 font-mono">SSL ENCRYPT</div>
        </div>
        <div className="p-3 bg-zinc-900 border border-white/10 rounded-xl text-center">
          <div className="text-sm font-black text-sky-400">SOC2</div>
          <div className="text-[9px] text-white/40 mt-1 font-mono">COMPLIANT</div>
        </div>
        <div className="p-3 bg-zinc-900 border border-white/10 rounded-xl text-center">
          <div className="text-sm font-black text-amber-400">30-DAY</div>
          <div className="text-[9px] text-white/40 mt-1 font-mono">REFUNDABLE</div>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>SECURITY: BANK GRADE AES</span>
        <span>FRAUD SHIELD: ACTIVE</span>
      </div>
    </div>
  );
};
