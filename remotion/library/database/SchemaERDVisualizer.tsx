import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface SchemaERDVisualizerProps {
  primaryTable?: string;
  relatedTables?: { name: string; foreignKey: string; relationship: string }[];
  className?: string;
}

export const SchemaERDVisualizer: React.FC<SchemaERDVisualizerProps> = ({
  primaryTable = "users (id PK)",
  relatedTables = [
    { name: "orders", foreignKey: "user_id -> users.id", relationship: "1:N" },
    { name: "subscriptions", foreignKey: "user_id -> users.id", relationship: "1:1" },
    { name: "audit_logs", foreignKey: "actor_id -> users.id", relationship: "1:N" },
  ],
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-sky-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-sky-400" />
          <span className="text-xs uppercase tracking-wider text-sky-400 font-bold">
            ENTITY-RELATIONSHIP (ERD) GRAPH
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/20 font-bold">
          3 RELATIONSHIPS
        </span>
      </div>

      <div className="p-3 rounded-xl bg-sky-950/30 border border-sky-500/30 font-mono text-xs mb-3 text-center">
        <span className="text-[10px] text-sky-400 uppercase block">Root Entity</span>
        <span className="text-white font-bold text-sm">{primaryTable}</span>
      </div>

      <div className="space-y-2 font-mono text-xs">
        {relatedTables.map((r, idx) => (
          <div key={idx} className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex justify-between items-center">
            <div>
              <span className="text-white font-bold">{r.name}</span>
              <span className="text-[10px] text-zinc-500 block">{r.foreignKey}</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-sky-300 font-bold">
              {r.relationship}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
