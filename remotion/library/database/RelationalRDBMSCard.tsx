import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface RelationalRDBMSCardProps {
  engineName?: string;
  acidCompliance?: string;
  schemaType?: string;
  isolationLevel?: string;
  className?: string;
}

export const RelationalRDBMSCard: React.FC<RelationalRDBMSCardProps> = ({
  engineName = "PostgreSQL 16 Enterprise",
  acidCompliance = "FULL ACID COMPLIANT",
  schemaType = "Strict Normalized (3NF)",
  isolationLevel = "Serializable / Read Committed",
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
            RELATIONAL RDBMS ENGINE
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/20 font-bold">
          {acidCompliance}
        </span>
      </div>

      <div className="flex justify-between items-baseline mb-4 font-mono">
        <div>
          <span className="text-2xl font-bold text-white">{engineName}</span>
          <span className="text-xs text-zinc-400 ml-2">SQL Standard</span>
        </div>
        <span className="text-xs text-sky-300 font-bold font-mono">Codd Relational Model</span>
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-xs mb-3">
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Schema Model</div>
          <div className="text-white font-bold text-sm mt-1">{schemaType}</div>
          <div className="text-[10px] text-zinc-500">Foreign key constraints</div>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Default Isolation</div>
          <div className="text-emerald-400 font-bold text-sm mt-1">{isolationLevel}</div>
          <div className="text-[10px] text-zinc-500">MVCC concurrency</div>
        </div>
      </div>

      <div className="text-[10px] font-mono text-zinc-400 flex justify-between">
        <span>Workload: OLTP / Transactional</span>
        <span className="text-emerald-400 font-bold">Strong Consistency (CP)</span>
      </div>
    </div>
  );
};
