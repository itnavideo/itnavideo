import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface DataTypeStorageFootprintProps {
  types?: { type: string; bytesPercentage: number }[];
  className?: string;
}

export const DataTypeStorageFootprint: React.FC<DataTypeStorageFootprintProps> = ({
  types = [
    { type: "JSONB Documents", bytesPercentage: 42.5 },
    { type: "VARCHAR Strings", bytesPercentage: 28.1 },
    { type: "UUID Identifiers", bytesPercentage: 14.8 },
    { type: "BIGINT Integers", bytesPercentage: 8.4 },
    { type: "TIMESTAMPTZ Dates", bytesPercentage: 6.2 },
  ],
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
            DATA TYPE STORAGE WEIGHT
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
          Storage Profiler
        </span>
      </div>

      <div className="space-y-2 font-mono text-xs">
        {types.map((t, idx) => (
          <div key={idx} className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex justify-between items-center">
            <span className="text-white font-bold">{t.type}</span>
            <span className="text-emerald-400 font-bold">{t.bytesPercentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
