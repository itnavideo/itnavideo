import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface XLOOKUPCardProps {
  lookupValue?: string;
  lookupArray?: string;
  returnArray?: string;
  ifNotFound?: string;
  outputResult?: string;
  className?: string;
}

export const XLOOKUPCard: React.FC<XLOOKUPCardProps> = ({
  lookupValue = "P-9840",
  lookupArray = "Products[SKU]",
  returnArray = "Products[RetailPrice]",
  ifNotFound = "'Not in Catalog'",
  outputResult = "$499.00",
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-sky-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-sky-400" />
          <span className="text-xs uppercase tracking-wider text-sky-400 font-bold">
            MODERN XLOOKUP ENGINE
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-500/20 font-bold">
          BIDIRECTIONAL
        </span>
      </div>

      <div className="p-3 rounded-xl bg-black/60 border border-zinc-800 font-mono text-xs mb-3">
        <code>=XLOOKUP(<span className="text-amber-400">"{lookupValue}"</span>, <span className="text-sky-300">{lookupArray}</span>, <span className="text-emerald-300">{returnArray}</span>, <span className="text-zinc-400">{ifNotFound}</span>)</code>
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-xs mb-3">
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Search Direction</div>
          <div className="text-white font-bold text-xs mt-0.5">Left-to-Right or Right-to-Left</div>
        </div>
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Missing Value Guard</div>
          <div className="text-zinc-300 font-bold text-xs mt-0.5">{ifNotFound}</div>
        </div>
      </div>

      <div className="flex justify-between items-center text-xs font-mono text-zinc-400 border-t border-zinc-800 pt-2">
        <span>Evaluated Value:</span>
        <span className="text-sky-400 font-bold text-sm">{outputResult}</span>
      </div>
    </div>
  );
};
