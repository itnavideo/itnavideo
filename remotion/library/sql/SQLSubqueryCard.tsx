import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface SQLSubqueryCardProps {
  outerQuery?: string;
  innerQuery?: string;
  className?: string;
}

export const SQLSubqueryCard: React.FC<SQLSubqueryCardProps> = ({
  outerQuery = 'SELECT * FROM users WHERE id IN (...)',
  innerQuery = "SELECT DISTINCT user_id FROM render_jobs WHERE status = 'FAILED'",
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-purple-500/20 text-purple-400 font-bold border border-purple-500/30">
          NESTED SUBQUERY
        </span>
        <span className="text-white/40">INNER / OUTER EVAL</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-4 flex flex-col justify-between font-mono text-xs">
        <div>
          <div className="text-white/50 text-[10px] font-bold">OUTER QUERY:</div>
          <div className="text-white font-bold mt-0.5">{outerQuery}</div>
        </div>

        <div className="p-3 bg-purple-950/40 border border-purple-500/50 rounded-lg my-2">
          <div className="text-purple-300 text-[10px] font-bold">INNER SUBQUERY EVALUATION:</div>
          <div className="text-emerald-400 font-bold mt-0.5">{innerQuery}</div>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>EVALUATED BEFORE OUTER ENCLOSURE</span>
        <span>SEMI-JOIN OPTIMIZED</span>
      </div>
    </div>
  );
};
