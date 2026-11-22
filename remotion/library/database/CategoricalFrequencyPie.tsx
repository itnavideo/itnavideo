import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface CategoricalFrequencyPieProps {
  columnName?: string;
  categories?: { label: string; percentage: number; count: number }[];
  className?: string;
}

export const CategoricalFrequencyPie: React.FC<CategoricalFrequencyPieProps> = ({
  columnName = "payment_method",
  categories = [
    { label: "Credit Card (Stripe)", percentage: 54.2, count: 54200 },
    { label: "Apple Pay", percentage: 24.8, count: 24800 },
    { label: "PayPal", percentage: 14.5, count: 14500 },
    { label: "Bank Transfer", percentage: 6.5, count: 6500 },
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
            CATEGORICAL FREQUENCY BREAKDOWN
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
          {columnName}
        </span>
      </div>

      <div className="space-y-2 font-mono text-xs">
        {categories.map((c, idx) => (
          <div key={idx} className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex justify-between items-center">
            <span className="text-white font-bold">{c.label}</span>
            <span className="text-emerald-400 font-bold">{c.percentage}% ({c.count.toLocaleString()})</span>
          </div>
        ))}
      </div>
    </div>
  );
};
