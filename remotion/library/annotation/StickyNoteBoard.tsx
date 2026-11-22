import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface StickyNoteBoardProps {
  className?: string;
}

export const StickyNoteBoard: React.FC<StickyNoteBoardProps> = ({
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-mono flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-yellow-500/20 text-yellow-400 font-bold border border-yellow-500/30">
          POST-IT STICKY NOTE BOARD
        </span>
        <span className="text-white/40">BRAINSTORM</span>
      </div>

      <div className="flex-1 my-4 bg-amber-950/20 rounded-xl border border-white/10 p-4 flex items-center justify-center space-x-3">
        <div className="w-24 h-24 bg-yellow-300 text-zinc-900 p-2 rounded-xs shadow-lg -rotate-3 flex flex-col justify-between">
          <div className="w-2 h-2 rounded-full bg-red-600 self-center" />
          <div className="text-[10px] font-bold">Ship Remotion Studio V2!</div>
        </div>
        <div className="w-24 h-24 bg-pink-300 text-zinc-900 p-2 rounded-xs shadow-lg rotate-3 flex flex-col justify-between">
          <div className="w-2 h-2 rounded-full bg-blue-600 self-center" />
          <div className="text-[10px] font-bold">Add 500+ Assets</div>
        </div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>CANVAS: CORKBOARD</span>
        <span>PIN ATTACHMENT: 3D SHADOW</span>
      </div>
    </div>
  );
};
