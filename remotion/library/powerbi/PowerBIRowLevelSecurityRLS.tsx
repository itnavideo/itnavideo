import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface PowerBIRowLevelSecurityRLSProps {
  roleName?: string;
  daxFilterExpression?: string;
  previewUser?: string;
}

export const PowerBIRowLevelSecurityRLS: React.FC<PowerBIRowLevelSecurityRLSProps> = (props) => {
  const {
    roleName = "Regional Sales Manager",
    daxFilterExpression = "[SalesTerritoryCountry] = USERPRINCIPALNAME()",
    previewUser = "sarah.connor@itnavideo.com (APAC)",
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
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Row-Level Security (RLS) Filter</h3>
        <span style={{ backgroundColor: '#F2C811', color: '#111827', fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>
          ROLE: {roleName}
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
        <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px' }}>
          <div style={{ fontSize: '10px', color: '#94a3b8' }}>DAX TABLE FILTER EXPRESSION:</div>
          <code style={{ fontSize: '13px', color: '#F2C811' }}>{daxFilterExpression}</code>
        </div>

        <div style={{ fontSize: '12px', color: '#cbd5e1' }}>
          Viewing report as: <strong>{previewUser}</strong> (Rows restricted strictly to user's assigned sales jurisdiction).
        </div>
      </div>
    </div>
  );
};
