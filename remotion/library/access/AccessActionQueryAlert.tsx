import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface AccessActionQueryAlertProps {
  actionType?: 'UPDATE' | 'DELETE' | 'APPEND' | 'MAKE-TABLE';
  affectedRowCount?: number;
  tableName?: string;
}

export const AccessActionQueryAlert: React.FC<AccessActionQueryAlertProps> = (props) => {
  const {
    actionType = "UPDATE",
    affectedRowCount = 1420,
    tableName = "tbl_Orders",
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
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      <div style={{
        width: '420px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        padding: '24px',
        color: '#1e293b',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        borderLeft: '6px solid #dc2626',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>⚠️</span>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#dc2626' }}>Microsoft Access Action Query Alert</div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>Irreversible Data Modification</div>
          </div>
        </div>

        <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#334155', margin: 0 }}>
          You are about to run an <strong>{actionType}</strong> query that will modify <strong>{affectedRowCount.toLocaleString()} row(s)</strong> in table <code>{tableName}</code>. Once committed, you cannot undo this operation with Ctrl+Z.
        </p>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button style={{ backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: '4px', padding: '6px 18px', fontSize: '12px', fontWeight: 700 }}>Yes, Execute</button>
          <button style={{ backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '6px 14px', fontSize: '12px' }}>No, Cancel</button>
        </div>
      </div>
    </div>
  );
};
