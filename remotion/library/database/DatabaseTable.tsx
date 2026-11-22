import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface DatabaseTableProps {
  tableName?: string;
  rowCount?: string;
  columns?: { name: string; type: string; isPk?: boolean }[];
  className?: string;
}

export const DatabaseTable: React.FC<DatabaseTableProps> = ({
  tableName = 'render_jobs',
  rowCount = '1,420,850 rows',
  columns = [
    { name: 'id', type: 'UUID', isPk: true },
    { name: 'user_id', type: 'UUID' },
    { name: 'template_id', type: 'VARCHAR(64)' },
    { name: 'status', type: 'VARCHAR(32)' },
    { name: 'created_at', type: 'TIMESTAMPTZ' },
  ],
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-400 font-bold border border-indigo-500/30">
          RELATIONAL TABLE
        </span>
        <span className="text-white/40">{rowCount}</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl overflow-hidden flex flex-col">
        <div className="bg-zinc-800/80 px-4 py-2 border-b border-white/10 flex items-center justify-between font-mono">
          <span className="text-xs font-bold text-white flex items-center space-x-1.5">
            <span>⊞</span>
            <span>{tableName}</span>
          </span>
          <span className="text-[10px] text-indigo-300">PUBLIC SCHEMA</span>
        </div>

        <div className="divide-y divide-white/5 p-2 font-mono text-xs">
          {columns.map((c, i) => (
            <div key={i} className="flex items-center justify-between py-1.5 px-2 hover:bg-white/5 rounded">
              <div className="flex items-center space-x-2">
                {c.isPk && <span className="text-amber-400 text-[10px] font-bold">🔑 PK</span>}
                <span className="text-white/90">{c.name}</span>
              </div>
              <span className="text-[10px] text-white/40">{c.type}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>ROW-LEVEL SECURITY (RLS): ENABLED</span>
        <span>POSTGRES HEAP</span>
      </div>
    </div>
  );
};
