import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface DatabaseConnectionTopologyProps {
  appPodsCount?: number;
  poolersCount?: number;
  dbNodesCount?: number;
  className?: string;
}

export const DatabaseConnectionTopology: React.FC<DatabaseConnectionTopologyProps> = ({
  appPodsCount = 48,
  poolersCount = 4,
  dbNodesCount = 3,
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
            TOPOLOGY ARCHITECTURE MAP
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/20 font-bold">
          HEALTHY MESH
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 font-mono text-center text-xs">
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">App Pods</div>
          <div className="text-white font-bold text-sm mt-1">{appPodsCount} Pods</div>
        </div>
        <div className="p-2.5 rounded-xl bg-sky-950/30 border border-sky-500/20">
          <div className="text-[10px] text-sky-400 uppercase">Poolers (PgBouncer)</div>
          <div className="text-sky-300 font-bold text-sm mt-1">{poolersCount} Nodes</div>
        </div>
        <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20">
          <div className="text-[10px] text-emerald-400 uppercase">DB Cluster</div>
          <div className="text-emerald-300 font-bold text-sm mt-1">{dbNodesCount} Nodes (1P+2S)</div>
        </div>
      </div>
    </div>
  );
};
