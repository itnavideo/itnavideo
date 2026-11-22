import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface SchemaNamespaceProps {
  namespaceName?: string;
  tableCount?: number;
  description?: string;
  className?: string;
}

export const SchemaNamespace: React.FC<SchemaNamespaceProps> = ({
  namespaceName = 'billing',
  tableCount = 8,
  description = 'Isolated schema for Stripe subscriptions, invoices, and credit ledger',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30 flex items-center space-x-1.5">
          <span>📁</span>
          <span>SCHEMA NAMESPACE</span>
        </span>
        <span className="text-white/40">{tableCount} TABLES</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-5 flex flex-col justify-between font-mono">
        <div>
          <div className="text-lg font-bold text-white">{namespaceName}.*</div>
          <div className="text-xs text-white/60 mt-1">{description}</div>
        </div>

        <div className="p-3 bg-zinc-950 rounded border border-white/10 text-xs space-y-1">
          <div className="text-amber-400 font-bold text-[10px]">SEARCH PATH:</div>
          <div className="text-white/90">SET search_path TO {namespaceName}, public;</div>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>ROLE PERMISSIONS: GRANT SELECT, INSERT</span>
        <span>LOGICAL MULTI-TENANCY</span>
      </div>
    </div>
  );
};
