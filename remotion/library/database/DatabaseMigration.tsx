import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

export interface DatabaseMigrationProps {
  migrationFile?: string;
  version?: string;
  className?: string;
}

export const DatabaseMigration: React.FC<DatabaseMigrationProps> = ({
  migrationFile = '20261122_add_render_analytics.sql',
  version = 'v2.4.12',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, 30], [0, 100], { extrapolateRight: 'clamp' });

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">
          DATABASE MIGRATION
        </span>
        <span className="text-white/40">{version}</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-5 flex flex-col justify-between font-mono">
        <div>
          <div className="text-sm font-bold text-white flex items-center space-x-2">
            <span className="text-emerald-400">⚡ APPLYING:</span>
            <span className="truncate">{migrationFile}</span>
          </div>
          <div className="text-xs text-white/50 mt-1">Status: Executing DDL within transactional migration lock</div>
        </div>

        <div className="space-y-1.5 my-2">
          <div className="flex justify-between text-xs">
            <span className="text-white/60">Migration Progress:</span>
            <span className="text-emerald-400 font-bold">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2.5 bg-zinc-950 rounded-full overflow-hidden border border-white/10">
            <div className="h-full bg-emerald-500 rounded-full transition-all duration-300" style={{ width: progress + '%' }} />
          </div>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>SCHEMA LOCK: EXCLUSIVE</span>
        <span>ROLLBACK SCRIPT VERIFIED</span>
      </div>
    </div>
  );
};
