import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface CPUCoreUtilizationProps {
  cores?: number;
  userPercent?: number;
  systemPercent?: number;
  iowaitPercent?: number;
  hostName?: string;
  className?: string;
}

export const CPUCoreUtilization: React.FC<CPUCoreUtilizationProps> = ({
  cores = 8,
  userPercent = 42,
  systemPercent = 16,
  iowaitPercent = 28,
  hostName = "db-primary-node-01",
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const animUser = interpolate(frame, [0, 35], [0, userPercent], { extrapolateRight: 'clamp' });
  const animSys = interpolate(frame, [0, 35], [0, systemPercent], { extrapolateRight: 'clamp' });
  const animIo = interpolate(frame, [0, 35], [0, iowaitPercent], { extrapolateRight: 'clamp' });
  const total = animUser + animSys + animIo;

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-purple-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-purple-400" />
          <span className="text-xs uppercase tracking-wider text-purple-400 font-bold">
            CPU UTILIZATION ({cores} CORES)
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
          {hostName}
        </span>
      </div>

      <div className="flex justify-between items-baseline mb-2 font-mono">
        <div>
          <span className="text-3xl font-extrabold text-white">{total.toFixed(1)}%</span>
          <span className="text-xs text-zinc-400 ml-1">Total Load</span>
        </div>
        {animIo > 20 && (
          <span className="text-xs px-2 py-0.5 rounded bg-red-950/80 text-red-300 border border-red-500/30 font-mono">
            I/O WAIT BOTTLENECK
          </span>
        )}
      </div>

      <div className="w-full bg-zinc-800 h-3 rounded-full overflow-hidden flex mb-4">
        <div className="h-full bg-purple-500" style={{ width: `${animUser}%` }} />
        <div className="h-full bg-sky-500" style={{ width: `${animSys}%` }} />
        <div className="h-full bg-amber-500" style={{ width: `${animIo}%` }} />
      </div>

      <div className="grid grid-cols-3 gap-2 font-mono text-xs">
        <div className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/20">
          <div className="text-[10px] text-zinc-400 uppercase">User Space</div>
          <div className="text-purple-400 font-bold text-sm mt-0.5">{animUser.toFixed(0)}%</div>
        </div>
        <div className="p-2.5 rounded-xl bg-sky-950/30 border border-sky-500/20">
          <div className="text-[10px] text-zinc-400 uppercase">System (Kernel)</div>
          <div className="text-sky-400 font-bold text-sm mt-0.5">{animSys.toFixed(0)}%</div>
        </div>
        <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/20">
          <div className="text-[10px] text-zinc-400 uppercase">I/O Wait</div>
          <div className="text-amber-400 font-bold text-sm mt-0.5">{animIo.toFixed(0)}%</div>
        </div>
      </div>
    </div>
  );
};
