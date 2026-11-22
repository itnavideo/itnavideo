import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface PrimaryKeyProps {
  keyName?: string;
  tableName?: string;
  strategy?: string;
  className?: string;
}

export const PrimaryKey: React.FC<PrimaryKeyProps> = ({
  keyName = 'pk_users_id',
  tableName = 'public.users',
  strategy = 'UUIDv4 (gen_random_uuid())',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30 flex items-center space-x-1.5">
          <span>🔑</span>
          <span>PRIMARY KEY (PK)</span>
        </span>
        <span className="text-amber-400 font-bold">UNIQUE & NOT NULL</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-5 flex flex-col justify-between">
        <div>
          <div className="text-sm font-bold text-white font-mono">{keyName}</div>
          <div className="text-xs text-amber-400 font-mono mt-0.5">Constraint on {tableName}</div>
        </div>

        <div className="p-3 bg-zinc-950 rounded-lg border border-white/10 font-mono text-xs space-y-1">
          <div className="text-white/40 text-[10px]">GENERATION STRATEGY:</div>
          <div className="text-emerald-400 font-bold">{strategy}</div>
        </div>

        <div className="text-xs text-white/60 flex justify-between pt-2 border-t border-white/10 font-mono">
          <span>CLUSTER INDEX: CLUSTERED</span>
          <span className="text-amber-400 font-bold">CARDINALITY: 100% UNIQUE</span>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>ENFORCEMENT: HARDWARE / B-TREE</span>
        <span>INDEX ROOT SCAN: 0.1ms</span>
      </div>
    </div>
  );
};
