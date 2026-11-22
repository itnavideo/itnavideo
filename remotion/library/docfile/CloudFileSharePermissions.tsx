import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface CloudFileSharePermissionsProps {
  fileName?: string;
  permissionScope?: string;
}

export const CloudFileSharePermissions: React.FC<CloudFileSharePermissionsProps> = (props) => {
  const {
    fileName = "Financial_Forecast_2026.xlsx",
    permissionScope = "Anyone with the link can View",
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
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>File Share Access Governance</h3>
        <span style={{ fontSize: '11px', color: '#38bdf8' }}>Link Permissions</span>
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
        <div>
          <div style={{ fontSize: '14px', fontWeight: 700 }}>{fileName}</div>
          <div style={{ fontSize: '12px', color: '#4ade80', marginTop: '4px' }}>🔒 {permissionScope}</div>
        </div>

        <div style={{ backgroundColor: '#0f172a', padding: '10px 14px', borderRadius: '4px', fontSize: '11px', color: '#cbd5e1' }}>
          https://drive.itnavideo.com/s/98412-financial-forecast?token=valid
        </div>
      </div>
    </div>
  );
};
