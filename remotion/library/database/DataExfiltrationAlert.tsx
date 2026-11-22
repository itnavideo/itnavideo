import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface DataExfiltrationAlertProps {
  actor?: string;
  attemptedRows?: number;
  thresholdRows?: number;
  anomalyScore?: number;
  actionTaken?: string;
  className?: string;
}

export const DataExfiltrationAlert: React.FC<DataExfiltrationAlertProps> = ({
  actor = "unauthorized_script_pid_9120",
  attemptedRows = 850000,
  thresholdRows = 10000,
  anomalyScore = 98.4,
  actionTaken = "SESSION_TERMINATED & IP_BANNED",
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const pulse = Math.sin(frame / 4) * 0.2 + 0.8;

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-red-500/50 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
          <span className="text-xs uppercase tracking-wider text-red-400 font-bold">
            DATA EXFILTRATION ATTEMPT
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/30 font-bold" style={{ opacity: pulse }}>
          CRITICAL SEV-1
        </span>
      </div>

      <div className="flex justify-between items-baseline mb-3 font-mono">
        <div>
          <span className="text-4xl font-extrabold text-red-400">{attemptedRows.toLocaleString()}</span>
          <span className="text-xs text-zinc-400 ml-2">Rows Dump Requested</span>
        </div>
        <span className="text-xs font-bold text-amber-400">Limit: {thresholdRows.toLocaleString()} rows</span>
      </div>

      <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/30 font-mono text-xs mb-3">
        <div className="flex justify-between text-red-300">
          <span>Anomaly Score: {anomalyScore} / 100</span>
          <span className="font-bold">{actionTaken}</span>
        </div>
      </div>

      <div className="text-[10px] font-mono text-zinc-400 flex justify-between">
        <span>Actor: <span className="text-zinc-200">{actor}</span></span>
        <span className="text-red-400 font-bold">SOC Alert Pushed</span>
      </div>
    </div>
  );
};
