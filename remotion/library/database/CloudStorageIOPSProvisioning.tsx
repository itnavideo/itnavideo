import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface CloudStorageIOPSProvisioningProps {
  storageType?: string;
  provisionedIOPS?: number;
  throughputMBps?: number;
  subMillisecondLatency?: boolean;
  className?: string;
}

export const CloudStorageIOPSProvisioning: React.FC<CloudStorageIOPSProvisioningProps> = ({
  storageType = "AWS io2 Block Express",
  provisionedIOPS = 25000,
  throughputMBps = 1000,
  subMillisecondLatency = true,
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-indigo-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
          <span className="text-xs uppercase tracking-wider text-indigo-400 font-bold">
            PROVISIONED STORAGE IOPS
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/20 font-bold">
          SUB-MILLISECOND
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-xs mb-3">
        <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20">
          <div className="text-[10px] text-indigo-400 uppercase">Provisioned IOPS</div>
          <div className="text-white font-bold text-xl mt-1">{provisionedIOPS.toLocaleString()} IOPS</div>
        </div>

        <div className="p-3 rounded-xl bg-sky-950/30 border border-sky-500/20">
          <div className="text-[10px] text-sky-400 uppercase">Throughput Ceiling</div>
          <div className="text-sky-300 font-bold text-xl mt-1">{throughputMBps} MB/s</div>
        </div>
      </div>

      <div className="text-[10px] font-mono text-zinc-400 flex justify-between">
        <span>Volume Type: {storageType}</span>
        <span className="text-emerald-400 font-bold">99.999% Durability</span>
      </div>
    </div>
  );
};
