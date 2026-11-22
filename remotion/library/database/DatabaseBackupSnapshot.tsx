import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface DatabaseBackupSnapshotProps {
  retentionDays?: number;
  lastSnapshot?: string;
  className?: string;
}

export const DatabaseBackupSnapshot: React.FC<DatabaseBackupSnapshotProps> = ({
  retentionDays = 30,
  lastSnapshot = 'Today at 03:00 AM UTC',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
          PITR CONTINUOUS BACKUPS
        </span>
        <span className="text-white/40">{retentionDays}-DAY WINDOW</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-5 flex flex-col justify-between font-mono">
        <div>
          <div className="text-base font-bold text-white">Point-In-Time Recovery (PITR)</div>
          <div className="text-xs text-emerald-400 mt-0.5">Continuous WAL archiving to AWS S3 Glacier</div>
        </div>

        <div className="grid grid-cols-2 gap-3 my-2">
          <div className="p-3 bg-zinc-950 rounded border border-white/10 text-center">
            <div className="text-[10px] text-white/40">FULL SNAPSHOT</div>
            <div className="text-xs font-bold text-white mt-1">{lastSnapshot}</div>
          </div>
          <div className="p-3 bg-zinc-950 rounded border border-white/10 text-center">
            <div className="text-[10px] text-white/40">RESTORE PRECISION</div>
            <div className="text-xs font-bold text-emerald-400 mt-1">Exact Second Restore</div>
          </div>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>ENCRYPTION: AES-256 S3 KMS</span>
        <span>RPO: 0 SECONDS</span>
      </div>
    </div>
  );
};
