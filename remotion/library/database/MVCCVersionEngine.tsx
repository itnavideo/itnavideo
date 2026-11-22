import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface MVCCVersionEngineProps {
  xmin?: number;
  xmax?: string;
  className?: string;
}

export const MVCCVersionEngine: React.FC<MVCCVersionEngineProps> = ({
  xmin = 10420,
  xmax = '0 (Live Tuple)',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-teal-500/20 text-teal-400 font-bold border border-teal-500/30">
          MVCC CONCURRENCY ENGINE
        </span>
        <span className="text-emerald-400 font-bold">READS NEVER BLOCK WRITES</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-5 flex flex-col justify-between font-mono">
        <div>
          <div className="text-sm font-bold text-white">Tuple Visibility Snapshot</div>
          <div className="text-xs text-white/50 mt-0.5">Multi-Version Concurrency Control isolation</div>
        </div>

        <div className="grid grid-cols-2 gap-3 my-2">
          <div className="p-3 bg-zinc-950 rounded border border-white/10 text-center">
            <div className="text-[10px] text-white/40">XMIN (CREATOR TX)</div>
            <div className="text-base font-bold text-teal-300 mt-1">tx_{xmin}</div>
          </div>
          <div className="p-3 bg-zinc-950 rounded border border-white/10 text-center">
            <div className="text-[10px] text-white/40">XMAX (DELETER TX)</div>
            <div className="text-base font-bold text-emerald-400 mt-1">{xmax}</div>
          </div>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>SNAPSHOT ISOLATION: REPEATABLE READ</span>
        <span>POSTGRES ENGINE SPEC</span>
      </div>
    </div>
  );
};
