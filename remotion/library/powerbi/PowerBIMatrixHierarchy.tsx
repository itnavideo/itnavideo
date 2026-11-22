import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface PowerBIMatrixHierarchyProps {
  drilldownLevel?: string;
  totalRevenue?: string;
}

export const PowerBIMatrixHierarchy: React.FC<PowerBIMatrixHierarchyProps> = (props) => {
  const {
    drilldownLevel = "Region ➔ Country ➔ State",
    totalRevenue = "$14,280,000",
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#0f172a',
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
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Matrix Visual • Stepped Layout</h3>
        <span style={{ fontSize: '11px', color: '#F2C811' }}>{drilldownLevel}</span>
      </div>

      <div style={{
        backgroundColor: '#1e293b',
        borderRadius: '8px',
        border: '1px solid #334155',
        overflow: 'hidden',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Matrix Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '180px repeat(3, 1fr)', backgroundColor: '#0f172a', padding: '10px 14px', fontSize: '11px', fontWeight: 700, color: '#94a3b8' }}>
          <span>Geographic Hierarchy</span>
          <span>Sales Q1</span>
          <span>Sales Q2</span>
          <span>Growth YoY</span>
        </div>

        {/* Expandable Rows */}
        <div style={{ padding: '8px 14px', borderBottom: '1px solid #334155', fontSize: '12px', fontWeight: 700, color: '#F2C811', display: 'grid', gridTemplateColumns: '180px repeat(3, 1fr)' }}>
          <span>[-] North America</span>
          <span>$4.2M</span>
          <span>$5.1M</span>
          <span style={{ color: '#4ade80' }}>+21.4%</span>
        </div>
        <div style={{ padding: '8px 14px', paddingLeft: '28px', borderBottom: '1px solid #334155', fontSize: '11px', color: '#cbd5e1', display: 'grid', gridTemplateColumns: '166px repeat(3, 1fr)' }}>
          <span>• United States</span>
          <span>$3.6M</span>
          <span>$4.4M</span>
          <span style={{ color: '#4ade80' }}>+22.2%</span>
        </div>
        <div style={{ padding: '8px 14px', paddingLeft: '28px', borderBottom: '1px solid #334155', fontSize: '11px', color: '#cbd5e1', display: 'grid', gridTemplateColumns: '166px repeat(3, 1fr)' }}>
          <span>• Canada</span>
          <span>$600K</span>
          <span>$700K</span>
          <span style={{ color: '#4ade80' }}>+16.6%</span>
        </div>

        <div style={{ marginTop: 'auto', backgroundColor: '#0f172a', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 800 }}>
          <span>Total</span>
          <span style={{ color: '#F2C811' }}>{totalRevenue}</span>
        </div>
      </div>
    </div>
  );
};
