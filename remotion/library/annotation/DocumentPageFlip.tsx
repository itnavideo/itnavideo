import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface DocumentPageFlipProps {
  pageNumber?: number;
  className?: string;
}

export const DocumentPageFlip: React.FC<DocumentPageFlipProps> = ({
  pageNumber = 12,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-mono flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
          DOCUMENT PAGE TURN (3D)
        </span>
        <span className="text-white/40">PAGE {pageNumber} ➔ {pageNumber + 1}</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-5 flex items-center justify-center">
        <div className="w-40 h-52 bg-white text-zinc-900 p-4 rounded shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="text-xs font-black">ANNUAL AUDIT REPORT</div>
          <div className="space-y-1">
            <div className="w-full h-1.5 bg-zinc-300 rounded" />
            <div className="w-4/5 h-1.5 bg-zinc-300 rounded" />
            <div className="w-3/4 h-1.5 bg-zinc-300 rounded" />
          </div>
          <div className="text-[10px] text-right font-bold">P. {pageNumber}</div>
        </div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>PAGE CURL: 25°</span>
        <span>PAPER WEIGHT: 120 GSM</span>
      </div>
    </div>
  );
};
