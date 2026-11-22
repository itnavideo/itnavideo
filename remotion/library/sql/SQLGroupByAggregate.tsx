import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface SQLGroupByAggregateProps {
  groupByColumn?: string;
  aggregates?: { group: string; count: number; sum: string }[];
  className?: string;
}

export const SQLGroupByAggregate: React.FC<SQLGroupByAggregateProps> = ({
  groupByColumn = 'aspect_ratio',
  aggregates = [
    { group: '9:16 (Shorts/Reels)', count: 8420, sum: '124,500s' },
    { group: '16:9 (Widescreen)', count: 3210, sum: '89,400s' },
  ],
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
          GROUP BY AGGREGATION
        </span>
        <span className="text-white/40">SUMMARY BUCKETING</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-4 flex flex-col justify-between font-mono">
        <div className="text-xs">
          <span className="text-emerald-400 font-black">GROUP BY</span>{' '}
          <span className="text-white font-bold">{groupByColumn}</span>
        </div>

        <div className="space-y-2 my-2">
          {aggregates.map((a, i) => (
            <div key={i} className="p-2.5 bg-zinc-950 rounded border border-white/10 flex items-center justify-between text-xs">
              <span className="text-white font-bold">{a.group}</span>
              <div className="space-x-3 text-[11px]">
                <span className="text-emerald-400 font-bold">COUNT: {a.count.toLocaleString()}</span>
                <span className="text-sky-400">SUM: {a.sum}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>HASH AGGREGATE OPERATOR</span>
        <span>REDUCES ROW CARDINALITY</span>
      </div>
    </div>
  );
};
