import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface DatabaseRolePermissionProps {
  roleName?: string;
  tableName?: string;
  permissions?: { priv: string; granted: boolean }[];
  className?: string;
}

export const DatabaseRolePermission: React.FC<DatabaseRolePermissionProps> = ({
  roleName = "app_readonly_analyst",
  tableName = "analytics.user_transactions",
  permissions = [
    { priv: "SELECT", granted: true },
    { priv: "INSERT", granted: false },
    { priv: "UPDATE", granted: false },
    { priv: "DELETE", granted: false },
    { priv: "TRUNCATE", granted: false },
    { priv: "REFERENCES", granted: false },
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
            ROLE PRIVILEGES & RBAC
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
          {roleName}
        </span>
      </div>

      <div className="text-xs font-mono text-zinc-400 mb-3">
        Privileges on: <span className="text-white font-bold">{tableName}</span>
      </div>

      <div className="grid grid-cols-3 gap-2 font-mono text-xs">
        {permissions.map((p, idx) => (
          <div
            key={idx}
            className={`p-2.5 rounded-xl border flex items-center justify-between ${
              p.granted
                ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-400'
                : 'bg-zinc-900/60 border-zinc-800 text-zinc-500 line-through'
            }`}
          >
            <span>{p.priv}</span>
            <span className="text-[10px] font-bold">{p.granted ? 'GRANT' : 'REVOKE'}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
