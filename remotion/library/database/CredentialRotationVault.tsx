import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface CredentialRotationVaultProps {
  secretPath?: string;
  activeVersion?: string;
  rotationIntervalDays?: number;
  nextRotationCountdownDays?: number;
  className?: string;
}

export const CredentialRotationVault: React.FC<CredentialRotationVaultProps> = ({
  secretPath = "vault/database/creds/billing-service",
  activeVersion = "v4-dual-user-A",
  rotationIntervalDays = 30,
  nextRotationCountdownDays = 6,
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
            CREDENTIAL ROTATION VAULT
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-500/20 font-bold">
          AUTO-ROTATION ON
        </span>
      </div>

      <div className="p-3 rounded-xl bg-black/60 border border-zinc-800 font-mono text-xs mb-3">
        <div className="text-[10px] text-zinc-500 uppercase mb-0.5">Secret Vault Path</div>
        <code className="text-sky-300">{secretPath}</code>
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-xs mb-3">
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Active Credential Version</div>
          <div className="text-emerald-400 font-bold text-sm mt-1">{activeVersion}</div>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Next Scheduled Rotation</div>
          <div className="text-amber-400 font-bold text-sm mt-1">In {nextRotationCountdownDays} Days</div>
        </div>
      </div>

      <div className="text-[10px] font-mono text-zinc-400 flex justify-between">
        <span>Cadence: Every {rotationIntervalDays} Days</span>
        <span className="text-emerald-400 font-bold">Zero-Downtime Switchover</span>
      </div>
    </div>
  );
};
