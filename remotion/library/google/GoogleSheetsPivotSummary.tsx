import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface GoogleSheetsPivotSummaryProps {
  sheetTitle?: string;
  formulaQuery?: string;
  totalSum?: string;
  themeColor?: string;
}

export const GoogleSheetsPivotSummary: React.FC<GoogleSheetsPivotSummaryProps> = (props) => {
  const {
    sheetTitle = "Q4_Cloud_Rendering_Costs.gsheet",
    formulaQuery = "=QUERY(A1:E, \"SELECT B, SUM(C) GROUP BY B\")",
    totalSum = "$124,580.00",
    themeColor = "#0F9D58",
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#f8f9fa',
      color: '#202124',
      padding: '24px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Roboto, Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      {/* Sheets Top Bar */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px 8px 0 0',
        padding: '10px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #e0e0e0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '24px', height: '30px', backgroundColor: themeColor, borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: '16px' }}>田</div>
          <span style={{ fontSize: '14px', fontWeight: 700 }}>{sheetTitle}</span>
        </div>
        <span style={{ fontSize: '11px', color: '#5f6368' }}>Auto-saved to Google Drive</span>
      </div>

      {/* Formula Bar */}
      <div style={{ backgroundColor: '#ffffff', padding: '8px 18px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #e0e0e0', fontSize: '12px' }}>
        <span style={{ fontWeight: 700, color: '#5f6368', fontStyle: 'italic' }}>fx</span>
        <code style={{ color: '#0b8043', fontFamily: 'monospace' }}>{formulaQuery}</code>
      </div>

      {/* Green Styled Spreadsheet Grid */}
      <div style={{
        flex: 1,
        backgroundColor: '#ffffff',
        borderRadius: '0 0 8px 8px',
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '60px 220px 140px 1fr', backgroundColor: '#e6f4ea', borderBottom: '1px solid #ceead6', padding: '8px 12px', fontSize: '11px', fontWeight: 700, color: '#137333' }}>
          <span>Row</span>
          <span>Compute Cluster</span>
          <span>Monthly Spend</span>
          <span>SLA Uptime</span>
        </div>

        {[
          { row: 1, name: 'AWS Lambda (Remotion Engine)', cost: '$84,200.00', sla: '99.98%' },
          { row: 2, name: 'Google Cloud Run (itnavideo-web)', cost: '$18,400.00', sla: '100.00%' },
          { row: 3, name: 'Cloudinary Media CDN (itnavideo12345)', cost: '$12,980.00', sla: '99.99%' },
          { row: 4, name: 'AWS S3 Asset Buckets', cost: '$9,000.00', sla: '100.00%' },
        ].map((r) => (
          <div key={r.row} style={{ display: 'grid', gridTemplateColumns: '60px 220px 140px 1fr', padding: '8px 12px', fontSize: '12px', borderBottom: '1px solid #f1f3f4', backgroundColor: r.row % 2 === 0 ? '#f8f9fa' : '#ffffff' }}>
            <span style={{ color: '#5f6368' }}>{r.row}</span>
            <strong style={{ color: '#202124' }}>{r.name}</strong>
            <span style={{ color: '#137333', fontWeight: 600 }}>{r.cost}</span>
            <span style={{ color: '#1a73e8' }}>{r.sla}</span>
          </div>
        ))}

        <div style={{ marginTop: 'auto', backgroundColor: '#e6f4ea', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 800, color: '#137333' }}>
          <span>Grand Total =SUM(C2:C5)</span>
          <span>{totalSum}</span>
        </div>
      </div>
    </div>
  );
};
