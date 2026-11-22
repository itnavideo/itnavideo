import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface DataSparsityMatrixProps {
  totalCellsMillion?: number;
  nonZeroDensityPercent?: number;
  compressionGain?: string;
  className?: string;
}

export const DataSparsityMatrix: React.FC<DataSparsityMatrixProps> = ({
  totalCellsMillion = 120,
  nonZeroDensityPercent = 4.2,
  compressionGain = "8.4x (CSR / COO Sparse Storage)",
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
            DATA SPARSITY MATRIX
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/20 font-bold">
          SPARSE ENCODED
        </span>
      </div>

      <div className="flex justify-between items-baseline mb-3 font-mono">
        <div>
          <span className="text-4xl font-extrabold text-purple-400">{nonZeroDensityPercent}%</span>
          <span className="text-xs text-zinc-400 ml-2">Non-Zero Density</span>
        </div>
        <span className="text-xs text-emerald-400 font-bold">{compressionGain}</span>
      </div>

      <div className="text-[10px] font-mono text-zinc-400 flex justify-between border-t border-zinc-800/80 pt-2">
        <span>Matrix Size: {totalCellsMillion}M Cells</span>
        <span className="text-purple-300 font-bold">Zero-Value Skipping</span>
      </div>
    </div>
  );
};
