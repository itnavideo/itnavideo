import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface TeamsStatusPresenceMenuProps {
  currentStatus?: string;
  customStatusMessage?: string;
}

export const TeamsStatusPresenceMenu: React.FC<TeamsStatusPresenceMenuProps> = (props) => {
  const {
    currentStatus = "Do Not Disturb",
    customStatusMessage = "Focusing on Remotion render pipeline architecture. Urgent only via mobile.",
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

  const statuses = [
    { label: 'Available', dot: '#22c55e' },
    { label: 'Busy', dot: '#ef4444' },
    { label: 'Do Not Disturb', dot: '#ef4444', active: true },
    { label: 'Be Right Back', dot: '#f59e0b' },
    { label: 'Away', dot: '#f59e0b' },
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
      opacity: entrance,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Presence & Status Message</h3>
        <span style={{ fontSize: '11px', color: '#ef4444' }}>⛔ {currentStatus}</span>
      </div>

      <div style={{
        backgroundColor: '#1e1c2e',
        borderRadius: '8px',
        padding: '16px',
        border: '1px solid #2d2a45',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        <div style={{ fontSize: '12px', color: '#cbd5e1', fontStyle: 'italic' }}>
          "{customStatusMessage}"
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {statuses.map((s) => (
            <div key={s.label} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: s.active ? 'rgba(91, 95, 199, 0.3)' : '#11101d',
              border: s.active ? '1px solid #5B5FC7' : '1px solid #2d2a45',
              padding: '6px 10px',
              borderRadius: '4px',
              fontSize: '11px',
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: s.dot }} />
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
