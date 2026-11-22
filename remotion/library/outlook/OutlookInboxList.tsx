import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface OutlookInboxListProps {
  activeTab?: 'Focused' | 'Other';
  unreadCount?: number;
  highlightedSender?: string;
  themeColor?: string;
}

export const OutlookInboxList: React.FC<OutlookInboxListProps> = (props) => {
  const {
    activeTab = "Focused",
    unreadCount = 4,
    highlightedSender = "Chief Security Officer",
    themeColor = "#0078D4",
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

  const emails = [
    {
      sender: 'Chief Security Officer',
      time: '10:42 AM',
      subject: 'Urgent: Mandatory Zero-Trust Protocol Upgrade',
      snippet: 'Please ensure all workstation credentials are refreshed prior to the scheduled maintenance window...',
      unread: true,
      flagged: true,
    },
    {
      sender: 'DevOps Release Pipeline',
      time: '09:15 AM',
      subject: 'Build #4812 Passed: Production Cloud Run Deployment',
      snippet: 'Container image itnavideo-web:latest successfully deployed to region us-central1 with 100% health checks.',
      unread: true,
      flagged: false,
    },
    {
      sender: 'Elena Rostova (Product)',
      time: 'Yesterday',
      subject: 'User Feedback: Remotion 9:16 Kinetic Subtitle Presets',
      snippet: 'The creator community gave outstanding scores to the karaoke bounce animations released in Batch 68.',
      unread: false,
      flagged: true,
    },
  ];

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
      fontFamily: 'Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      {/* Inbox Header with Tabs */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #334155',
        paddingBottom: '12px',
        marginBottom: '12px',
      }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{
            fontSize: '15px',
            fontWeight: 700,
            color: activeTab === 'Focused' ? '#ffffff' : '#94a3b8',
            borderBottom: activeTab === 'Focused' ? `2px solid ${themeColor}` : 'none',
            paddingBottom: '4px',
            cursor: 'pointer',
          }}>
            Focused <span style={{ fontSize: '11px', color: '#38bdf8', backgroundColor: 'rgba(56,189,248,0.15)', padding: '1px 6px', borderRadius: '10px' }}>{unreadCount}</span>
          </div>
          <div style={{
            fontSize: '15px',
            fontWeight: 500,
            color: '#64748b',
            cursor: 'pointer',
          }}>
            Other
          </div>
        </div>
        <span style={{ fontSize: '11px', color: '#94a3b8' }}>Filter: By Date ▾</span>
      </div>

      {/* Email List Rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        {emails.map((item, idx) => {
          const isSelected = item.sender === highlightedSender;
          return (
            <div key={idx} style={{
              backgroundColor: isSelected ? 'rgba(0, 120, 212, 0.12)' : '#1e293b',
              border: isSelected ? '1px solid #0078D4' : '1px solid #334155',
              borderRadius: '8px',
              padding: '14px 18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              position: 'relative',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}>
              {item.unread && (
                <div style={{
                  position: 'absolute',
                  left: '6px',
                  top: '18px',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#38bdf8',
                }} />
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: item.unread ? 700 : 500, color: '#f8fafc' }}>{item.sender}</span>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>{item.time}</span>
              </div>
              <div style={{ fontSize: '12px', fontWeight: item.unread ? 600 : 400, color: '#38bdf8' }}>{item.subject}</div>
              <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.snippet}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
