import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface TableRelationshipProps {
  parentTable?: string;
  childTable?: string;
  cardinality?: string;
  className?: string;
}

export const TableRelationship: React.FC<TableRelationshipProps> = ({
  parentTable = 'users',
  childTable = 'video_renders',
  cardinality = '1 : N (One-to-Many)',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-violet-500/20 text-violet-400 font-bold border border-violet-500/30">
          ENTITY RELATIONSHIP (ER)
        </span>
        <span className="text-white/40">{cardinality}</span>
      </div>

      <div className="flex-1 my-4 flex items-center justify-between space-x-4 font-mono">
        <div className="p-3 bg-zinc-900 border border-white/15 rounded-xl text-center flex-1">
          <div className="text-[10px] text-white/40 font-bold">PARENT ENTITY</div>
          <div className="text-sm font-bold text-white mt-1">⊞ {parentTable}</div>
          <div className="text-[10px] text-amber-400 mt-1">PK: id (1)</div>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-xs text-violet-400 font-bold">CROW'S FOOT</span>
          <div className="w-16 h-0.5 bg-violet-500 my-1" />
          <span className="text-[10px] text-white/40 font-mono">1 ───────&lt; N</span>
        </div>

        <div className="p-3 bg-zinc-900 border border-white/15 rounded-xl text-center flex-1">
          <div className="text-[10px] text-white/40 font-bold">CHILD ENTITY</div>
          <div className="text-sm font-bold text-white mt-1">⊞ {childTable}</div>
          <div className="text-[10px] text-sky-400 mt-1">FK: user_id (N)</div>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>REFERENTIAL INTEGRITY: STRICT</span>
        <span>FOREIGN KEY INDEXED</span>
      </div>
    </div>
  );
};
