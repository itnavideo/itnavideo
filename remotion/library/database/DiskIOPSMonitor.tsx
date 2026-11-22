import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface DiskIOPSMonitorProps {
  readIOPS?: number;
  writeIOPS?: number;
  maxIOPS?: number;
  readThroughputMBps?: number;
  writeThroughputMBps?: number;
  volumeType?: string;
  className?: string;
}

export const DiskIOPSMonitor: React.FC<DiskIOPSMonitorProps> = ({
  readIOPS = 7850,
  writeIOPS = 3420,
  maxIOPS = 12000,
  readThroughputMBps = 125.4,
  writeThroughputMBps = 48.2,
  volumeType = "io2 Provisioned SSD",
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const totalIOPS = readIOPS + writeIOPS;
  const progress = interpolate(frame, [0, 40], [0, totalIOPS / maxIOPS], { extrapolateRight: 'clamp' });
  const percent = Math.min(100, progress * 100);

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-sky-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-sky-400" />
          <span className="text-xs uppercase tracking-wider text-sky-400 font-bold">
            STORAGE IOPS MONITOR
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
          {volumeType}
        </span>
      </div>

      <div className="flex justify-between items-baseline mb-2 font-mono">
        <div>
          <span className="text-3xl font-extrabold text-white">{(totalIOPS * progress).toFixed(0)}</span>
          <span className="text-xs text-zinc-400 ml-1">/ {maxIOPS.toLocaleString()} IOPS</span>
        </div>
        <span className="text-sm font-bold text-sky-400">{percent.toFixed(1)}% Saturation</span>
      </div>

      <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-sky-500 to-indigo-500"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-xs">
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Read IOPS / Throughput</div>
          <div className="text-sky-400 font-bold text-base mt-1">{readIOPS.toLocaleString()} IOPS</div>
          <div className="text-[10px] text-zinc-500">{readThroughputMBps} MB/s</div>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Write IOPS / Throughput</div>
          <div className="text-indigo-400 font-bold text-base mt-1">{writeIOPS.toLocaleString()} IOPS</div>
          <div className="text-[10px] text-zinc-500">{writeThroughputMBps} MB/s</div>
        </div>
      </div>
    </div>
  );
};
