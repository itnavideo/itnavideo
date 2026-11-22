import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface TeamsWalkieTalkieProps {
  channelName?: string;
  isTransmitting?: boolean;
}

export const TeamsWalkieTalkie: React.FC<TeamsWalkieTalkieProps> = (props) => {
  const {
    channelName = "Field Engineering Dispatch",
    isTransmitting = true,
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });
  const pulse = (Math.sin(frame * 0.2) + 1) * 0.5;

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
      alignItems: 'center',
      justifyContent: 'space-between',
      fontFamily: 'Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Teams Walkie Talkie</h3>
        <span style={{ fontSize: '11px', color: '#38bdf8' }}>Channel: {channelName}</span>
      </div>

      {/* Giant Circular Push-to-Talk Button */}
      <div style={{
        width: '130px',
        height: '130px',
        borderRadius: '50%',
        backgroundColor: '#5B5FC7',
        border: '4px solid #7b83eb',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: `0 0 ${16 + pulse * 12}px rgba(91, 95, 199, 0.6)`,
        cursor: 'pointer',
      }}>
        <span style={{ fontSize: '32px' }}>🎙️</span>
        <span style={{ fontSize: '11px', fontWeight: 800, marginTop: '4px' }}>HOLD TO TALK</span>
      </div>

      <div style={{ fontSize: '11px', color: '#4ade80' }}>
        ● LIVE AUDIO TRANSMITTING
      </div>
    </div>
  );
};
