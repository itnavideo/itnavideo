import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface ShoppingMallAtriumProps {
  mallName?: string;
  storeCount?: number;
  floors?: number;
  className?: string;
}

export const ShoppingMallAtrium: React.FC<ShoppingMallAtriumProps> = ({
  mallName = 'Metropolis Grand Gallerie',
  storeCount = 180,
  floors = 4,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-purple-500/20 text-purple-400 font-bold border border-purple-500/30">
          SHOPPING MALL ATRIUM
        </span>
        <span className="text-white/40">COMMERCIAL COMPLEX</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-4 flex flex-col justify-between">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-base font-bold text-white">{mallName}</div>
            <div className="text-xs text-purple-300/80 font-mono">{floors} Vertical Levels • {storeCount} Anchor Tenants</div>
          </div>
          <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 font-mono text-xs border border-purple-700">
            GLASS ATRIUM
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2 my-3">
          {[...Array(floors)].map((_, i) => (
            <div key={i} className="p-2.5 bg-zinc-950 rounded border border-white/10 text-center">
              <div className="text-[10px] text-white/40 font-mono">LEVEL {floors - i}</div>
              <div className="text-xs font-bold text-white mt-1">
                {i === 0 ? 'Cinema & Dining' : i === 1 ? 'Tech & Lifestyle' : i === 2 ? 'Apparel & Beauty' : 'Luxury Flagship'}
              </div>
            </div>
          ))}
        </div>

        <div className="text-xs text-white/60 flex justify-between pt-2 border-t border-white/10">
          <span>ESCALATOR CIRCUITS: 12 OPERATIONAL</span>
          <span className="text-purple-400 font-mono">WEEKEND FOOTFALL: 48,000</span>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>SECURITY: 24/7 CCTV & ACCESS</span>
        <span>PARKING: 2,500 BAYS</span>
      </div>
    </div>
  );
};
