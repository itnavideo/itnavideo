import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface DedicatedVCPUInstanceProps {
  instanceClass?: string;
  vCPUCount?: number;
  memoryRAMGB?: number;
  networkGbps?: number;
  className?: string;
}

export const DedicatedVCPUInstance: React.FC<DedicatedVCPUInstanceProps> = ({
  instanceClass = "db.r6g.4xlarge (Graviton2)",
  vCPUCount = 16,
  memoryRAMGB = 128,
  networkGbps = 12.5,
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
            CLOUD COMPUTE INSTANCE CLASS
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
          ARM64 Architecture
        </span>
      </div>

      <div className="flex justify-between items-baseline mb-4 font-mono">
        <div>
          <span className="text-2xl font-bold text-white">{instanceClass}</span>
        </div>
        <span className="text-xs text-sky-300 font-bold">Memory-Optimized</span>
      </div>

      <div className="grid grid-cols-3 gap-2 font-mono text-center text-xs">
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400">vCPUs</div>
          <div className="text-white font-bold text-sm mt-1">{vCPUCount} Cores</div>
        </div>
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400">Memory RAM</div>
          <div className="text-sky-300 font-bold text-sm mt-1">{memoryRAMGB} GB</div>
        </div>
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400">EBS Bandwidth</div>
          <div className="text-emerald-400 font-bold text-sm mt-1">{networkGbps} Gbps</div>
        </div>
      </div>
    </div>
  );
};
