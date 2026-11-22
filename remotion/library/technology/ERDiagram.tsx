import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface ERField {
  name: string;
  type: string;
  isPK?: boolean;
  isFK?: boolean;
}

export interface EREntity {
  tableName: string;
  fields: ERField[];
}

export interface ERDiagramProps {
  title?: string;
  entities?: EREntity[];
  className?: string;
}

const DEFAULT_ENTITIES: EREntity[] = [
  {
    tableName: 'users',
    fields: [
      { name: 'id', type: 'UUID', isPK: true },
      { name: 'email', type: 'VARCHAR(255)' },
      { name: 'credits_balance', type: 'INTEGER' },
      { name: 'created_at', type: 'TIMESTAMPTZ' },
    ],
  },
  {
    tableName: 'render_jobs',
    fields: [
      { name: 'id', type: 'UUID', isPK: true },
      { name: 'user_id', type: 'UUID', isFK: true },
      { name: 'video_type', type: 'VARCHAR(64)' },
      { name: 'render_status', type: 'VARCHAR(32)' },
      { name: 'output_s3_url', type: 'TEXT' },
    ],
  },
];

export const ERDiagram: React.FC<ERDiagramProps> = ({
  title = 'SUPABASE RELATIONAL ENTITY SCHEMA (ERD)',
  entities = DEFAULT_ENTITIES,
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
            POSTGRESQL DATA MODEL
          </div>
          <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            {title}
          </h3>
        </div>
        <span className="text-xs font-mono text-zinc-500 font-bold">1 : N RELATIONSHIPS</span>
      </div>

      {/* Relational Table Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        {entities.map((ent, idx) => {
          const itemSpring = spring({
            frame: Math.max(0, frame - idx * 6),
            fps,
            config: { damping: 12, mass: 0.8, stiffness: 90 },
          });

          return (
            <div
              key={ent.tableName}
              className="bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden shadow-xl"
              style={{
                transform: `scale(${itemSpring})`,
                opacity: itemSpring,
              }}
            >
              {/* Table Name Header */}
              <div className="bg-zinc-800/90 border-b border-zinc-700 px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 font-mono text-xs font-bold">TABLE:</span>
                  <span className="text-sm font-mono font-black text-zinc-100 uppercase">
                    public.{ent.tableName}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400 font-semibold">RLS ENABLED</span>
              </div>

              {/* Columns List */}
              <div className="p-3 space-y-1.5 font-mono text-xs">
                {ent.fields.map((f, fIdx) => (
                  <div
                    key={fIdx}
                    className="flex items-center justify-between px-2 py-1 rounded bg-zinc-950/60 border border-zinc-800/80"
                  >
                    <div className="flex items-center gap-2">
                      {f.isPK && (
                        <span className="bg-amber-500/20 text-amber-400 text-[9px] font-black px-1.5 py-0.5 rounded border border-amber-500/40">
                          PK
                        </span>
                      )}
                      {f.isFK && (
                        <span className="bg-sky-500/20 text-sky-400 text-[9px] font-black px-1.5 py-0.5 rounded border border-sky-500/40">
                          FK
                        </span>
                      )}
                      <span className="text-zinc-200 font-bold">{f.name}</span>
                    </div>
                    <span className="text-zinc-500 text-[11px]">{f.type}</span>
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
