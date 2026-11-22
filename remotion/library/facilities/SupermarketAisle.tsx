import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface SupermarketAisleProps {
  aisleNumber?: number;
  categoryName?: string;
  skusCount?: number;
  className?: string;
}

export const SupermarketAisle: React.FC<SupermarketAisleProps> = ({
  aisleNumber = 4,
  categoryName = 'Organic Produce & Farm Fresh',
  skusCount = 420,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
          GROCERY & SUPERMARKET AISLE
        </span>
        <span className="text-white/40">RETAIL MERCHANDISING</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-4 flex flex-col justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black text-lg flex items-center justify-center font-mono">
            {aisleNumber}
          </div>
          <div>
            <div className="text-sm font-bold text-white">{categoryName}</div>
            <div className="text-xs text-white/50 font-mono">{skusCount} Active SKUs on Shelves</div>
          </div>
        </div>

        {/* Shelving Display Simulation */}
        <div className="space-y-1.5 my-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-6 bg-zinc-950 rounded border border-white/10 flex items-center px-2 space-x-2">
              <span className="text-[9px] font-mono text-white/40">TIER {i + 1}</span>
              <div className="flex-1 flex space-x-1.5">
                {[...Array(6)].map((_, j) => (
                  <div key={j} className="h-3 w-4 rounded-sm bg-emerald-700/60" />
                ))}
              </div>
              <span className="text-[9px] font-mono text-emerald-400">IN STOCK</span>
            </div>
          ))}
        </div>

        <div className="text-xs text-white/60 flex justify-between pt-2 border-t border-white/10">
          <span>RESTOCK FREQUENCY: DAILY (5 AM)</span>
          <span className="text-emerald-400 font-mono">SHELF OCCUPANCY: 94%</span>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>RFID INVENTORY TRACKED</span>
        <span>SMART CART SCAN COMPATIBLE</span>
      </div>
    </div>
  );
};
