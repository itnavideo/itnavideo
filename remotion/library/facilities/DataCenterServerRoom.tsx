import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface DataCenterServerRoomProps {
  datacenterId?: string;
  serverRacks?: number;
  pueScore?: number;
  powerCapacity?: string;
  className?: string;
}

export const DataCenterServerRoom: React.FC<DataCenterServerRoomProps> = ({
  datacenterId = 'US-EAST-DC-02',
  serverRacks = 140,
  pueScore = 1.15,
  powerCapacity = '12 Megawatts (2N Redundant)',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">
          ENTERPRISE DATA CENTER
        </span>
        <span className="text-white/40">{datacenterId}</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-4 flex flex-col justify-between">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm font-bold text-white">Tier IV Cold-Aisle Containment Facility</div>
            <div className="text-xs text-blue-400 font-mono">{powerCapacity}</div>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs font-mono border border-emerald-500/40">
            UPTIME: 99.999%
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 my-2">
          <div className="p-2.5 bg-zinc-950 rounded border border-white/10 text-center">
            <div className="text-[10px] text-white/40 font-mono">SERVER RACKS</div>
            <div className="text-sm font-bold text-white font-mono mt-1">{serverRacks} Racks</div>
          </div>
          <div className="p-2.5 bg-zinc-950 rounded border border-white/10 text-center">
            <div className="text-[10px] text-white/40 font-mono">PUE EFFICIENCY</div>
            <div className="text-sm font-bold text-emerald-400 font-mono mt-1">{pueScore} PUE</div>
          </div>
          <div className="p-2.5 bg-zinc-950 rounded border border-white/10 text-center">
            <div className="text-[10px] text-white/40 font-mono">COOLING INLET</div>
            <div className="text-sm font-bold text-sky-400 font-mono mt-1">21.5°C CRAC</div>
          </div>
        </div>

        <div className="text-xs text-white/60 flex justify-between pt-2 border-t border-white/10">
          <span>FIRE SUPPRESSION: FM-200 GAS</span>
          <span className="text-blue-400 font-mono">BACKUP UPS DIESEL GENERATORS: READY</span>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>VESDA SMOKE SAMPLING: NORMAL</span>
        <span>MANTRAP BIOMETRIC ACCESS: ACTIVE</span>
      </div>
    </div>
  );
};
