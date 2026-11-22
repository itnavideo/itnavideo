import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface TableColumnProps {
  columnName?: string;
  dataType?: string;
  constraint?: string;
  className?: string;
}

export const TableColumn: React.FC<TableColumnProps> = ({
  columnName = 'aspect_ratio',
  dataType = 'VARCHAR(16)',
  constraint = 'CHECK (aspect_ratio IN ('16:9', '9:16'))',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-teal-500/20 text-teal-400 font-bold border border-teal-500/30">
          TABLE COLUMN ATTRIBUTE
        </span>
        <span className="text-white/40">SCHEMA ATTRIBUTE</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-5 flex flex-col justify-between">
        <div className="flex justify-between items-center">
          <div className="text-base font-bold text-white font-mono">{columnName}</div>
          <span className="px-2.5 py-1 rounded bg-teal-950 text-teal-300 font-mono text-xs border border-teal-700">
            {dataType}
          </span>
        </div>

        <div className="p-3 bg-zinc-950 rounded-lg border border-white/10 text-xs font-mono space-y-1.5 my-2">
          <div className="text-teal-400 font-bold text-[10px]">COLUMN CONSTRAINT:</div>
          <div className="text-white/80">{constraint}</div>
        </div>

        <div className="text-xs text-white/60 flex justify-between pt-2 border-t border-white/10 font-mono">
          <span>NULLABLE: FALSE</span>
          <span className="text-emerald-400">INDEXED: B-TREE</span>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>DEFAULT: '9:16'</span>
        <span>COLLATION: UTF-8</span>
      </div>
    </div>
  );
};
