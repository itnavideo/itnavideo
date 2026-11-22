import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface TableCellProps {
  cellValue?: string;
  columnName?: string;
  isModified?: boolean;
  className?: string;
}

export const TableCell: React.FC<TableCellProps> = ({
  cellValue = '"https://cdn.itnavideo.com/renders/v8402.mp4"',
  columnName = 'output_url',
  isModified = false,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-purple-500/20 text-purple-400 font-bold border border-purple-500/30">
          ATOMIC TABLE CELL
        </span>
        <span className="text-white/40">FIELD VALUE</span>
      </div>

      <div className="flex-1 my-4 flex flex-col items-center justify-center space-y-3 font-mono">
        <div className="text-xs text-white/50">{columnName}</div>
        <div className="p-4 bg-zinc-900 border border-purple-500/40 rounded-xl text-center max-w-sm">
          <span className="text-sm font-bold text-purple-300 break-all">{cellValue}</span>
        </div>
        <div className="text-[10px] text-emerald-400 font-bold">TYPE: TEXT (URL STRING)</div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>NULL CHECK: PASS</span>
        <span>BYTE LENGTH: 48</span>
      </div>
    </div>
  );
};
