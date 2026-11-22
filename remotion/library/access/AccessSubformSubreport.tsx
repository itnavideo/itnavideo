import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface AccessSubformSubreportProps {
  masterOrderId?: string;
  customerName?: string;
  lineItemsCount?: number;
}

export const AccessSubformSubreport: React.FC<AccessSubformSubreportProps> = (props) => {
  const {
    masterOrderId = "ORD-98412",
    customerName = "Apex Cloud Systems Corp",
    lineItemsCount = 3,
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
        padding: '20px 24px',
        color: '#1e293b',
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        {/* Parent Header */}
        <div style={{ borderBottom: '1px solid #cbd5e1', paddingBottom: '10px' }}>
          <div style={{ fontSize: '11px', color: '#64748b' }}>PARENT RECORD (Order Header)</div>
          <div style={{ fontSize: '15px', fontWeight: 800 }}>Order: {masterOrderId} • Customer: {customerName}</div>
        </div>

        {/* Embedded Subform Datasheet */}
        <div style={{ border: '1px solid #94a3b8', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ backgroundColor: '#e2e8f0', padding: '6px 10px', fontSize: '10px', fontWeight: 700, color: '#475569' }}>
            SUBFORM: tbl_OrderDetails (LinkMasterFields: OrderID)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 60px 80px', padding: '6px 10px', fontSize: '11px', borderBottom: '1px solid #e2e8f0' }}>
            <span>Item #101</span>
            <span>Remotion Lambda Cloud Hours</span>
            <span>24</span>
            <span style={{ fontWeight: 700 }}>$1,200.00</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 60px 80px', padding: '6px 10px', fontSize: '11px' }}>
            <span>Item #102</span>
            <span>Cloudinary CDN Ingestion GB</span>
            <span>500</span>
            <span style={{ fontWeight: 700 }}>$250.00</span>
          </div>
        </div>

        <div style={{ fontSize: '10px', color: '#64748b', textAlign: 'right' }}>
          Total Order Value: <strong>$1,450.00 USD</strong>
        </div>
      </div>
    </div>
  );
};
