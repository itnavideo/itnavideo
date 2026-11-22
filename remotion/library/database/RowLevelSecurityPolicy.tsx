import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface RowLevelSecurityPolicyProps {
  policyName?: string;
  tableName?: string;
  condition?: string;
  role?: string;
  action?: string;
  className?: string;
}

export const RowLevelSecurityPolicy: React.FC<RowLevelSecurityPolicyProps> = ({
  policyName = "tenant_isolation_policy",
  tableName = "public.customer_orders",
  condition = "tenant_id = current_setting('app.current_tenant_id')::uuid",
  role = "authenticated",
  action = "ALL (SELECT, INSERT, UPDATE, DELETE)",
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-indigo-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
          <span className="text-xs uppercase tracking-wider text-indigo-400 font-bold">
            ROW LEVEL SECURITY (RLS) POLICY
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/20 font-bold">
          RLS ENABLED
        </span>
      </div>

      <div className="space-y-2 font-mono text-xs mb-4">
        <div className="flex justify-between p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-zinc-400">Policy:</span>
          <span className="text-indigo-300 font-bold">{policyName}</span>
        </div>
        <div className="flex justify-between p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-zinc-400">Target Table:</span>
          <span className="text-zinc-200 font-bold">{tableName}</span>
        </div>
        <div className="p-3 rounded-xl bg-black/60 border border-zinc-800">
          <span className="text-[10px] text-zinc-400 uppercase block mb-1">USING Clause Expression</span>
          <code className="text-emerald-400 text-xs">{condition}</code>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 font-mono text-[10px] text-zinc-400">
        <div>Target Role: <span className="text-sky-400 font-bold">{role}</span></div>
        <div className="text-right">Action: <span className="text-amber-400 font-bold">{action}</span></div>
      </div>
    </div>
  );
};
