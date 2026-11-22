import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface DriveThruWindowProps {
  orderNumber?: number;
  laneStatus?: string;
  avgWaitSeconds?: number;
  className?: string;
}

export const DriveThruWindow: React.FC<DriveThruWindowProps> = ({
  orderNumber = 142,
  laneStatus = 'Window 1: Payment • Window 2: Pickup',
  avgWaitSeconds = 68,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
          EXPRESS DRIVE-THRU
        </span>
        <span className="text-emerald-400 font-bold">LANE OPEN</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-4 flex flex-col justify-between">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-xs text-white/40 font-mono">CURRENT TICKET</div>
            <div className="text-2xl font-black font-mono text-amber-400">ORDER #{orderNumber}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-white/40 font-mono">SPEED OF SERVICE</div>
            <div className="text-lg font-bold font-mono text-emerald-400">{avgWaitSeconds}s Avg</div>
          </div>
        </div>

        <div className="p-3 bg-zinc-950 rounded-lg border border-white/10 text-xs text-white/80 my-2">
          <div className="text-amber-400 font-mono font-bold text-[10px] mb-1">DUAL WINDOW WORKFLOW:</div>
          <div>{laneStatus}</div>
        </div>

        <div className="text-xs text-white/60 flex justify-between pt-2 border-t border-white/10">
          <span>CONTACTLESS TAP & GO: READY</span>
          <span className="text-emerald-400 font-mono">ACCURACY: 99.4%</span>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>VEHICLE QUEUE: 3 CARS</span>
        <span>AUDIO INTERCOM: NOISE FILTER ACTIVE</span>
      </div>
    </div>
  );
};
