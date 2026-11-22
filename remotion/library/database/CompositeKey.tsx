import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface CompositeKeyProps {
  columns?: string[];
  tableName?: string;
  className?: string;
}

export const CompositeKey: React.FC<CompositeKeyProps> = ({
  columns = ['tenant_id', 'subscription_id'],
  tableName = 'tenant_subscriptions',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-purple-500/20 text-purple-400 font-bold border border-purple-500/30">
          COMPOSITE KEY
        </span>
        <span className="text-white/40">MULTI-ATTRIBUTE IDENTIFIER</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-5 flex flex-col justify-between font-mono">
        <div>
          <div className="text-sm font-bold text-white">PRIMARY KEY ({columns.join(', ')})</div>
          <div className="text-xs text-white/50 mt-0.5">Table: {tableName}</div>
        </div>

        <div className="flex items-center justify-center space-x-3 my-3">
          {columns.map((c, i) => (
            <React.Fragment key={i}>
              <div className="px-3 py-2 rounded bg-purple-950/60 border border-purple-500/50 text-xs font-bold text-purple-300">
                {c}
              </div>
              {i < columns.length - 1 && <span className="text-white/40 font-black">+</span>}
            </React.Fragment>
          ))}
        </div>

        <div className="text-xs text-white/60 flex justify-between pt-2 border-t border-white/10">
          <span>JOINT UNIQUENESS GUARANTEED</span>
          <span className="text-purple-400">2-COLUMN TUPLE</span>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>MULTI-TENANT ISOLATION</span>
        <span>INDEX TYPE: COMPOSITE B-TREE</span>
      </div>
    </div>
  );
};
