import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface AccessRelationshipsWindowProps {
  parentTable?: string;
  childTable?: string;
  relationshipType?: string;
  enforceReferentialIntegrity?: boolean;
  themeColor?: string;
}

export const AccessRelationshipsWindow: React.FC<AccessRelationshipsWindowProps> = (props) => {
  const {
    parentTable = "tbl_Customers",
    childTable = "tbl_Orders",
    relationshipType = "One-To-Many (1:∞)",
    enforceReferentialIntegrity = true,
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
      color: '#f8fafc',
      padding: '24px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Access Relationships Diagram</h3>
        <span style={{ fontSize: '11px', backgroundColor: '#10b981', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontWeight: 700 }}>
          REFERENTIAL INTEGRITY ENFORCED
        </span>
      </div>

      {/* Visual ERD Canvas */}
      <div style={{
        flex: 1,
        backgroundColor: '#1e293b',
        borderRadius: '8px',
        border: '1px solid #334155',
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        position: 'relative',
        boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
      }}>
        {/* Parent Table Box */}
        <div style={{ width: '170px', backgroundColor: '#ffffff', borderRadius: '6px', color: '#1e293b', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
          <div style={{ backgroundColor: themeColor, color: '#fff', padding: '6px 10px', fontSize: '12px', fontWeight: 700 }}>{parentTable}</div>
          <div style={{ padding: '8px 10px', fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ fontWeight: 700, color: '#b45309' }}>🔑 CustomerID</div>
            <div>CompanyName</div>
            <div>ContactEmail</div>
            <div>BillingCountry</div>
          </div>
        </div>

        {/* 1 to Infinity Connecting Link Line */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 700 }}>{relationshipType}</span>
          <div style={{ display: 'flex', alignItems: 'center', width: '120px' }}>
            <span style={{ fontSize: '14px', fontWeight: 800, color: '#facc15' }}>1</span>
            <div style={{ flex: 1, height: '2px', backgroundColor: '#38bdf8' }} />
            <span style={{ fontSize: '16px', fontWeight: 800, color: '#facc15' }}>∞</span>
          </div>
          <span style={{ fontSize: '9px', color: '#94a3b8' }}>Cascade Delete: OFF</span>
        </div>

        {/* Child Table Box */}
        <div style={{ width: '170px', backgroundColor: '#ffffff', borderRadius: '6px', color: '#1e293b', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
          <div style={{ backgroundColor: themeColor, color: '#fff', padding: '6px 10px', fontSize: '12px', fontWeight: 700 }}>{childTable}</div>
          <div style={{ padding: '8px 10px', fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ fontWeight: 700, color: '#b45309' }}>🔑 OrderID</div>
            <div style={{ color: '#2563eb', fontWeight: 600 }}>🔗 CustomerID (FK)</div>
            <div>OrderDate</div>
            <div>TotalAmount</div>
          </div>
        </div>
      </div>
    </div>
  );
};
