import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface COUNTIFSFrequencyCardProps {
  range1?: string;
  range2?: string;
  countResult?: number;
  totalRecords?: number;
  className?: string;
}

export const COUNTIFSFrequencyCard: React.FC<COUNTIFSFrequencyCardProps> = ({
  range1 = "Deals[Stage] = 'Negotiation'",
  range2 = "Deals[Value] > $50,000",
  countResult = 34,
  totalRecords = 180,
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const percentage = ((countResult / totalRecords) * 100).toFixed(1);

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-sky-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-sky-400" />
          <span className="text-xs uppercase tracking-wider text-sky-400 font-bold">
            COUNTIFS (MULTI-CRITERIA COUNT)
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
          Statistical
        </span>
      </div>

      <div className="p-3 rounded-xl bg-black/60 border border-zinc-800 font-mono text-xs mb-3">
        <code>=COUNTIFS({range1}, {range2})</code>
      </div>

      <div className="flex justify-between items-baseline mb-2 font-mono">
        <div>
          <span className="text-4xl font-extrabold text-sky-400">{countResult}</span>
          <span className="text-xs text-zinc-400 ml-2">Matching Deals ({percentage}%)</span>
        </div>
        <span className="text-xs text-zinc-400">Total: {totalRecords} deals</span>
      </div>
    </div>
  );
};
