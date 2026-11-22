import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface AutomatedMinorVersionUpgradeProps {
  currentVersion?: string;
  targetVersion?: string;
  syncState?: string;
  switchoverDurationSec?: number;
  className?: string;
}

export const AutomatedMinorVersionUpgrade: React.FC<AutomatedMinorVersionUpgradeProps> = ({
  currentVersion = "PostgreSQL 16.2 (Blue)",
  targetVersion = "PostgreSQL 16.4 (Green)",
  syncState = "GREEN CLUSTER FULLY REPLICATED",
  switchoverDurationSec = 0.8,
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
            BLUE/GREEN ENGINE UPGRADE
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/20 font-bold">
          &lt;1s SWITCHOVER
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-xs mb-3">
        <div className="p-3 rounded-xl bg-sky-950/20 border border-sky-500/30">
          <div className="text-[10px] text-sky-400 uppercase">Blue (Current)</div>
          <div className="text-white font-bold mt-1">{currentVersion}</div>
        </div>

        <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
          <div className="text-[10px] text-emerald-400 uppercase">Green (Patched)</div>
          <div className="text-emerald-300 font-bold mt-1">{targetVersion}</div>
        </div>
      </div>

      <div className="text-[10px] font-mono text-zinc-400 flex justify-between">
        <span>Status: {syncState}</span>
        <span className="text-emerald-400 font-bold">Zero Transaction Drops</span>
      </div>
    </div>
  );
};
