import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface ExcelFormulaBarProps {
  cellReference?: string;
  formulaText?: string;
  calculatedValue?: string | number;
  className?: string;
}

export const ExcelFormulaBar: React.FC<ExcelFormulaBarProps> = ({
  cellReference = "C4",
  formulaText = "=SUM(C2:C3) * 1.18",
  calculatedValue = "$14,850.00",
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`p-4 rounded-xl bg-zinc-950 border border-emerald-500/40 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center space-x-2 font-mono text-xs mb-2">
        <div className="w-16 px-3 py-1 rounded bg-zinc-900 border border-zinc-700 text-center font-bold text-emerald-400">
          {cellReference}
        </div>
        <div className="w-8 h-7 rounded bg-zinc-900 border border-zinc-700 flex items-center justify-center font-serif italic font-bold text-zinc-400">
          fx
        </div>
        <div className="flex-1 px-3 py-1 rounded bg-zinc-900 border border-emerald-500/50 text-emerald-300 font-bold overflow-hidden text-ellipsis whitespace-nowrap">
          {formulaText}
        </div>
      </div>

      <div className="flex justify-between items-center text-[11px] font-mono text-zinc-400 border-t border-zinc-800 pt-2 px-1">
        <span>Evaluated Result:</span>
        <span className="text-white font-bold bg-zinc-900 px-2 py-0.5 rounded border border-zinc-700">
          {calculatedValue}
        </span>
      </div>
    </div>
  );
};
