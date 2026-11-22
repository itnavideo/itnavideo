import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface SkyscraperTowerProps {
  buildingName?: string;
  heightMeters?: number;
  floors?: number;
  leedStatus?: string;
  className?: string;
}

export const SkyscraperTower: React.FC<SkyscraperTowerProps> = ({
  buildingName = 'Apex Financial Centre',
  heightMeters = 340,
  floors = 72,
  leedStatus = 'LEED Platinum Certified',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">
          COMMERCIAL SKYSCRAPER
        </span>
        <span className="text-white/40">GRADE-A ASSET</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-5 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-base font-bold text-white">{buildingName}</div>
            <div className="text-xs text-blue-300 font-mono">{leedStatus}</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black font-mono text-white">{floors}</div>
            <div className="text-[10px] text-white/40 font-mono">STORIES</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 my-2">
          <div className="p-2.5 bg-zinc-950 rounded border border-white/10 text-center">
            <div className="text-[10px] text-white/40 font-mono">ARCHITECTURAL HEIGHT</div>
            <div className="text-sm font-bold text-white font-mono mt-0.5">{heightMeters} m</div>
          </div>
          <div className="p-2.5 bg-zinc-950 rounded border border-white/10 text-center">
            <div className="text-[10px] text-white/40 font-mono">CURTAIN WALL</div>
            <div className="text-sm font-bold text-sky-400 font-mono mt-0.5">Double Glazed</div>
          </div>
          <div className="p-2.5 bg-zinc-950 rounded border border-white/10 text-center">
            <div className="text-[10px] text-white/40 font-mono">ELEVATOR BANKS</div>
            <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">28 High-Speed</div>
          </div>
        </div>

        <div className="text-xs text-white/60 flex justify-between pt-2 border-t border-white/10">
          <span>SMART BMS HVAC MONITORED</span>
          <span className="text-blue-400 font-mono">OCCUPANCY: 96.8%</span>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>SEISMIC DAMPER: TUNED MASS 660 TON</span>
        <span>FIBER: DUAL DIVERSE ENTRY</span>
      </div>
    </div>
  );
};
