import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface LeastPrivilegeEnforcerProps {
  userRole?: string;
  excessivePrivileges?: string[];
  recommendedRole?: string;
  riskLevel?: string;
  className?: string;
}

export const LeastPrivilegeEnforcer: React.FC<LeastPrivilegeEnforcerProps> = ({
  userRole = "frontend_web_app",
  excessivePrivileges = ["DROP TABLE", "ALTER TABLE", "SUPERUSER"],
  recommendedRole = "restricted_crud_app_role",
  riskLevel = "HIGH RISK",
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-amber-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
            LEAST PRIVILEGE AUDITOR (PoLP)
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/20 font-bold">
          {riskLevel}
        </span>
      </div>

      <div className="text-xs font-mono text-zinc-400 mb-2">
        Overprivileged Account: <span className="text-white font-bold">{userRole}</span>
      </div>

      <div className="p-3 rounded-xl bg-red-950/20 border border-red-500/30 font-mono text-xs mb-3">
        <div className="text-[10px] text-red-400 uppercase font-bold mb-1">Excessive Privileges Detected</div>
        <div className="flex flex-wrap gap-1.5 mt-1">
          {excessivePrivileges.map((p, idx) => (
            <span key={idx} className="px-2 py-0.5 rounded bg-red-900/60 text-red-200 border border-red-500/30 text-[10px]">
              {p}
            </span>
          ))}
        </div>
      </div>

      <div className="text-[10px] font-mono text-zinc-400 flex justify-between">
        <span>Remedy: Migrate to</span>
        <span className="text-emerald-400 font-bold">{recommendedRole}</span>
      </div>
    </div>
  );
};
