import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface CardinalityHeatmapProps {
  tableName?: string;
  columns?: { name: string; distinctCount: number; cardinalityType: 'HIGH' | 'MEDIUM' | 'LOW' }[];
  className?: string;
}

export const CardinalityHeatmap: React.FC<CardinalityHeatmapProps> = ({
  tableName = "public.users",
  columns = [
    { name: "id (UUID)", distinctCount: 1500000, cardinalityType: "HIGH" },
    { name: "email", distinctCount: 1489000, cardinalityType: "HIGH" },
    { name: "country_code", distinctCount: 195, cardinalityType: "MEDIUM" },
    { name: "subscription_tier", distinctCount: 4, cardinalityType: "LOW" },
    { name: "is_active", distinctCount: 2, cardinalityType: "LOW" },
  ],
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-purple-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-purple-400" />
          <span className="text-xs uppercase tracking-wider text-purple-400 font-bold">
            COLUMN CARDINALITY HEATMAP
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
          {tableName}
        </span>
      </div>

      <div className="space-y-2 font-mono text-xs">
        {columns.map((col, idx) => (
          <div key={idx} className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex justify-between items-center">
            <div>
              <span className="text-white font-bold">{col.name}</span>
              <span className="text-[10px] text-zinc-500 block">{col.distinctCount.toLocaleString()} distinct values</span>
            </div>
            <span
              className={`text-[10px] px-2 py-1 rounded font-bold ${
                col.cardinalityType === 'HIGH'
                  ? 'bg-purple-950 text-purple-300 border border-purple-500/30'
                  : col.cardinalityType === 'MEDIUM'
                  ? 'bg-sky-950 text-sky-300 border border-sky-500/30'
                  : 'bg-amber-950 text-amber-300 border border-amber-500/30'
              }`}
            >
              {col.cardinalityType} CARDINALITY
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
