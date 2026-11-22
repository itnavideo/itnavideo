import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface RTORecoveryTimeObjectiveProps {
  elapsedRestoreMin?: number;
  slaTargetMin?: number;
  restoredDataGB?: number;
  totalDataGB?: number;
  className?: string;
}

export const RTORecoveryTimeObjective: React.FC<RTORecoveryTimeObjectiveProps> = ({
  elapsedRestoreMin = 8.2,
  slaTargetMin = 30.0,
  restoredDataGB = 480,
  totalDataGB = 480,
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const animTime = interpolate(frame, [0, 40], [0, elapsedRestoreMin], { extrapolateRight: 'clamp' });
  const progress = (restoredDataGB / totalDataGB) * 100;

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-sky-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-sky-400" />
          <span className="text-xs uppercase tracking-wider text-sky-400 font-bold">
            RECOVERY TIME OBJECTIVE (RTO)
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/20 font-bold">
          RESTORATION SUCCESSFUL
        </span>
      </div>

      <div className="flex justify-between items-baseline mb-2 font-mono">
        <div>
          <span className="text-4xl font-extrabold text-sky-400">{animTime.toFixed(1)}m</span>
          <span className="text-xs text-zinc-400 ml-2">Total Restoration Time</span>
        </div>
        <span className="text-xs font-bold text-zinc-400">Target SLA: &lt;{slaTargetMin}m</span>
      </div>

      <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-emerald-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-xs">
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Restored Database Volume</div>
          <div className="text-white font-bold text-base mt-1">{restoredDataGB} GB</div>
          <div className="text-[10px] text-zinc-500">100% Volume Hydrated</div>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">SLA Margin Remaining</div>
          <div className="text-emerald-400 font-bold text-base mt-1">{(slaTargetMin - elapsedRestoreMin).toFixed(1)}m Headroom</div>
          <div className="text-[10px] text-zinc-500">Downtime minimized</div>
        </div>
      </div>
    </div>
  );
};
