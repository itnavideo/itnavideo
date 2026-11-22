import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface MagnifiedInsetProps {
  zoomLevel?: string;
  className?: string;
}

export const MagnifiedInset: React.FC<MagnifiedInsetProps> = ({
  zoomLevel = '2.5X ZOOM',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-mono flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-purple-500/20 text-purple-400 font-bold border border-purple-500/30">
          MAGNIFIED LOUPE INSET
        </span>
        <span className="text-purple-300 font-bold">{zoomLevel}</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 relative p-4 flex items-center justify-center">
        <div className="w-36 h-36 rounded-full border-4 border-purple-400 bg-black/80 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden">
          <div className="text-xs text-white/60 mb-1">MICRO DETAIL</div>
          <div className="text-2xl font-black text-purple-400">0.05mm</div>
          <div className="w-full h-0.5 bg-purple-500/40 absolute" />
          <div className="h-full w-0.5 bg-purple-500/40 absolute" />
        </div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>OPTICAL LOUPE BORDER</span>
        <span>RETICLE: CENTERED</span>
      </div>
    </div>
  );
};
