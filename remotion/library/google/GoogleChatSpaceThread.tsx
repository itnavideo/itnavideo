import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface GoogleChatSpaceThreadProps {
  spaceName?: string;
  latestMessage?: string;
}

export const GoogleChatSpaceThread: React.FC<GoogleChatSpaceThreadProps> = (props) => {
  const {
    spaceName = "Engineering Core Platform",
    latestMessage = "PR #512 merged: Remotion library crossed 1,160 verified components!",
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#ffffff',
      color: '#202124',
      padding: '24px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Roboto, Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      <div style={{ borderBottom: '1px solid #e0e0e0', paddingBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#00796b' }}>Google Chat Space: {spaceName}</h3>
        <span style={{ fontSize: '11px', color: '#5f6368' }}>👥 18 Members</span>
      </div>

      <div style={{ flex: 1, marginTop: '16px', display: 'flex', gap: '12px' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#00796b', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>SC</div>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 700 }}>Sarah Connor <span style={{ fontSize: '10px', color: '#5f6368', fontWeight: 400 }}>11:42 AM</span></div>
          <p style={{ fontSize: '13px', color: '#3c4043', margin: '4px 0 0 0' }}>{latestMessage}</p>
        </div>
      </div>
    </div>
  );
};
