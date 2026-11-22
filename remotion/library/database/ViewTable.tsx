import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface ViewTableProps {
  viewName?: string;
  sqlQuery?: string;
  className?: string;
}

export const ViewTable: React.FC<ViewTableProps> = ({
  viewName = 'v_monthly_active_renderers',
  sqlQuery = 'CREATE VIEW v_monthly_active_renderers AS SELECT user_id, COUNT(*) FROM render_jobs GROUP BY user_id;',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">
          SQL VIRTUAL VIEW
        </span>
        <span className="text-white/40">LOGICAL PROJECTION</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-5 flex flex-col justify-between font-mono">
        <div>
          <div className="text-sm font-bold text-white">👁 {viewName}</div>
          <div className="text-xs text-blue-300 mt-0.5">Dynamic query projection without disk overhead</div>
        </div>

        <div className="p-3 bg-zinc-950 rounded border border-white/10 text-xs text-white/80 my-2 overflow-x-auto">
          <code>{sqlQuery}</code>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>SECURITY DEFINER: INVOKER RIGHTS</span>
        <span>ZERO DISK STORAGE</span>
      </div>
    </div>
  );
};
