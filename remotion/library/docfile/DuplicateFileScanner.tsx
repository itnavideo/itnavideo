import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface DuplicateFileScannerProps {
  scannedFilesCount?: number;
  reclaimableSpaceGb?: number;
}

export const DuplicateFileScanner: React.FC<DuplicateFileScannerProps> = (props) => {
  const {
    scannedFilesCount = 42100,
    reclaimableSpaceGb = 18.4,
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#0c101c',
      color: '#f8fafc',
      padding: '24px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      fontFamily: 'Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Deduplication Storage Scanner</h3>
        <span style={{ fontSize: '11px', color: '#4ade80' }}>Hash Verification</span>
      </div>

      <div style={{
        backgroundColor: '#1e293b',
        borderRadius: '8px',
        padding: '20px',
        border: '1px solid #334155',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ fontSize: '32px' }}>🔍</div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#4ade80' }}>{reclaimableSpaceGb} GB Reclaimable</div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Identified across {scannedFilesCount.toLocaleString()} examined files</div>
        </div>
        <button style={{ backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: '4px', padding: '6px 16px', fontSize: '11px', fontWeight: 700 }}>
          Purge Duplicates
        </button>
      </div>
    </div>
  );
};
