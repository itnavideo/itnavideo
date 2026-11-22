import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface AccessTableDesignerViewProps {
  tableName?: string;
  primaryKeyField?: string;
  fieldsCount?: number;
  themeColor?: string;
}

export const AccessTableDesignerView: React.FC<AccessTableDesignerViewProps> = (props) => {
  const {
    tableName = "tbl_Customers",
    primaryKeyField = "CustomerID",
    fieldsCount = 5,
    themeColor = "#A4373A",
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

  const fields = [
    { name: 'CustomerID', type: 'AutoNumber', desc: 'Unique primary identifier for customer record', pk: true },
    { name: 'CompanyName', type: 'Short Text', desc: 'Legal corporate operating entity name (Max 150)', pk: false },
    { name: 'ContactEmail', type: 'Short Text', desc: 'Primary billing and notification address', pk: false },
    { name: 'CreditLimit', type: 'Currency', desc: 'Approved revolving trade credit ceiling in USD', pk: false },
    { name: 'AccountCreated', type: 'Date/Time', desc: 'Timestamp of initial customer registration', pk: false },
  ];

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
      fontFamily: 'Segoe UI, system-ui, sans-serif',
      opacity: entrance,
      transform: `translateY(${(1 - entrance) * 20}px)`,
    }}>
      {/* Table Designer Header */}
      <div style={{
        backgroundColor: themeColor,
        borderRadius: '8px 8px 0 0',
        padding: '12px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '26px',
            height: '26px',
            backgroundColor: '#fff',
            color: themeColor,
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 900,
            fontSize: '15px',
          }}>A</div>
          <span style={{ fontSize: '14px', fontWeight: 700 }}>{tableName} : Table (Design View)</span>
        </div>
        <span style={{ fontSize: '11px', backgroundColor: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '10px' }}>
          Jet/ACE Database Engine
        </span>
      </div>

      {/* Grid Columns Header */}
      <div style={{
        backgroundColor: '#1e293b',
        display: 'grid',
        gridTemplateColumns: '40px 180px 140px 1fr',
        padding: '8px 12px',
        fontSize: '11px',
        fontWeight: 700,
        color: '#94a3b8',
        borderBottom: '1px solid #334155',
      }}>
        <span>PK</span>
        <span>Field Name</span>
        <span>Data Type</span>
        <span>Description (Optional)</span>
      </div>

      {/* Fields List */}
      <div style={{
        flex: 1,
        backgroundColor: '#ffffff',
        color: '#1e293b',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
      }}>
        {fields.map((f, i) => (
          <div key={f.name} style={{
            display: 'grid',
            gridTemplateColumns: '40px 180px 140px 1fr',
            padding: '10px 12px',
            fontSize: '12px',
            borderBottom: '1px solid #e2e8f0',
            backgroundColor: f.pk ? 'rgba(245, 158, 11, 0.08)' : i % 2 === 0 ? '#f8fafc' : '#ffffff',
            alignItems: 'center',
          }}>
            <span>{f.pk ? '🔑' : ''}</span>
            <strong style={{ color: f.pk ? '#b45309' : '#0f172a' }}>{f.name}</strong>
            <span style={{ color: '#2563eb', fontWeight: 600 }}>{f.type}</span>
            <span style={{ color: '#64748b', fontSize: '11px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.desc}</span>
          </div>
        ))}

        {/* Lower Field Properties Panel */}
        <div style={{
          marginTop: 'auto',
          backgroundColor: '#f1f5f9',
          borderTop: '2px solid #cbd5e1',
          padding: '12px 16px',
          fontSize: '11px',
          color: '#475569',
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          <div>
            <strong>Field Size:</strong> Long Integer • <strong>Indexed:</strong> Yes (No Duplicates)
          </div>
          <div>
            <strong>Required:</strong> Yes • <strong>Unicode Compression:</strong> Yes
          </div>
        </div>
      </div>
    </div>
  );
};
