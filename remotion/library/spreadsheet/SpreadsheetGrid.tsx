import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface SpreadsheetGridProps {
  sheetTitle?: string;
  columns?: string[];
  rows?: { rowNum: number; cells: (string | number)[] }[];
  activeCell?: { row: number; col: number };
  className?: string;
}

export const SpreadsheetGrid: React.FC<SpreadsheetGridProps> = ({
  sheetTitle = "Q4 Financial Model.xlsx",
  columns = ["A (Region)", "B (Q3 Sales)", "C (Q4 Target)", "D (Growth)"],
  rows = [
    { rowNum: 1, cells: ["North America", "$450,000", "$520,000", "+15.5%"] },
    { rowNum: 2, cells: ["Europe & UK", "$380,000", "$440,000", "+15.8%"] },
    { rowNum: 3, cells: ["Asia Pacific", "$290,000", "$360,000", "+24.1%"] },
  ],
  activeCell = { row: 1, col: 3 },
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`p-5 rounded-2xl bg-zinc-950/95 border border-emerald-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5 mb-3 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
            EXCEL SPREADSHEET GRID
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-700">
          {sheetTitle}
        </span>
      </div>

      <div className="overflow-x-auto font-mono text-xs">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-zinc-900 text-zinc-400 border-b border-zinc-800">
              <th className="w-8 p-1.5 text-center border-r border-zinc-800 text-[10px]">#</th>
              {columns.map((c, i) => (
                <th key={i} className="p-1.5 text-left border-r border-zinc-800 font-semibold">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, rIdx) => (
              <tr key={rIdx} className="border-b border-zinc-850 hover:bg-zinc-900/40">
                <td className="p-1.5 text-center text-zinc-500 bg-zinc-900/60 border-r border-zinc-800 text-[10px]">
                  {r.rowNum}
                </td>
                {r.cells.map((cell, cIdx) => {
                  const isActive = activeCell && activeCell.row === rIdx && activeCell.col === cIdx;
                  return (
                    <td
                      key={cIdx}
                      className={`p-1.5 border-r border-zinc-800 text-zinc-200 ${
                        isActive ? 'bg-emerald-950/40 ring-2 ring-emerald-500 text-white font-bold' : ''
                      }`}
                    >
                      {cell}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
