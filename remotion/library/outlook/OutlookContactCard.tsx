import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface OutlookContactCardProps {
  displayName?: string;
  jobRole?: string;
  department?: string;
  presenceStatus?: 'Available' | 'Busy' | 'In a call' | 'Away';
  themeColor?: string;
}

export const OutlookContactCard: React.FC<OutlookContactCardProps> = (props) => {
  const {
    displayName = "Elena Rostova",
    jobRole = "Lead Product Designer",
    department = "Design & Visual Intelligence",
    presenceStatus = "Available",
    themeColor = "#0078D4",
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#090d16',
      padding: '24px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      <div style={{
        backgroundColor: '#1e293b',
        borderRadius: '8px',
        border: '1px solid #334155',
        flex: 1,
        padding: '24px',
        color: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
      }}>
        {/* Profile Head */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: themeColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              fontWeight: 800,
            }}>ER</div>
            <div style={{
              position: 'absolute',
              bottom: '2px',
              right: '2px',
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              backgroundColor: presenceStatus === 'Available' ? '#22c55e' : '#ef4444',
              border: '2px solid #1e293b',
            }} />
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 800 }}>{displayName}</div>
            <div style={{ fontSize: '13px', color: '#38bdf8' }}>{jobRole}</div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>{department}</div>
          </div>
        </div>

        {/* Quick Actions (Teams Chat, Email, Call) */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ flex: 1, backgroundColor: '#0078D4', border: 'none', color: '#fff', borderRadius: '4px', padding: '6px', fontSize: '11px', fontWeight: 600 }}>💬 Chat</button>
          <button style={{ flex: 1, backgroundColor: '#334155', border: 'none', color: '#fff', borderRadius: '4px', padding: '6px', fontSize: '11px', fontWeight: 600 }}>✉️ Email</button>
          <button style={{ flex: 1, backgroundColor: '#334155', border: 'none', color: '#fff', borderRadius: '4px', padding: '6px', fontSize: '11px', fontWeight: 600 }}>📞 Call</button>
        </div>
      </div>
    </div>
  );
};
