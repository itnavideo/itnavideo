import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface AccessReportGroupingBandsProps {
  reportTitle?: string;
  groupByField?: string;
  summaryTotal?: string;
}

export const AccessReportGroupingBands: React.FC<AccessReportGroupingBandsProps> = (props) => {
  const {
    reportTitle = "Sales Performance By Territory Report",
    groupByField = "SalesTerritory",
    summaryTotal = "$1,482,900.00",
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
        padding: '24px',
        color: '#1e293b',
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        {/* Report Header Band */}
        <div style={{ borderBottom: '2px solid #0f172a', paddingBottom: '8px' }}>
          <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>REPORT HEADER BAND</div>
          <div style={{ fontSize: '18px', fontWeight: 800 }}>{reportTitle}</div>
        </div>

        {/* Group Header Band */}
        <div style={{ backgroundColor: '#f1f5f9', padding: '6px 12px', borderLeft: '4px solid #A4373A' }}>
          <div style={{ fontSize: '10px', color: '#64748b' }}>GROUP HEADER: [{groupByField}]</div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#A4373A' }}>Territory: North America West</div>
        </div>

        {/* Detail Section */}
        <div style={{ padding: '8px 12px', fontSize: '11px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Order #10482 - Apex Enterprise</span>
            <strong>$42,500.00</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Order #10483 - Quantum Dynamics</span>
            <strong>$89,200.00</strong>
          </div>
        </div>

        {/* Group Footer Band (Summary) */}
        <div style={{ backgroundColor: '#e2e8f0', padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', fontWeight: 700 }}>Group Subtotal: =Sum([Total])</span>
          <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>{summaryTotal}</span>
        </div>
      </div>
    </div>
  );
};
