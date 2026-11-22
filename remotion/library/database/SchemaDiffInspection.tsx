import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface SchemaDiffInspectionProps {
  envA?: string;
  envB?: string;
  diffCount?: number;
  className?: string;
}

export const SchemaDiffInspection: React.FC<SchemaDiffInspectionProps> = ({
  envA = 'Staging Schema',
  envB = 'Production Schema',
  diffCount = 0,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-400 font-bold border border-indigo-500/30">
          SCHEMA DIFF INSPECTION
        </span>
        <span className="text-emerald-400 font-bold">ZERO DRIFT</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-5 flex flex-col justify-between font-mono">
        <div>
          <div className="text-sm font-bold text-white">Comparing {envA} ↔ {envB}</div>
          <div className="text-xs text-emerald-400 mt-1">{diffCount} Schema Divergences Detected</div>
        </div>

        <div className="p-3 bg-zinc-950 rounded border border-white/10 text-xs text-white/80 my-2">
          All tables, indexes, RLS policies, and triggers perfectly matched.
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>CI/CD PIPELINE VERIFIED</span>
        <span>DEPLOY SAFE</span>
      </div>
    </div>
  );
};
