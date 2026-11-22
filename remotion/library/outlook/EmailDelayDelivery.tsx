import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface EmailDelayDeliveryProps {
  scheduledSendTime?: string;
  recipientName?: string;
  outboxStatus?: string;
}

export const EmailDelayDelivery: React.FC<EmailDelayDeliveryProps> = (props) => {
  const {
    scheduledSendTime = "Monday, Nov 24, 2026 at 08:00 AM",
    recipientName = "Global Leadership Council",
    outboxStatus = "Holding in Outbox until designated time",
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
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Schedule Send • Delay Delivery</h3>
        <span style={{ fontSize: '11px', color: '#f59e0b', backgroundColor: 'rgba(245, 158, 11, 0.15)', padding: '2px 8px', borderRadius: '4px' }}>
          HOLD ACTIVE
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>⏳</span>
          <div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Do not deliver before:</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#38bdf8' }}>{scheduledSendTime}</div>
          </div>
        </div>

        <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px', fontSize: '12px', color: '#cbd5e1' }}>
          Destination: <strong style={{ color: '#fff' }}>{recipientName}</strong><br />
          Status: {outboxStatus}
        </div>

        <button style={{ backgroundColor: '#334155', color: '#cbd5e1', border: 'none', borderRadius: '4px', padding: '6px', fontSize: '11px' }}>
          Modify Scheduled Delivery Time
        </button>
      </div>
    </div>
  );
};
