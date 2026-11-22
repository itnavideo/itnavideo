import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface ConferenceBoardroomProps {
  roomTitle?: string;
  capacity?: number;
  avRig?: string;
  className?: string;
}

export const ConferenceBoardroom: React.FC<ConferenceBoardroomProps> = ({
  roomTitle = 'Global Executive Boardroom',
  capacity = 24,
  avRig = 'Dual 98" 4K Video Wall & Beamforming Audio',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-400 font-bold border border-indigo-500/30">
          EXECUTIVE BOARDROOM
        </span>
        <span className="text-white/40">MEETING FACILITY</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-4 flex flex-col justify-between">
        <div>
          <div className="text-base font-bold text-white">{roomTitle}</div>
          <div className="text-xs text-indigo-300 font-mono mt-0.5">{avRig}</div>
        </div>

        <div className="grid grid-cols-3 gap-2 my-2">
          <div className="p-2.5 bg-zinc-950 rounded border border-white/10 text-center">
            <div className="text-[10px] text-white/40 font-mono">CAPACITY</div>
            <div className="text-sm font-bold text-white mt-1">{capacity} Leather Seats</div>
          </div>
          <div className="p-2.5 bg-zinc-950 rounded border border-white/10 text-center">
            <div className="text-[10px] text-white/40 font-mono">MICROPHONES</div>
            <div className="text-sm font-bold text-indigo-400 mt-1">16 Shure Ceiling</div>
          </div>
          <div className="p-2.5 bg-zinc-950 rounded border border-white/10 text-center">
            <div className="text-[10px] text-white/40 font-mono">VIRTUAL HYBRID</div>
            <div className="text-sm font-bold text-emerald-400 mt-1">Teams / Zoom Rooms</div>
          </div>
        </div>

        <div className="text-xs text-white/60 flex justify-between pt-2 border-t border-white/10">
          <span>1-TOUCH MEETING JOIN: ACTIVE</span>
          <span className="text-indigo-400 font-mono">DIGITAL WHITEBOARD INTEGRATED</span>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>BOOKING STATUS: IN USE UNTIL 11:30 AM</span>
        <span>SOUND DAMPING: ACOUSTIC SLAT WALL</span>
      </div>
    </div>
  );
};
