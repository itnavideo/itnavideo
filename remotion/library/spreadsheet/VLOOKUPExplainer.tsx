import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface VLOOKUPExplainerProps {
  lookupValue?: string;
  tableRange?: string;
  colIndexNum?: number;
  exactMatch?: boolean;
  returnedValue?: string;
  className?: string;
}

export const VLOOKUPExplainer: React.FC<VLOOKUPExplainerProps> = ({
  lookupValue = "EMP-1042",
  tableRange = "A2:D500",
  colIndexNum = 3,
  exactMatch = true,
  returnedValue = "Senior Data Engineer ($145,000)",
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-emerald-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
            VLOOKUP FORMULA ANATOMY
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
          Vertical Lookup
        </span>
      </div>

      <div className="p-3 rounded-xl bg-black/60 border border-zinc-800 font-mono text-xs mb-4">
        <code>=VLOOKUP(<span className="text-amber-400">"{lookupValue}"</span>, <span className="text-sky-300">{tableRange}</span>, <span className="text-purple-400">{colIndexNum}</span>, <span className="text-emerald-400">{exactMatch ? 'FALSE' : 'TRUE'}</span>)</code>
      </div>

      <div className="grid grid-cols-3 gap-2 font-mono text-xs mb-3">
        <div className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/20">
          <div className="text-[10px] text-amber-400 uppercase">Lookup Key</div>
          <div className="text-white font-bold text-xs mt-0.5">{lookupValue}</div>
        </div>
        <div className="p-2.5 rounded-xl bg-purple-950/20 border border-purple-500/20">
          <div className="text-[10px] text-purple-400 uppercase">Column Offset</div>
          <div className="text-white font-bold text-xs mt-0.5">Col #{colIndexNum}</div>
        </div>
        <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
          <div className="text-[10px] text-emerald-400 uppercase">Match Mode</div>
          <div className="text-emerald-300 font-bold text-xs mt-0.5">Exact Match</div>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 font-mono text-xs flex justify-between items-center">
        <span className="text-zinc-400">Output Result:</span>
        <span className="text-emerald-400 font-bold">{returnedValue}</span>
      </div>
    </div>
  );
};
