import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface TableBloatGaugeProps {
  tableName?: string;
  bloatPercent?: number;
  liveTuples?: number;
  deadTuples?: number;
  wastedStorageMB?: number;
  className?: string;
}

export const TableBloatGauge: React.FC<TableBloatGaugeProps> = ({
  tableName = "public.audit_events",
  bloatPercent = 38.5,
  liveTuples = 1450000,
  deadTuples = 560000,
  wastedStorageMB = 840,
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const animBloat = interpolate(frame, [0, 45], [0, bloatPercent], { extrapolateRight: 'clamp' });
  const isHigh = animBloat > 30;

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-red-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className={`w-2.5 h-2.5 rounded-full ${isHigh ? 'bg-red-400' : 'bg-emerald-400'}`} />
          <span className="text-xs uppercase tracking-wider text-red-400 font-bold">
            TABLE BLOAT ANALYSIS
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
          {tableName}
        </span>
      </div>

      <div className="flex justify-between items-baseline mb-2 font-mono">
        <div>
          <span className="text-4xl font-extrabold text-red-400">{animBloat.toFixed(1)}%</span>
          <span className="text-xs text-zinc-400 ml-2">Dead Tuple Bloat</span>
        </div>
        <span className="text-sm font-bold text-amber-400 font-mono">
          ~{wastedStorageMB} MB Wasted Space
        </span>
      </div>

      <div className="w-full bg-zinc-800 h-3 rounded-full overflow-hidden flex mb-4">
        <div className="h-full bg-emerald-500" style={{ width: `${100 - animBloat}%` }} />
        <div className="h-full bg-red-500" style={{ width: `${animBloat}%` }} />
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-xs">
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Live Tuples</div>
          <div className="text-emerald-400 font-bold text-base mt-1">{(liveTuples / 1000000).toFixed(2)}M</div>
          <div className="text-[10px] text-zinc-500">Active data records</div>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Dead Tuples</div>
          <div className="text-red-400 font-bold text-base mt-1">{(deadTuples / 1000).toFixed(0)}K</div>
          <div className="text-[10px] text-zinc-500">Awaiting VACUUM reclaim</div>
        </div>
      </div>
    </div>
  );
};
