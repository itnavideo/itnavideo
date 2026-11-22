import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface DynamicArrayFilterProps {
  formula?: string;
  spillCount?: number;
  spillRange?: string;
  className?: string;
}

export const DynamicArrayFilter: React.FC<DynamicArrayFilterProps> = ({
  formula = "=FILTER(A2:D500, D2:D500 > 1000, 'None')",
  spillCount = 14,
  spillRange = "F2:I15",
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
            DYNAMIC ARRAY SPILL ENGINE
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-500/20 font-bold">
          SPILL ACTIVE
        </span>
      </div>

      <div className="p-3 rounded-xl bg-black/60 border border-zinc-800 font-mono text-xs mb-3">
        <code>{formula}</code>
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-xs">
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Spilled Rows</div>
          <div className="text-white font-bold text-sm mt-0.5">{spillCount} Rows Spilled</div>
        </div>
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Spill Destination</div>
          <div className="text-sky-300 font-bold text-sm mt-0.5">{spillRange}</div>
        </div>
      </div>
    </div>
  );
};
