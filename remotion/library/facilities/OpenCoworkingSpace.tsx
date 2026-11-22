import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface OpenCoworkingSpaceProps {
  spaceName?: string;
  hotDesks?: number;
  phoneBooths?: number;
  className?: string;
}

export const OpenCoworkingSpace: React.FC<OpenCoworkingSpaceProps> = ({
  spaceName = 'Nexus Collaborative Work Lab',
  hotDesks = 84,
  phoneBooths = 12,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-teal-500/20 text-teal-400 font-bold border border-teal-500/30">
          AGILE COWORKING FLOOR
        </span>
        <span className="text-white/40">FLEXIBLE WORKSPACE</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-4 flex flex-col justify-between">
        <div>
          <div className="text-sm font-bold text-white">{spaceName}</div>
          <div className="text-xs text-teal-400 font-mono mt-0.5">Ergonomic Standing Desks & Biophilic Design</div>
        </div>

        <div className="grid grid-cols-3 gap-2 my-2">
          <div className="p-2.5 bg-zinc-950 rounded border border-white/10 text-center">
            <div className="text-[10px] text-white/40 font-mono">HOT DESKS</div>
            <div className="text-sm font-bold text-white mt-1">{hotDesks} Units</div>
          </div>
          <div className="p-2.5 bg-zinc-950 rounded border border-white/10 text-center">
            <div className="text-[10px] text-white/40 font-mono">PHONE BOOTHS</div>
            <div className="text-sm font-bold text-teal-300 mt-1">{phoneBooths} Pods</div>
          </div>
          <div className="p-2.5 bg-zinc-950 rounded border border-white/10 text-center">
            <div className="text-[10px] text-white/40 font-mono">COMMUNAL KITCHEN</div>
            <div className="text-sm font-bold text-emerald-400 mt-1">Kombucha / Nitro</div>
          </div>
        </div>

        <div className="text-xs text-white/60 flex justify-between pt-2 border-t border-white/10">
          <span>DESK OCCUPANCY TODAY: 78%</span>
          <span className="text-teal-400 font-mono">APP DESK RESERVATIONS</span>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>GIGABIT MESH WIFI 6E</span>
        <span>AIR QUALITY: CO2 &lt; 500 PPM</span>
      </div>
    </div>
  );
};
