import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface AccessLinkedTableManagerProps {
  linkedTablesCount?: number;
  serverEndpoint?: string;
}

export const AccessLinkedTableManager: React.FC<AccessLinkedTableManagerProps> = (props) => {
  const {
    linkedTablesCount = 12,
    serverEndpoint = "sql-db-east.itnavideo.internal:1433",
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
      gap: '14px',
      fontFamily: 'Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Linked Table Manager (ODBC / SQL Server)</h3>
        <span style={{ fontSize: '11px', color: '#4ade80' }}>● All 12 Connected</span>
      </div>

      <div style={{
        backgroundColor: '#1e293b',
        borderRadius: '8px',
        padding: '16px',
        border: '1px solid #334155',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        <div style={{ fontSize: '12px', color: '#cbd5e1' }}>
          <strong>Backend SQL Server:</strong> <code>{serverEndpoint}</code>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {['dbo_tbl_RenderJobs', 'dbo_tbl_UserSubscriptions', 'dbo_tbl_CreditLedger'].map((t) => (
            <div key={t} style={{ backgroundColor: '#0f172a', padding: '8px 12px', borderRadius: '4px', fontSize: '11px', display: 'flex', justifyContent: 'space-between' }}>
              <span>🔗 {t}</span>
              <span style={{ color: '#4ade80' }}>Verified</span>
            </div>
          ))}
        </div>

        <button style={{ backgroundColor: '#A4373A', border: 'none', color: '#fff', padding: '6px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>
          Refresh All Link Passwords
        </button>
      </div>
    </div>
  );
};
