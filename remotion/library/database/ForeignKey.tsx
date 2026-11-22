import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface ForeignKeyProps {
  sourceColumn?: string;
  targetReference?: string;
  onDelete?: string;
  className?: string;
}

export const ForeignKey: React.FC<ForeignKeyProps> = ({
  sourceColumn = 'render_jobs.user_id',
  targetReference = 'auth.users(id)',
  onDelete = 'ON DELETE CASCADE',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-sky-500/20 text-sky-400 font-bold border border-sky-500/30 flex items-center space-x-1.5">
          <span>🔗</span>
          <span>FOREIGN KEY (FK)</span>
        </span>
        <span className="text-white/40">REFERENTIAL INTEGRITY</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-5 flex flex-col justify-between font-mono">
        <div className="flex items-center justify-between">
          <div className="text-xs text-white/90">
            <span className="text-sky-400 font-bold">{sourceColumn}</span>
          </div>
          <span className="text-white/40">──REFERENCES──▶</span>
          <div className="text-xs text-emerald-400 font-bold">
            {targetReference}
          </div>
        </div>

        <div className="p-3 bg-zinc-950 rounded-lg border border-white/10 text-xs mt-3">
          <span className="text-sky-300 font-bold">REFERENTIAL ACTION: </span>
          <span className="text-rose-400 font-mono font-bold">{onDelete}</span>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>INTEGRITY CHECK: DEFERRED / IMMEDIATE</span>
        <span>PARENT-CHILD SYNC</span>
      </div>
    </div>
  );
};
