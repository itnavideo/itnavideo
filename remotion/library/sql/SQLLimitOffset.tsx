import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface SQLLimitOffsetProps {
  limit?: number;
  offset?: number;
  page?: number;
  className?: string;
}

export const SQLLimitOffset: React.FC<SQLLimitOffsetProps> = ({
  limit = 20,
  offset = 40,
  page = 3,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-teal-500/20 text-teal-400 font-bold border border-teal-500/30">
          LIMIT & OFFSET PAGINATION
        </span>
        <span className="text-teal-400 font-bold">PAGE {page}</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-5 flex flex-col justify-between font-mono">
        <div className="text-sm">
          <span className="text-teal-400 font-black">LIMIT</span> <span className="text-white font-bold">{limit}</span>{' '}
          <span className="text-teal-400 font-black">OFFSET</span> <span className="text-white font-bold">{offset};</span>
        </div>

        <div className="p-3 bg-zinc-950 rounded border border-white/10 flex items-center justify-around my-2 text-center text-xs">
          <div>
            <div className="text-[10px] text-white/40">SKIPPED TUPLES</div>
            <div className="text-sm font-bold text-rose-400 mt-0.5">{offset} Rows</div>
          </div>
          <span className="text-white/20">|</span>
          <div>
            <div className="text-[10px] text-white/40">FETCHED WINDOW</div>
            <div className="text-sm font-bold text-emerald-400 mt-0.5">{limit} Rows</div>
          </div>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>CURSOR PAGINATION RECOMMENDED FOR SCALE</span>
        <span>ZERO OVER-FETCHING</span>
      </div>
    </div>
  );
};
