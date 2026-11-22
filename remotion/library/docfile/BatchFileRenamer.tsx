import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface BatchFileRenamerProps {
  renameRule?: string;
  filesProcessed?: number;
}

export const BatchFileRenamer: React.FC<BatchFileRenamerProps> = (props) => {
  const {
    renameRule = "Prefix: \"2026_Q4_\" + [OriginalFileName]",
    filesProcessed = 84,
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
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Batch File Renamer Engine</h3>
        <span style={{ fontSize: '11px', color: '#facc15' }}>Regex Pattern</span>
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
      }}>
        <div style={{ fontSize: '12px', color: '#cbd5e1' }}>
          Rule: <code>{renameRule}</code>
        </div>
        <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px', fontSize: '11px', color: '#38bdf8' }}>
          Sample: invoice_01.pdf ➔ 2026_Q4_invoice_01.pdf
        </div>
        <div style={{ fontSize: '11px', color: '#4ade80' }}>✓ {filesProcessed} files renamed sequentially</div>
      </div>
    </div>
  );
};
