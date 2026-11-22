import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface GoogleMeetVideoConferenceProps {
  meetingCode?: string;
  participantsCount?: number;
}

export const GoogleMeetVideoConference: React.FC<GoogleMeetVideoConferenceProps> = (props) => {
  const {
    meetingCode = "meet.google.com/abc-itna-xyz",
    participantsCount = 8,
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#202124',
      color: '#ffffff',
      padding: '24px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      fontFamily: 'Roboto, Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '13px', fontWeight: 600 }}>Google Meet • {meetingCode}</span>
        <span style={{ fontSize: '11px', color: '#9aa0a6' }}>👥 {participantsCount} in call</span>
      </div>

      {/* Center Video Tile Mock */}
      <div style={{
        flex: 1,
        backgroundColor: '#3c4043',
        borderRadius: '8px',
        margin: '16px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}>
        <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: '#1a73e8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>👤</div>
        <span style={{ position: 'absolute', bottom: '12px', left: '16px', fontSize: '12px', fontWeight: 600 }}>Sarah Connor (Presentation Host)</span>
      </div>

      {/* Google Meet Pill Control Bar */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
        {['🎤', '📹', '💬', '✋', '🖥️'].map((btn, i) => (
          <div key={i} style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#3c4043', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            {btn}
          </div>
        ))}
        <div style={{ width: '56px', height: '40px', borderRadius: '20px', backgroundColor: '#ea4335', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontWeight: 700 }}>
          📞
        </div>
      </div>
    </div>
  );
};
