import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface PrivilegeEscalationGuardProps {
  unauthorizedUser?: string;
  attemptedPrivilege?: string;
  blockedTimestamp?: string;
  guardRule?: string;
  className?: string;
}

export const PrivilegeEscalationGuard: React.FC<PrivilegeEscalationGuardProps> = ({
  unauthorizedUser = "developer_dev_03",
  attemptedPrivilege = "ALTER ROLE developer_dev_03 WITH SUPERUSER;",
  blockedTimestamp = "2026-11-22T16:41:20Z",
  guardRule = "POLICY-PREVENT-SUPERUSER-ESCALATION",
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const pulse = Math.sin(frame / 5) * 0.2 + 0.8;

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-red-500/40 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
          <span className="text-xs uppercase tracking-wider text-red-400 font-bold">
            PRIVILEGE ESCALATION INTERCEPTED
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/30 font-bold" style={{ opacity: pulse }}>
          ACCESS DENIED
        </span>
      </div>

      <div className="p-3 rounded-xl bg-red-950/20 border border-red-500/30 font-mono text-xs mb-3">
        <div className="text-[10px] text-red-400 uppercase font-bold mb-1">Blocked Escalation Attempt</div>
        <code className="text-red-300 block line-through">{attemptedPrivilege}</code>
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-xs mb-3">
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Actor</div>
          <div className="text-white font-bold mt-0.5">{unauthorizedUser}</div>
        </div>

        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Guardrail Trigger</div>
          <div className="text-sky-400 font-bold mt-0.5 text-[11px]">{guardRule}</div>
        </div>
      </div>

      <div className="text-[10px] font-mono text-zinc-500 flex justify-between">
        <span>Security Officer Notified</span>
        <span>{blockedTimestamp}</span>
      </div>
    </div>
  );
};
