import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface ColumnLevelEncryptionProps {
  tableName?: string;
  columnName?: string;
  keyCipher?: string;
  cipherTextPreview?: string;
  className?: string;
}

export const ColumnLevelEncryption: React.FC<ColumnLevelEncryptionProps> = ({
  tableName = "public.patient_records",
  columnName = "medical_diagnosis_notes",
  keyCipher = "RSA-OAEP-4096 + AES-GCM-256",
  cipherTextPreview = "enc_v1:8a9fbc41029e8432a9cde9103857321...",
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-indigo-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
          <span className="text-xs uppercase tracking-wider text-indigo-400 font-bold">
            COLUMN-LEVEL ENVELOPE ENCRYPTION
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
          {tableName}
        </span>
      </div>

      <div className="flex justify-between items-baseline mb-3 font-mono">
        <div>
          <span className="text-xs text-zinc-400 block uppercase">Encrypted Column</span>
          <span className="text-lg font-bold text-indigo-300">{columnName}</span>
        </div>
        <span className="text-[10px] px-2 py-1 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/20 font-bold">
          {keyCipher}
        </span>
      </div>

      <div className="p-3 rounded-xl bg-black/60 border border-zinc-800 font-mono text-xs text-zinc-300 mb-3 overflow-hidden text-ellipsis">
        <div className="text-[10px] text-zinc-500 uppercase mb-0.5">Database Raw Stored Value (Ciphertext)</div>
        <code className="text-indigo-400 text-[11px]">{cipherTextPreview}</code>
      </div>

      <div className="text-[10px] font-mono text-zinc-400 flex justify-between">
        <span>Keys held outside database engine</span>
        <span className="text-emerald-400 font-bold">Zero DBA Plaintext Exposure</span>
      </div>
    </div>
  );
};
