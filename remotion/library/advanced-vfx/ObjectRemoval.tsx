import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface ObjectRemovalProps {
  targetObject?: string;
  className?: string;
}

export const ObjectRemoval: React.FC<ObjectRemovalProps> = ({
  targetObject = 'Microphone Boom / Rig',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-orange-500/20 text-orange-400 font-bold border border-orange-500/30">
          AI OBJECT REMOVAL
        </span>
        <span className="text-white/40">SEAMLESS PATCH</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-5 flex flex-col items-center justify-center">
        <div className="w-24 h-16 border-2 border-dashed border-orange-400/80 rounded-lg flex items-center justify-center mb-3 bg-orange-950/20">
          <span className="text-orange-400 font-bold text-xs">REMOVED</span>
        </div>
        <div className="text-sm font-bold text-white">{targetObject}</div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>ALGORITHM: DIFFUSION INPAINT</span>
        <span>BACKGROUND RESTORED</span>
      </div>
    </div>
  );
};
