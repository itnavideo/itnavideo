import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface AccessExportImportWizardProps {
  operationType?: 'IMPORT' | 'EXPORT';
  format?: string;
  recordsTransferred?: number;
}

export const AccessExportImportWizard: React.FC<AccessExportImportWizardProps> = (props) => {
  const {
    operationType = "EXPORT",
    format = "Microsoft Excel (.xlsx) / SharePoint List",
    recordsTransferred = 4850,
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
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Data Export & Migration Pipeline</h3>
        <span style={{ fontSize: '11px', color: '#38bdf8' }}>{operationType} MODE</span>
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
        <div style={{ fontSize: '36px' }}>📦</div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#f8fafc' }}>{recordsTransferred.toLocaleString()} Records Processed</div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Target: {format}</div>
        </div>
        <div style={{ fontSize: '11px', color: '#4ade80' }}>✓ Schema mapping and data types verified with zero loss</div>
      </div>
    </div>
  );
};
