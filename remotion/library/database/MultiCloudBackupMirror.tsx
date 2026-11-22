import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface MultiCloudBackupMirrorProps {
  primaryCloud?: string;
  mirrorCloud?: string;
  syncedSnapshotsCount?: number;
  syncLatencySec?: number;
  className?: string;
}

export const MultiCloudBackupMirror: React.FC<MultiCloudBackupMirrorProps> = ({
  primaryCloud = "AWS S3 (us-east-1)",
  mirrorCloud = "Google Cloud Storage (us-central1)",
  syncedSnapshotsCount = 148,
  syncLatencySec = 1.4,
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
            MULTI-CLOUD BACKUP MIRROR
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/20 font-bold">
          DUAL-CLOUD SYNC
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-xs mb-3">
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Primary Bucket</div>
          <div className="text-sky-400 font-bold text-sm mt-1">{primaryCloud}</div>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Secondary Mirror Bucket</div>
          <div className="text-emerald-400 font-bold text-sm mt-1">{mirrorCloud}</div>
        </div>
      </div>

      <div className="text-[10px] font-mono text-zinc-400 flex justify-between">
        <span>Mirrored Snapshots: {syncedSnapshotsCount}</span>
        <span className="text-emerald-400 font-bold">Vendor Lock-In Free</span>
      </div>
    </div>
  );
};
