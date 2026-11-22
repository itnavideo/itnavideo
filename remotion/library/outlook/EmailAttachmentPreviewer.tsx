import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface EmailAttachmentPreviewerProps {
  fileName?: string;
  fileSize?: string;
  fileType?: string;
  totalAttachments?: number;
}

export const EmailAttachmentPreviewer: React.FC<EmailAttachmentPreviewerProps> = (props) => {
  const {
    fileName = "Financial_Forecast_2025.pdf",
    fileSize = "4.8 MB",
    fileType = "PDF Document",
    totalAttachments = 3,
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#0c1322',
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
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Attachments ({totalAttachments})</h3>
        <span style={{ fontSize: '11px', color: '#38bdf8', cursor: 'pointer' }}>Download All</span>
      </div>

      {/* Attachment Cards Strip */}
      <div style={{ display: 'flex', gap: '12px', flex: 1, alignItems: 'center' }}>
        <div style={{
          flex: 1,
          backgroundColor: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '8px',
          padding: '16px',
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        }}>
          <span style={{ fontSize: '28px' }}>📄</span>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#f8fafc' }}>{fileName}</div>
            <div style={{ fontSize: '10px', color: '#94a3b8' }}>{fileSize} • {fileType}</div>
          </div>
        </div>

        <div style={{
          flex: 1,
          backgroundColor: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '8px',
          padding: '16px',
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        }}>
          <span style={{ fontSize: '28px' }}>📊</span>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#f8fafc' }}>Audit_Metrics.xlsx</div>
            <div style={{ fontSize: '10px', color: '#94a3b8' }}>1.2 MB • Excel Sheet</div>
          </div>
        </div>
      </div>
    </div>
  );
};
