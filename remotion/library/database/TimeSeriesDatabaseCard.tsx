import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface TimeSeriesDatabaseCardProps {
  engineName?: string;
  ingestRateOpsSec?: number;
  compressionRatio?: string;
  chunkIntervalHours?: number;
  className?: string;
}

export const TimeSeriesDatabaseCard: React.FC<TimeSeriesDatabaseCardProps> = ({
  engineName = "TimescaleDB / InfluxDB 3.0",
  ingestRateOpsSec = 450000,
  compressionRatio = "14.2x (Gorilla / Delta-of-Delta)",
  chunkIntervalHours = 24,
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const animIngest = interpolate(frame, [0, 45], [0, ingestRateOpsSec], { extrapolateRight: 'clamp' });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-sky-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-sky-400" />
          <span className="text-xs uppercase tracking-wider text-sky-400 font-bold">
            TIME-SERIES DATABASE (TSDB)
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
          Chunk: {chunkIntervalHours}h
        </span>
      </div>

      <div className="flex justify-between items-baseline mb-4 font-mono">
        <div>
          <span className="text-4xl font-extrabold text-sky-400">{(animIngest / 1000).toFixed(0)}k</span>
          <span className="text-xs text-zinc-400 ml-2">Metrics Ingest / Sec</span>
        </div>
        <span className="text-xs text-emerald-400 font-bold">{compressionRatio}</span>
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-xs">
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Engine</div>
          <div className="text-white font-bold text-sm mt-1">{engineName}</div>
          <div className="text-[10px] text-zinc-500">Continuous downsampling</div>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Retention Rollup</div>
          <div className="text-emerald-400 font-bold text-sm mt-1">1m -&gt; 1h -&gt; 1d</div>
          <div className="text-[10px] text-zinc-500">Automated bucket drops</div>
        </div>
      </div>
    </div>
  );
};
