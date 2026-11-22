import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface AccessLookupFieldWizardProps {
  foreignKeyField?: string;
  lookupSourceTable?: string;
  boundColumn?: number;
}

export const AccessLookupFieldWizard: React.FC<AccessLookupFieldWizardProps> = (props) => {
  const {
    foreignKeyField = "SupplierID",
    lookupSourceTable = "tbl_Suppliers",
    boundColumn = 1,
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
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Lookup Column Wizard</h3>
        <span style={{ fontSize: '11px', color: '#38bdf8' }}>Foreign Key Resolution</span>
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
          <div style={{ fontSize: '11px', color: '#94a3b8' }}>Target Foreign Key:</div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc' }}>{foreignKeyField} ➔ {lookupSourceTable}</div>
        </div>

        {/* Dropdown Simulator */}
        <div style={{ backgroundColor: '#0f172a', borderRadius: '6px', border: '1px solid #475569', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: '#4ade80' }}>Acme Industrial Components (ID: 104)</span>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>▾</span>
        </div>

        <div style={{ fontSize: '11px', color: '#cbd5e1' }}>
          Stores integer key <code>SupplierID=104</code> in storage while displaying human-friendly <code>SupplierName</code>.
        </div>
      </div>
    </div>
  );
};
