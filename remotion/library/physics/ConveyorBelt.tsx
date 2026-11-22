import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface ConveyorBeltProps {
  className?: string;
}

export const ConveyorBelt: React.FC<ConveyorBeltProps> = ({
  className = '',
}) => {
  const frame = useCurrentFrame();
  const itemX = (frame * 2.5) % 180;

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-mono flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
          INDUSTRIAL CONVEYOR BELT
        </span>
        <span className="text-white/40">SPEED: 1.2 m/s</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-4 flex flex-col items-center justify-center">
        <div className="w-56 h-8 bg-zinc-800 rounded-full border-2 border-white/20 relative flex items-center">
          <div
            className="w-6 h-6 bg-emerald-500 border border-white rounded absolute -top-5 shadow"
            style={{ left: itemX + 'px' }}
          />
        </div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>PULLEY DIAMETER: 200mm</span>
        <span>BELT TENSION: 2500 N</span>
      </div>
    </div>
  );
};
