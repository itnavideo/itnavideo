import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface SchemaColumn {
  name: string;
  type: string;
  isPK?: boolean;
  isFK?: boolean;
  isIndexed?: boolean;
}

export interface SchemaTable {
  name: string;
  rowCount: string;
  columns: SchemaColumn[];
}

export interface DatabaseSchemaProps {
  databaseName?: string;
  migrationVersion?: string;
  tables?: SchemaTable[];
  className?: string;
}

const DEFAULT_TABLES: SchemaTable[] = [
  {
    name: 'users',
    rowCount: '14,280 rows',
    columns: [
      { name: 'id', type: 'UUID', isPK: true },
      { name: 'email', type: 'VARCHAR(255)', isIndexed: true },
      { name: 'credits_balance', type: 'INT4' },
      { name: 'created_at', type: 'TIMESTAMPTZ', isIndexed: true },
    ],
  },
  {
    name: 'render_jobs',
    rowCount: '92,410 rows',
    columns: [
      { name: 'id', type: 'UUID', isPK: true },
      { name: 'user_id', type: 'UUID', isFK: true, isIndexed: true },
      { name: 'video_type', type: 'VARCHAR(64)' },
      { name: 'render_status', type: 'VARCHAR(32)', isIndexed: true },
      { name: 'duration_seconds', type: 'INT4' },
    ],
  },
];

export const DatabaseSchema: React.FC<DatabaseSchemaProps> = ({
  databaseName = 'POSTGRESQL PRODUCTION INSTANCE (SUPABASE)',
  migrationVersion = 'MIGRATION: V2026_11_22__video_render_pipeline.sql',
  tables = DEFAULT_TABLES,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entry = spring({
    frame,
    fps,
    config: { damping: 14, mass: 1, stiffness: 80 },
  });

  return (
    <div
      className={`relative w-full max-w-5xl bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl select-none overflow-hidden ${className}`}
      style={{ opacity: entry }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-6">
        <div>
          <div className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-bold">
            RELATIONAL DATABASE SCHEMA
          </div>
          <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            {databaseName}
          </h3>
        </div>
        <span className="text-xs font-mono text-amber-400 font-bold">{migrationVersion}</span>
      </div>

      {/* Database Tables Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tables.map((tbl, idx) => {
          const itemSpring = spring({
            frame: Math.max(0, frame - idx * 6),
            fps,
            config: { damping: 12, mass: 0.8, stiffness: 90 },
          });

          return (
            <div
              key={tbl.name}
              className="bg-zinc-900 border border-zinc-700/80 rounded-xl overflow-hidden shadow-xl"
              style={{
                transform: `scale(${itemSpring})`,
                opacity: itemSpring,
              }}
            >
              <div className="bg-zinc-800/90 border-b border-zinc-700 px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-zinc-400 font-bold">TABLE:</span>
                  <span className="text-sm font-mono font-black text-zinc-100 uppercase">
                    public.{tbl.name}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">{tbl.rowCount}</span>
              </div>

              <div className="p-3 space-y-1.5 font-mono text-xs">
                {tbl.columns.map((col, cIdx) => (
                  <div
                    key={cIdx}
                    className="flex items-center justify-between px-2.5 py-1 rounded bg-zinc-950/70 border border-zinc-800/80"
                  >
                    <div className="flex items-center gap-2">
                      {col.isPK && (
                        <span className="bg-amber-500/20 text-amber-400 text-[9px] font-black px-1.5 py-0.5 rounded border border-amber-500/40">
                          PK
                        </span>
                      )}
                      {col.isFK && (
                        <span className="bg-sky-500/20 text-sky-400 text-[9px] font-black px-1.5 py-0.5 rounded border border-sky-500/40">
                          FK
                        </span>
                      )}
                      {col.isIndexed && (
                        <span className="bg-emerald-500/20 text-emerald-400 text-[9px] font-black px-1.5 py-0.5 rounded border border-emerald-500/40">
                          IDX
                        </span>
                      )}
                      <span className="text-zinc-200 font-bold">{col.name}</span>
                    </div>
                    <span className="text-zinc-500 text-[11px]">{col.type}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
