import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface TDEEncryptionAtRestProps {
  algorithm?: string;
  kmsKeyArn?: string;
  tablespace?: string;
  keyRotationDays?: number;
  className?: string;
}

export const TDEEncryptionAtRest: React.FC<TDEEncryptionAtRestProps> = ({
  algorithm = "AES-256-XTS",
  kmsKeyArn = "arn:aws:kms:us-east-1:123456789:key/db-tde-master",
  tablespace = "encrypted_ts_primary",
  keyRotationDays = 90,
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const pulse = Math.sin(frame / 6) * 0.15 + 0.85;

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-emerald-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" style={{ opacity: pulse }} />
          <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
            TRANSPARENT DATA ENCRYPTION (TDE)
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/20 font-bold">
          FIPS 140-3
        </span>
      </div>

      <div className="flex justify-between items-baseline mb-4 font-mono">
        <div>
          <span className="text-3xl font-extrabold text-white">{algorithm}</span>
          <span className="text-xs text-zinc-400 ml-2">Block Cipher</span>
        </div>
        <div className="text-right">
          <span className="text-xs text-zinc-400 block">Tablespace</span>
          <span className="text-sm font-bold text-emerald-400">{tablespace}</span>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-black/60 border border-zinc-800 font-mono text-xs text-zinc-300 mb-3 overflow-hidden text-ellipsis">
        <div className="text-[10px] text-zinc-500 uppercase mb-0.5">Master Key KMS Reference</div>
        <code>{kmsKeyArn}</code>
      </div>

      <div className="flex justify-between text-[10px] font-mono text-zinc-400">
        <span>Automatic Key Rotation: Every {keyRotationDays} Days</span>
        <span className="text-emerald-400 font-bold">Zero-Downtime Re-encryption</span>
      </div>
    </div>
  );
};
