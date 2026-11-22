import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface TeamsVoiceCallDialerProps {
  callerNumber?: string;
  callDuration?: string;
  callState?: string;
}

export const TeamsVoiceCallDialer: React.FC<TeamsVoiceCallDialerProps> = (props) => {
  const {
    callerNumber = "+1 (555) 902-1842",
    callDuration = "04:18",
    callState = "Call Connected (PSTN Direct Routing)",
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

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
      gap: '16px',
      fontFamily: 'Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Teams Phone • Cloud Voice</h3>
        <span style={{ fontSize: '11px', color: '#4ade80' }}>● Active Line</span>
      </div>

      <div style={{
        backgroundColor: '#1e1c2e',
        borderRadius: '8px',
        padding: '20px',
        border: '1px solid #2d2a45',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: 800 }}>{callerNumber}</div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>{callState} • {callDuration}</div>
        </div>

        {/* DTMF Keypad Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', width: '180px' }}>
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((k) => (
            <div key={k} style={{ backgroundColor: '#2d2a45', padding: '8px', borderRadius: '4px', textAlign: 'center', fontSize: '12px', fontWeight: 700 }}>
              {k}
            </div>
          ))}
        </div>

        <button style={{ backgroundColor: '#c4314b', color: '#fff', border: 'none', borderRadius: '20px', padding: '8px 24px', fontSize: '12px', fontWeight: 700 }}>
          End Call
        </button>
      </div>
    </div>
  );
};
