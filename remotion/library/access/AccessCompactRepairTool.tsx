import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface AccessCompactRepairToolProps {
  originalSizeMb?: number;
  compactedSizeMb?: number;
  savingsPercentage?: number;
}

export const AccessCompactRepairTool: React.FC<AccessCompactRepairToolProps> = (props) => {
  const {
    originalSizeMb = 840,
    compactedSizeMb = 110,
    savingsPercentage = 87,
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
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Compact & Repair Database</h3>
        <span style={{ backgroundColor: '#10b981', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
          DEFRAGMENTATION COMPLETE
        </span>
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
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#ef4444' }}>{originalSizeMb} MB</div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Before Compact</div>
          </div>
          <span style={{ fontSize: '24px' }}>➔</span>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#4ade80' }}>{compactedSizeMb} MB</div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>After Compact (-{savingsPercentage}%)</div>
          </div>
        </div>

        <div style={{ fontSize: '11px', color: '#cbd5e1', textAlign: 'center' }}>
          Purged orphaned records, reset internal AutoNumber sequences, and reclaimed unindexed storage blocks.
        </div>
      </div>
    </div>
  );
};
