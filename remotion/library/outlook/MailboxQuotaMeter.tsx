import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface MailboxQuotaMeterProps {
  usedGB?: number;
  totalGB?: number;
  warningThresholdPercent?: number;
}

export const MailboxQuotaMeter: React.FC<MailboxQuotaMeterProps> = (props) => {
  const {
    usedGB = 84.5,
    totalGB = 100,
    warningThresholdPercent = 80,
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const used = usedGB || 84.5;
  const total = totalGB || 100;
  const pct = Math.round((used / total) * 100);

  const meterAnim = spring({ frame, fps, config: { damping: 14 } });
  const displayPct = Math.round(pct * meterAnim);

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
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Exchange Mailbox Storage Quota</h3>
        <span style={{ fontSize: '12px', color: '#f59e0b', fontWeight: 700 }}>{displayPct}% Used</span>
      </div>

      <div style={{
        backgroundColor: '#1e293b',
        borderRadius: '8px',
        padding: '24px',
        border: '1px solid #334155',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#f8fafc' }}>{used} GB <span style={{ fontSize: '14px', color: '#94a3b8' }}>of {total} GB</span></div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>15.5 GB available before send/receive throttling begins.</div>
        </div>

        {/* Progress Bar */}
        <div>
          <div style={{ width: '100%', height: '14px', backgroundColor: '#0f172a', borderRadius: '7px', overflow: 'hidden' }}>
            <div style={{ width: `${displayPct}%`, height: '100%', backgroundColor: '#f59e0b', borderRadius: '7px' }} />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button style={{ backgroundColor: '#0078D4', border: 'none', color: '#fff', borderRadius: '4px', padding: '6px 12px', fontSize: '11px', fontWeight: 600 }}>Empty Deleted Items</button>
          <button style={{ backgroundColor: '#334155', border: 'none', color: '#cbd5e1', borderRadius: '4px', padding: '6px 12px', fontSize: '11px' }}>Clean Up Old Mail</button>
        </div>
      </div>
    </div>
  );
};
