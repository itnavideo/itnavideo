import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface DatabaseAuditLogProps {
  actor?: string;
  clientIp?: string;
  eventAction?: string;
  statement?: string;
  timestamp?: string;
  eventHash?: string;
  className?: string;
}

export const DatabaseAuditLog: React.FC<DatabaseAuditLogProps> = ({
  actor = "db_admin_svc",
  clientIp = "192.168.10.42",
  eventAction = "DDL_ALTER_TABLE",
  statement = "ALTER TABLE users ADD COLUMN mfa_enabled BOOLEAN DEFAULT true;",
  timestamp = "2026-11-22T16:40:00Z",
  eventHash = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-purple-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-purple-400" />
          <span className="text-xs uppercase tracking-wider text-purple-400 font-bold">
            AUDIT COMPLIANCE EVENT
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/20 font-bold">
          SOC2 / HIPAA
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 font-mono text-xs mb-3">
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Actor</div>
          <div className="text-white font-bold mt-0.5">{actor}</div>
        </div>
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Action</div>
          <div className="text-amber-400 font-bold mt-0.5">{eventAction}</div>
        </div>
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Source IP</div>
          <div className="text-sky-400 font-bold mt-0.5">{clientIp}</div>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-black/60 border border-zinc-800 font-mono text-xs mb-3">
        <div className="text-[10px] text-zinc-500 uppercase mb-0.5">Executed Statement</div>
        <code className="text-zinc-200">{statement}</code>
      </div>

      <div className="text-[10px] font-mono text-zinc-500 flex justify-between">
        <span>Hash: {eventHash.slice(0, 20)}...</span>
        <span>{timestamp}</span>
      </div>
    </div>
  );
};
