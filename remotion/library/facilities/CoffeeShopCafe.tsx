import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface CoffeeShopCafeProps {
  cafeName?: string;
  specialty?: string;
  seatingCapacity?: number;
  className?: string;
}

export const CoffeeShopCafe: React.FC<CoffeeShopCafeProps> = ({
  cafeName = 'Artisan Roast & Co.',
  specialty = 'Single-Origin Ethiopian Cold Brew',
  seatingCapacity = 36,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-amber-600/20 text-amber-500 font-bold border border-amber-600/30">
          COFFEE SHOP & CAFE
        </span>
        <span className="text-white/40">HOSPITALITY VENUE</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-4 flex flex-col justify-between">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-base font-bold text-white">{cafeName}</div>
            <div className="text-xs text-amber-400/80 font-mono">Specialty: {specialty}</div>
          </div>
          <div className="px-2.5 py-1 rounded-lg bg-amber-950/40 border border-amber-600/40 text-amber-300 font-mono text-xs">
            ☕ ESPRESSO BAR
          </div>
        </div>

        <div className="my-3 grid grid-cols-3 gap-2">
          <div className="p-2.5 bg-zinc-950 rounded border border-white/5 text-center">
            <div className="text-[10px] text-white/40 font-mono">SEATING</div>
            <div className="text-sm font-bold text-white mt-0.5">{seatingCapacity} Seats</div>
          </div>
          <div className="p-2.5 bg-zinc-950 rounded border border-white/5 text-center">
            <div className="text-[10px] text-white/40 font-mono">PEAK HOURS</div>
            <div className="text-sm font-bold text-amber-400 mt-0.5">8 AM - 11 AM</div>
          </div>
          <div className="p-2.5 bg-zinc-950 rounded border border-white/5 text-center">
            <div className="text-[10px] text-white/40 font-mono">WIFI SPEED</div>
            <div className="text-sm font-bold text-emerald-400 mt-0.5">350 Mbps</div>
          </div>
        </div>

        <div className="p-2 bg-zinc-800/60 rounded border border-white/10 flex items-center justify-between text-xs">
          <span className="text-white/70">Chalkboard Menu Today:</span>
          <span className="text-amber-300 font-mono font-bold">Oat Milk Cortado • Cardamom Bun</span>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>STATUS: ACTIVE SERVICE</span>
        <span>PATIO SEATING: OPEN</span>
      </div>
    </div>
  );
};
