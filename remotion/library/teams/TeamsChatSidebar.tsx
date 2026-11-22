import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface TeamsChatSidebarProps {
  activeChat?: string;
  unreadDirectMessages?: number;
}

export const TeamsChatSidebar: React.FC<TeamsChatSidebarProps> = (props) => {
  const {
    activeChat = "Core Video Platform",
    unreadDirectMessages = 3,
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const chats = [
    { name: 'Core Video Platform', type: 'channel', snippet: 'Elena: PR #481 approved and ready for merge.', unread: true },
    { name: 'Sarah Connor', type: 'dm', snippet: 'Can you double-check the Lambda IAM policy?', unread: true },
    { name: 'Marcus Vance', type: 'dm', snippet: 'The S3 bucket CORS configuration is complete.', unread: false },
    { name: 'Production Alerts', type: 'bot', snippet: 'Alert: Cloud Run memory utilization at 42%.', unread: false },
  ];

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#11101d',
      color: '#f8fafc',
      padding: '24px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
      fontFamily: 'Segoe UI, sans-serif',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Teams Chat & Channels</h3>
        <span style={{ fontSize: '11px', color: '#7b83eb' }}>{unreadDirectMessages} Unread</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        {chats.map((c) => {
          const isActive = c.name === activeChat;
          return (
            <div key={c.name} style={{
              backgroundColor: isActive ? 'rgba(91, 95, 199, 0.25)' : '#1e1c2e',
              border: isActive ? '1px solid #5B5FC7' : '1px solid #2d2a45',
              borderRadius: '6px',
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: c.unread ? 700 : 500, color: isActive ? '#c7d2fe' : '#f8fafc' }}>{c.name}</span>
                {c.unread && <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }} />}
              </div>
              <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {c.snippet}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
