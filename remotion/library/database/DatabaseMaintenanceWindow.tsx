import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface DatabaseMaintenanceWindowProps {
  maintenanceWindow?: string;
  pendingUpdatesCount?: number;
  targetEngineVersion?: string;
  autoApply?: boolean;
  className?: string;
}

export const DatabaseMaintenanceWindow: React.FC<DatabaseMaintenanceWindowProps> = ({
  maintenanceWindow = "Sun: 04:00 - 04:30 UTC",
  pendingUpdatesCount = 1,
  targetEngineVersion = "PostgreSQL 16.4-R2 Patch",
  autoApply = true,
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
            SCHEDULED MAINTENANCE WINDOW
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
          30-Min Window
        </span>
      </div>

      <div className="space-y-2 font-mono text-xs mb-3">
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex justify-between">
          <span className="text-zinc-400">Weekly Schedule:</span>
          <span className="text-white font-bold">{maintenanceWindow}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex justify-between">
          <span className="text-zinc-400">Pending Upgrade:</span>
          <span className="text-sky-300 font-bold">{targetEngineVersion}</span>
        </div>
      </div>

      <div className="text-[10px] font-mono text-zinc-400 flex justify-between">
        <span>Multi-AZ Blue/Green Deployment: Zero Outage</span>
      </div>
    </div>
  );
};
