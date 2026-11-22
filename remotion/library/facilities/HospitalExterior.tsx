import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface HospitalExteriorProps {
  hospitalName?: string;
  bedCapacity?: number;
  traumaLevel?: string;
  className?: string;
}

export const HospitalExterior: React.FC<HospitalExteriorProps> = ({
  hospitalName = 'St. Jude Metropolitan Medical Center',
  bedCapacity = 650,
  traumaLevel = 'Level 1 Trauma Center',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-red-500/20 text-red-400 font-bold border border-red-500/30 flex items-center space-x-1.5">
          <span className="text-red-500 font-black">✚</span>
          <span>MEDICAL CENTER EXTERIOR</span>
        </span>
        <span className="text-red-400 font-bold">24/7 EMERGENCY</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-5 flex flex-col justify-between">
        <div>
          <div className="text-base font-bold text-white">{hospitalName}</div>
          <div className="text-xs text-red-400 font-mono mt-0.5">{traumaLevel}</div>
        </div>

        <div className="grid grid-cols-3 gap-2 my-3">
          <div className="p-2.5 bg-zinc-950 rounded border border-white/10 text-center">
            <div className="text-[10px] text-white/40 font-mono">INPATIENT BEDS</div>
            <div className="text-sm font-bold text-white mt-0.5">{bedCapacity} Beds</div>
          </div>
          <div className="p-2.5 bg-zinc-950 rounded border border-white/10 text-center">
            <div className="text-[10px] text-white/40 font-mono">AMBULANCE BAY</div>
            <div className="text-sm font-bold text-emerald-400 mt-0.5">8 Bays Clear</div>
          </div>
          <div className="p-2.5 bg-zinc-950 rounded border border-white/10 text-center">
            <div className="text-[10px] text-white/40 font-mono">ROOFTOP HELIPAD</div>
            <div className="text-sm font-bold text-sky-400 mt-0.5">READY (PAD A)</div>
          </div>
        </div>

        <div className="text-xs text-white/60 flex justify-between pt-2 border-t border-white/10">
          <span>TRIAGE INTAKE: RAPID RESPONSE</span>
          <span className="text-red-300 font-mono">ACCREDITATION: JCAHO GOLD</span>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>GENERATOR BACKUP: 100% OPERATIONAL</span>
        <span>MEDICAL GAS OXYGEN: NORMAL</span>
      </div>
    </div>
  );
};
