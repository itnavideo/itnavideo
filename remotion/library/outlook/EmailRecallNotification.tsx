import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface EmailRecallNotificationProps {
  originalSubject?: string;
  recalledCount?: number;
  totalRecipients?: number;
  statusMessage?: string;
}

export const EmailRecallNotification: React.FC<EmailRecallNotificationProps> = (props) => {
  const {
    originalSubject = "Confidential Salary Adjustment Matrix Q4",
    recalledCount = 18,
    totalRecipients = 20,
    statusMessage = "Recall succeeded for internal Exchange recipients.",
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
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Exchange Message Recall Report</h3>
        <span style={{ backgroundColor: '#10b981', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
          REPORT GENERATED
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
        justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>Target Subject:</div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc', marginTop: '2px' }}>{originalSubject}</div>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ flex: 1, backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px' }}>
            <div style={{ fontSize: '10px', color: '#94a3b8' }}>RECALLED SUCCESSFULLY</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#4ade80' }}>{recalledCount} / {totalRecipients}</div>
          </div>
          <div style={{ flex: 1, backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px' }}>
            <div style={{ fontSize: '10px', color: '#94a3b8' }}>RECALL FAILED (ALREADY READ)</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#f87171' }}>{totalRecipients - recalledCount}</div>
          </div>
        </div>

        <div style={{ fontSize: '11px', color: '#cbd5e1' }}>{statusMessage}</div>
      </div>
    </div>
  );
};
