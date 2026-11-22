import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface PowerBIIncrementalRefreshProps {
  archivePeriod?: string;
  refreshPeriod?: string;
}

export const PowerBIIncrementalRefresh: React.FC<PowerBIIncrementalRefreshProps> = (props) => {
  const {
    archivePeriod = "Store 5 Years Historical Data (Cold Storage)",
    refreshPeriod = "Refresh Last 7 Days Incrementally (Hot Partition)",
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#0b1120',
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
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Incremental Refresh Policy</h3>
        <span style={{ fontSize: '11px', color: '#38bdf8' }}>VertiPaq Hybrid Partitioning</span>
      </div>

      <div style={{ display: 'flex', gap: '14px', flex: 1, alignItems: 'center' }}>
        <div style={{ flex: 1, backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '16px' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700 }}>HISTORICAL ARCHIVE</div>
          <div style={{ fontSize: '12px', marginTop: '6px', color: '#cbd5e1' }}>{archivePeriod}</div>
        </div>
        <span style={{ fontSize: '18px' }}>➕</span>
        <div style={{ flex: 1, backgroundColor: '#1e293b', border: '1px solid #F2C811', borderRadius: '8px', padding: '16px' }}>
          <div style={{ fontSize: '11px', color: '#F2C811', fontWeight: 700 }}>INCREMENTAL WINDOW</div>
          <div style={{ fontSize: '12px', marginTop: '6px', color: '#ffffff' }}>{refreshPeriod}</div>
        </div>
      </div>
    </div>
  );
};
