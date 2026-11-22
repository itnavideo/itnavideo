import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface AccessFormBuilderWizardProps {
  formTitle?: string;
  currentRecordNumber?: number;
  totalRecords?: number;
  themeColor?: string;
}

export const AccessFormBuilderWizard: React.FC<AccessFormBuilderWizardProps> = (props) => {
  const {
    formTitle = "Customer Account Maintenance Form",
    currentRecordNumber = 42,
    totalRecords = 1250,
    themeColor = "#A4373A",
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#0c101c',
      padding: '24px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      <div style={{
        flex: 1,
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        padding: '24px 28px',
        color: '#1e293b',
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        {/* Form Title Banner */}
        <div style={{ borderBottom: '2px solid #A4373A', paddingBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: themeColor }}>{formTitle}</h2>
          <span style={{ fontSize: '11px', color: '#64748b' }}>Single Form View</span>
        </div>

        {/* Bound Input Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ width: '130px', fontSize: '12px', fontWeight: 700, color: '#475569' }}>Customer ID:</span>
            <input readOnly value="CUST-00042" style={{ backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', padding: '6px 10px', borderRadius: '4px', fontSize: '12px', width: '140px' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ width: '130px', fontSize: '12px', fontWeight: 700, color: '#475569' }}>Company Name:</span>
            <input readOnly value="Global Logistics Alliance Inc." style={{ border: '1px solid #cbd5e1', padding: '6px 10px', borderRadius: '4px', fontSize: '12px', flex: 1 }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ width: '130px', fontSize: '12px', fontWeight: 700, color: '#475569' }}>Credit Tier:</span>
            <div style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 700 }}>Tier 1 ($250,000 USD Ceiling)</div>
          </div>
        </div>

        {/* Record Navigation Strip */}
        <div style={{
          backgroundColor: '#f1f5f9',
          borderTop: '1px solid #cbd5e1',
          padding: '8px 14px',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11px',
        }}>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <button style={{ padding: '2px 6px' }}>|◀</button>
            <button style={{ padding: '2px 6px' }}>◀</button>
            <span>Record: <strong>{currentRecordNumber}</strong> of {totalRecords}</span>
            <button style={{ padding: '2px 6px' }}>▶</button>
            <button style={{ padding: '2px 6px' }}>▶|</button>
          </div>
          <span style={{ color: '#64748b' }}>No Filter • Search 🔍</span>
        </div>
      </div>
    </div>
  );
};
