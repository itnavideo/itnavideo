import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface PIIDataDiscoveryScannerProps {
  scannedTablesCount?: number;
  piiColumnsFound?: number;
  piiTypes?: string[];
  complianceFramework?: string;
  className?: string;
}

export const PIIDataDiscoveryScanner: React.FC<PIIDataDiscoveryScannerProps> = ({
  scannedTablesCount = 142,
  piiColumnsFound = 18,
  piiTypes = ["PASSPORT_ID", "PHONE_NUMBER", "HOME_ADDRESS", "DATE_OF_BIRTH"],
  complianceFramework = "GDPR / CCPA / HIPAA",
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-purple-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-purple-400" />
          <span className="text-xs uppercase tracking-wider text-purple-400 font-bold">
            PII DISCOVERY SCANNER
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/20 font-bold">
          {complianceFramework}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-xs mb-3">
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Tables Scanned</div>
          <div className="text-white font-bold text-base mt-1">{scannedTablesCount} Tables</div>
        </div>

        <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/20">
          <div className="text-[10px] text-purple-300 uppercase">PII Columns Identified</div>
          <div className="text-purple-400 font-bold text-base mt-1">{piiColumnsFound} Sensitive Columns</div>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-black/60 border border-zinc-800 font-mono text-xs mb-2">
        <div className="text-[10px] text-zinc-500 uppercase mb-1">Detected Classifications</div>
        <div className="flex flex-wrap gap-1">
          {piiTypes.map((t, idx) => (
            <span key={idx} className="px-2 py-0.5 rounded bg-zinc-800 text-purple-300 text-[10px]">
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
