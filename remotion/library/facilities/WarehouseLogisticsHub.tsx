import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface WarehouseLogisticsHubProps {
  hubCode?: string;
  squareFeet?: string;
  loadingDocks?: number;
  className?: string;
}

export const WarehouseLogisticsHub: React.FC<WarehouseLogisticsHubProps> = ({
  hubCode = 'FULFILLMENT HUB ORD-04',
  squareFeet = '450,000 sq ft',
  loadingDocks = 36,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
          DISTRIBUTION & WAREHOUSE HUB
        </span>
        <span className="text-white/40">{hubCode}</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-4 flex flex-col justify-between">
        <div>
          <div className="text-sm font-bold text-white">Automated Fulfillment & Pallet Logistics</div>
          <div className="text-xs text-amber-400 font-mono">{squareFeet} High-Bay Storage • 38ft Clear Height</div>
        </div>

        <div className="grid grid-cols-3 gap-2 my-2">
          <div className="p-2.5 bg-zinc-950 rounded border border-white/10 text-center">
            <div className="text-[10px] text-white/40 font-mono">CROSS-DOCK DOORS</div>
            <div className="text-sm font-bold text-white font-mono mt-1">{loadingDocks} Bays</div>
          </div>
          <div className="p-2.5 bg-zinc-950 rounded border border-white/10 text-center">
            <div className="text-[10px] text-white/40 font-mono">FORKLIFTS / AGVS</div>
            <div className="text-sm font-bold text-amber-300 font-mono mt-1">18 Autonomous</div>
          </div>
          <div className="p-2.5 bg-zinc-950 rounded border border-white/10 text-center">
            <div className="text-[10px] text-white/40 font-mono">DAILY PACKAGES</div>
            <div className="text-sm font-bold text-emerald-400 font-mono mt-1">62,000 Shipped</div>
          </div>
        </div>

        <div className="text-xs text-white/60 flex justify-between pt-2 border-t border-white/10">
          <span>SORTATION CONVEYOR: 3.2 M/S SPEED</span>
          <span className="text-amber-400 font-mono">ESFR SPRINKLER RATED</span>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>SECURITY: PERIMETER FENCED & GUARDED</span>
        <span>LED MOTION BAY SENSORS: 100%</span>
      </div>
    </div>
  );
};
