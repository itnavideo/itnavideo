import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface GoogleCalendarTimeGridProps {
  currentDay?: string;
  activeEventTitle?: string;
  eventTimeRange?: string;
}

export const GoogleCalendarTimeGrid: React.FC<GoogleCalendarTimeGridProps> = (props) => {
  const {
    currentDay = "Thursday, Nov 26",
    activeEventTitle = "Production Architecture Review",
    eventTimeRange = "2:00 PM - 3:30 PM",
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #dadce0', paddingBottom: '12px' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#1a73e8' }}>Google Calendar • {currentDay}</h3>
        <button style={{ backgroundColor: '#1a73e8', color: '#fff', border: 'none', borderRadius: '18px', padding: '6px 14px', fontSize: '11px', fontWeight: 700 }}>+ Create</button>
      </div>

      <div style={{ flex: 1, marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ backgroundColor: '#e8f0fe', borderLeft: '4px solid #1a73e8', borderRadius: '4px', padding: '12px 16px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#1a73e8' }}>{activeEventTitle}</div>
          <div style={{ fontSize: '11px', color: '#5f6368', marginTop: '2px' }}>⏰ {eventTimeRange} • Join with Google Meet</div>
        </div>
        <div style={{ backgroundColor: '#fce8e6', borderLeft: '4px solid #ea4335', borderRadius: '4px', padding: '12px 16px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#c5221f' }}>Incident Drill & Post-Mortem</div>
          <div style={{ fontSize: '11px', color: '#5f6368', marginTop: '2px' }}>⏰ 4:00 PM - 5:00 PM</div>
        </div>
      </div>
    </div>
  );
};
