import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface BackupEncryptionVerificationProps {
  backupSnapshotName?: string;
  backupSizeBytesGB?: number;
  encryptionKeyType?: string;
  checksumSha256?: string;
  className?: string;
}

export const BackupEncryptionVerification: React.FC<BackupEncryptionVerificationProps> = ({
  backupSnapshotName = "pg_dump_production_20261122.sql.gz.enc",
  backupSizeBytesGB = 142.5,
  encryptionKeyType = "KMS Customer-Managed Key (CMK)",
  checksumSha256 = "6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b",
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
            BACKUP ENCRYPTION VERIFICATION
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/20 font-bold">
          ENCRYPTED S3
        </span>
      </div>

      <div className="p-3 rounded-xl bg-black/60 border border-zinc-800 font-mono text-xs mb-3">
        <div className="text-[10px] text-zinc-500 uppercase mb-0.5">Snapshot Object</div>
        <code className="text-zinc-200 text-xs">{backupSnapshotName}</code>
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-xs mb-3">
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Snapshot Size</div>
          <div className="text-white font-bold text-sm mt-1">{backupSizeBytesGB} GB</div>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Encryption Cipher</div>
          <div className="text-emerald-400 font-bold text-xs mt-1">{encryptionKeyType}</div>
        </div>
      </div>

      <div className="text-[10px] font-mono text-zinc-500 flex justify-between">
        <span>SHA-256: {checksumSha256.slice(0, 24)}...</span>
        <span className="text-emerald-400 font-bold">Integrity Verified</span>
      </div>
    </div>
  );
};
