import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface PowerBIPaginatedReportProps {
  reportDocumentName?: string;
  pageCount?: number;
}

export const PowerBIPaginatedReport: React.FC<PowerBIPaginatedReportProps> = (props) => {
  const {
    reportDocumentName = "Monthly_Financial_Audit_Report.rdl",
    pageCount = 18,
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#0b1120',
      padding: '24px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '6px',
        padding: '24px',
        color: '#1e293b',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
      }}>
        <div style={{ borderBottom: '2px solid #F2C811', paddingBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 800, fontSize: '14px' }}>{reportDocumentName}</span>
          <span style={{ fontSize: '11px', color: '#64748b' }}>Pixel-Perfect Paginated Report</span>
        </div>
        <div style={{ fontSize: '12px', color: '#475569' }}>
          Designed for standardized multi-page printing and PDF rendering with repeating table headers.
        </div>
        <div style={{ fontSize: '10px', color: '#94a3b8', textAlign: 'right' }}>
          Page 1 of {pageCount}
        </div>
      </div>
    </div>
  );
};
