import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface TeamsVideoCallGridProps {
  meetingTitle?: string;
  activeSpeaker?: string;
  participantsCount?: number;
  themeColor?: string;
}

export const TeamsVideoCallGrid: React.FC<TeamsVideoCallGridProps> = (props) => {
  const {
    meetingTitle = "Sprint 42 Architecture & Remotion Pipeline Sync",
    activeSpeaker = "Sarah Connor",
    participantsCount = 4,
    themeColor = "#5B5FC7",
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });
  const glow = (Math.sin(frame * 0.15) + 1) * 0.5;

  const users = [
    { name: 'Sarah Connor', role: 'Host / Systems Lead', initials: 'SC', active: true, color: '#3b82f6' },
    { name: 'Marcus Vance', role: 'Cloud Engineer', initials: 'MV', active: false, color: '#10b981' },
    { name: 'Elena Rostova', role: 'UI/UX Lead', initials: 'ER', active: false, color: '#f59e0b' },
    { name: 'David Kim', role: 'QA Automation', initials: 'DK', active: false, color: '#8b5cf6' },
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
      fontFamily: 'Segoe UI, system-ui, sans-serif',
      opacity: entrance,
      transform: `scale(${0.96 + entrance * 0.04})`,
    }}>
      {/* Top Meeting Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#1e1c2e',
        borderRadius: '8px',
        padding: '10px 18px',
        marginBottom: '16px',
        border: '1px solid #2d2a45',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
          <span style={{ fontSize: '13px', fontWeight: 600 }}>{meetingTitle}</span>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>• 24:18</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '12px', color: '#cbd5e1' }}>👥 {participantsCount}</span>
          <button style={{ backgroundColor: '#c4314b', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 12px', fontSize: '11px', fontWeight: 700 }}>Leave</button>
        </div>
      </div>

      {/* 2x2 Video Tiles Gallery */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px',
        flex: 1,
      }}>
        {users.map((u) => {
          const isSpeaker = u.name === activeSpeaker;
          return (
            <div key={u.name} style={{
              backgroundColor: '#1a1829',
              borderRadius: '8px',
              border: isSpeaker ? `2px solid ${themeColor}` : '1px solid #2d2a45',
              boxShadow: isSpeaker ? `0 0 ${12 + glow * 8}px rgba(91, 95, 199, 0.5)` : 'none',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Center Avatar */}
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: u.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
                fontWeight: 800,
                color: '#fff',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              }}>
                {u.initials}
              </div>

              {/* Lower Info Bar */}
              <div style={{
                position: 'absolute',
                bottom: '10px',
                left: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(0,0,0,0.6)',
                padding: '4px 10px',
                borderRadius: '4px',
              }}>
                <span style={{ fontSize: '12px', fontWeight: 600 }}>{u.name}</span>
                {isSpeaker ? (
                  <span style={{ fontSize: '11px', color: '#4ade80' }}>🎙️ Speaking</span>
                ) : (
                  <span style={{ fontSize: '11px', color: '#ef4444' }}>🔇</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
