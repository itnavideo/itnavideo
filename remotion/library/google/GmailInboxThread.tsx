import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface GmailInboxThreadProps {
  sender?: string;
  subject?: string;
  label?: string;
}

export const GmailInboxThread: React.FC<GmailInboxThreadProps> = (props) => {
  const {
    sender = "Google Cloud Platform Alert",
    subject = "Container deployment itnavideo-web:v4.2 healthy in us-central1",
    label = "Production",
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#f6f8fc',
      color: '#202124',
      padding: '24px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Roboto, Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid #e0e0e0', paddingBottom: '10px' }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#c5221f', borderBottom: '2px solid #c5221f', paddingBottom: '10px' }}>Primary</span>
        <span style={{ fontSize: '13px', color: '#5f6368' }}>Promotions</span>
        <span style={{ fontSize: '13px', color: '#5f6368' }}>Social</span>
      </div>

      <div style={{ flex: 1, backgroundColor: '#ffffff', borderRadius: '8px', padding: '16px', marginTop: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>⭐</span>
          <span style={{ fontSize: '13px', fontWeight: 700 }}>{sender}</span>
          <span style={{ backgroundColor: '#1a73e8', color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '4px' }}>{label}</span>
          <span style={{ fontSize: '12px', color: '#3c4043', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{subject}</span>
          <span style={{ fontSize: '11px', color: '#5f6368' }}>10:42 AM</span>
        </div>
      </div>
    </div>
  );
};
