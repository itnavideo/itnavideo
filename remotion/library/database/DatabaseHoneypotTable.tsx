import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface DatabaseHoneypotTableProps {
  decoyTableName?: string;
  triggerEvent?: string;
  attackerIp?: string;
  quarantineStatus?: string;
  className?: string;
}

export const DatabaseHoneypotTable: React.FC<DatabaseHoneypotTableProps> = ({
  decoyTableName = "shadow_master_keys_decoy",
  triggerEvent = "SELECT * FROM shadow_master_keys_decoy",
  attackerIp = "198.51.100.74",
  quarantineStatus = "IP_QUARANTINED_BGP_NULLROUTED",
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const pulse = Math.sin(frame / 4) * 0.2 + 0.8;

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-amber-500/40 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
          <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
            HONEYPOT TRAP TRIGGERED
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/30 font-bold" style={{ opacity: pulse }}>
          INTRUSION DETECTED
        </span>
      </div>

      <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 font-mono text-xs mb-3">
        <div className="text-[10px] text-amber-400 uppercase font-bold mb-1">Decoy Table Probed</div>
        <code className="text-amber-200 block">{decoyTableName}</code>
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-xs mb-3">
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Intruder IP</div>
          <div className="text-red-400 font-bold mt-0.5">{attackerIp}</div>
        </div>

        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Response Action</div>
          <div className="text-emerald-400 font-bold mt-0.5 text-[11px]">{quarantineStatus}</div>
        </div>
      </div>

      <div className="text-[10px] font-mono text-zinc-400 flex justify-between">
        <span>Zero legitimate queries expected</span>
        <span className="text-red-400 font-bold">Immediate Containment</span>
      </div>
    </div>
  );
};
