import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface SessionKillCircuitBreakerProps {
  terminatedPid?: number;
  reason?: string;
  queryDurationSec?: number;
  initiatedBy?: string;
  className?: string;
}

export const SessionKillCircuitBreaker: React.FC<SessionKillCircuitBreakerProps> = ({
  terminatedPid = 14209,
  reason = "EXCEEDED_IDLE_IN_TRANSACTION_LIMIT",
  queryDurationSec = 3600,
  initiatedBy = "db_watchdog_daemon",
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-red-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs uppercase tracking-wider text-red-400 font-bold">
            SESSION KILL CIRCUIT BREAKER
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/20 font-bold">
          TERMINATED
        </span>
      </div>

      <div className="p-3 rounded-xl bg-black/60 border border-zinc-800 font-mono text-xs mb-3">
        <div className="text-[10px] text-zinc-500 uppercase mb-0.5">Execution Command</div>
        <code className="text-red-400 font-bold">SELECT pg_terminate_backend({terminatedPid});</code>
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-xs mb-3">
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Termination Reason</div>
          <div className="text-amber-400 font-bold text-xs mt-1">{reason}</div>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Duration Before Kill</div>
          <div className="text-red-400 font-bold text-sm mt-1">{queryDurationSec}s</div>
        </div>
      </div>

      <div className="text-[10px] font-mono text-zinc-400 flex justify-between">
        <span>Triggered By: {initiatedBy}</span>
        <span className="text-emerald-400 font-bold">Resources Reclaimed</span>
      </div>
    </div>
  );
};
