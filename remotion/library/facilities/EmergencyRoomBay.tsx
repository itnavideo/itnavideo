import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface EmergencyRoomBayProps {
  bayNumber?: string;
  heartRate?: number;
  bp?: string;
  oxygenSat?: number;
  className?: string;
}

export const EmergencyRoomBay: React.FC<EmergencyRoomBayProps> = ({
  bayNumber = 'TRAUMA BAY 03',
  heartRate = 74,
  bp = '120 / 80',
  oxygenSat = 99,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
          EMERGENCY TRAUMA BAY
        </span>
        <span className="text-white/40">{bayNumber}</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-4 flex flex-col justify-between">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-white font-mono">CRITICAL CARE VITALS:</span>
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
            PATIENT STABLE
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 my-2">
          <div className="p-3 bg-zinc-950 rounded-lg border border-white/10 text-center">
            <div className="text-[10px] text-white/40 font-mono">HEART RATE</div>
            <div className="text-xl font-black font-mono text-emerald-400 mt-1">{heartRate} <span className="text-xs font-normal">BPM</span></div>
          </div>
          <div className="p-3 bg-zinc-950 rounded-lg border border-white/10 text-center">
            <div className="text-[10px] text-white/40 font-mono">BLOOD PRESSURE</div>
            <div className="text-xl font-bold font-mono text-sky-400 mt-1">{bp}</div>
          </div>
          <div className="p-3 bg-zinc-950 rounded-lg border border-white/10 text-center">
            <div className="text-[10px] text-white/40 font-mono">SPO2 SAT</div>
            <div className="text-xl font-black font-mono text-teal-400 mt-1">{oxygenSat}%</div>
          </div>
        </div>

        <div className="text-xs text-white/60 flex justify-between pt-2 border-t border-white/10">
          <span>IV INFUSION PUMP: RUNNING (0.9% NS)</span>
          <span className="text-emerald-400 font-mono">DEFIBRILLATOR: CHARGED</span>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>ATTENDING PHYSICIAN ON SITE</span>
        <span>ISOLATION PROTOCOL: LEVEL B</span>
      </div>
    </div>
  );
};
