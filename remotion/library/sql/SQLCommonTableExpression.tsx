import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface SQLCommonTableExpressionProps {
  cteName?: string;
  stepDescription?: string;
  className?: string;
}

export const SQLCommonTableExpression: React.FC<SQLCommonTableExpressionProps> = ({
  cteName = 'daily_aggregates',
  stepDescription = 'WITH daily_aggregates AS (SELECT date, count(*) FROM jobs GROUP BY date)',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-400 font-bold border border-indigo-500/30">
          COMMON TABLE EXPRESSION (CTE)
        </span>
        <span className="text-indigo-400 font-bold">WITH CLAUSE</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-5 flex flex-col justify-between font-mono">
        <div>
          <span className="text-indigo-400 font-black">WITH</span>{' '}
          <span className="text-emerald-400 font-bold">{cteName}</span>{' '}
          <span className="text-indigo-400 font-black">AS (</span>
        </div>

        <div className="p-3 bg-zinc-950 rounded border border-white/10 text-xs text-white/80 my-2">
          {stepDescription}
        </div>

        <div className="text-right text-indigo-400 font-black">) SELECT * FROM {cteName};</div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>READABLE MODULAR PIPELINE</span>
        <span>RECURSIVE CTE COMPATIBLE</span>
      </div>
    </div>
  );
};
