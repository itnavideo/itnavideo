import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface OutOfOfficeAssistantProps {
  responderStatus?: 'Active' | 'Scheduled' | 'Off';
  dateRange?: string;
  autoReplyText?: string;
}

export const OutOfOfficeAssistant: React.FC<OutOfOfficeAssistantProps> = (props) => {
  const {
    responderStatus = "Active",
    dateRange = "Nov 24, 2026 – Dec 01, 2026",
    autoReplyText = "Thank you for contacting me. I am currently out of the office for annual leave with limited email access. For urgent inquiries, please contact ops@itnavideo.com.",
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
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Automatic Replies (Out of Office)</h3>
        <span style={{
          backgroundColor: responderStatus === 'Active' ? '#22c55e' : '#f59e0b',
          color: '#ffffff',
          fontSize: '11px',
          fontWeight: 700,
          padding: '3px 8px',
          borderRadius: '4px',
        }}>
          {responderStatus}
        </span>
      </div>

      <div style={{
        backgroundColor: '#1e293b',
        borderRadius: '8px',
        padding: '20px',
        border: '1px solid #334155',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}>
        <div style={{ fontSize: '12px', color: '#38bdf8', fontWeight: 600 }}>
          Scheduled Duration: {dateRange}
        </div>

        <div style={{
          backgroundColor: '#0f172a',
          borderRadius: '6px',
          padding: '16px',
          border: '1px solid #334155',
          flex: 1,
          fontSize: '12px',
          lineHeight: '1.7',
          color: '#cbd5e1',
        }}>
          {autoReplyText}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8' }}>
          <span>Inside Organization: Enabled</span>
          <span>Outside Organization: Enabled</span>
        </div>
      </div>
    </div>
  );
};
