import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface TableRowProps {
  tupleId?: string;
  fields?: { key: string; value: string }[];
  className?: string;
}

export const TableRow: React.FC<TableRowProps> = ({
  tupleId = 'Row #4092',
  fields = [
    { key: 'id', value: 'f81d4fae-7dec-11d0' },
    { key: 'user_id', value: 'usr_9402a' },
    { key: 'status', value: 'COMPLETED' },
    { key: 'render_sec', value: '42.8s' },
  ],
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-sky-500/20 text-sky-400 font-bold border border-sky-500/30">
          DATABASE TUPLE RECORD
        </span>
        <span className="text-white/40">{tupleId}</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-4 flex flex-col justify-center">
        <div className="grid grid-cols-4 gap-2 font-mono">
          {fields.map((f, i) => (
            <div key={i} className="p-2.5 bg-zinc-950 rounded border border-white/5 text-center">
              <div className="text-[10px] text-white/40 font-bold">{f.key}</div>
              <div className="text-xs text-sky-300 font-semibold mt-1 truncate">{f.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>STORAGE: 184 BYTES</span>
        <span>STATUS: COMMITTED (MVCC)</span>
      </div>
    </div>
  );
};
