import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface AutomatedRestoreVerificationProps {
  lastBackupDate?: string;
  sandboxNode?: string;
  integrityChecksPassed?: number;
  integrityChecksTotal?: number;
  className?: string;
}

export const AutomatedRestoreVerification: React.FC<AutomatedRestoreVerificationProps> = ({
  lastBackupDate = "2026-11-22 04:00:00 UTC",
  sandboxNode = "restore-sandbox-ephemeral-42",
  integrityChecksPassed = 24,
  integrityChecksTotal = 24,
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-emerald-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
            SYNTHETIC RESTORE VERIFICATION
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/20 font-bold">
          100% HEALTHY
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-xs mb-3">
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Restored Snapshot</div>
          <div className="text-white font-bold text-xs mt-1">{lastBackupDate}</div>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Verification Checks</div>
          <div className="text-emerald-400 font-bold text-sm mt-1">{integrityChecksPassed} / {integrityChecksTotal} Passed</div>
        </div>
      </div>

      <div className="text-[10px] font-mono text-zinc-400 flex justify-between">
        <span>Sandbox: {sandboxNode}</span>
        <span className="text-emerald-400 font-bold">Daily Automated DR Test Passed</span>
      </div>
    </div>
  );
};
