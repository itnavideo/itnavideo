import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface CalendarSchedulingAssistantProps {
  proposedTime?: string;
  freeCount?: number;
  totalAttendees?: number;
}

export const CalendarSchedulingAssistant: React.FC<CalendarSchedulingAssistantProps> = (props) => {
  const {
    proposedTime = "2:30 PM - 3:30 PM",
    freeCount = 5,
    totalAttendees = 5,
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#090d16',
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
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Scheduling Assistant • Multi-User Availability</h3>
        <span style={{ backgroundColor: '#16a34a', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
          {freeCount}/{totalAttendees} ALL FREE
        </span>
      </div>

      {/* Grid of Attendees and Time Slots */}
      <div style={{
        backgroundColor: '#1e293b',
        borderRadius: '8px',
        padding: '16px',
        border: '1px solid #334155',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}>
        {['Sarah Connor (Host)', 'John Doe (DevOps)', 'Elena Rostova (UI/UX)', 'Michael Chang (QA)'].map((person, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ width: '140px', fontSize: '11px', color: '#cbd5e1', whiteSpace: 'nowrap' }}>{person}</span>
            <div style={{ flex: 1, height: '16px', backgroundColor: '#0f172a', borderRadius: '3px', display: 'flex', overflow: 'hidden' }}>
              <div style={{ width: '30%', backgroundColor: '#ef4444' }} title="Busy" />
              <div style={{ width: '40%', backgroundColor: '#22c55e' }} title="Free" />
              <div style={{ width: '30%', backgroundColor: '#eab308' }} title="Tentative" />
            </div>
          </div>
        ))}

        <div style={{ marginTop: 'auto', borderTop: '1px solid #334155', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
          <span style={{ color: '#4ade80', fontWeight: 700 }}>Optimal Slot: {proposedTime}</span>
          <span style={{ color: '#94a3b8' }}>Auto-selected based on Exchange Free/Busy API</span>
        </div>
      </div>
    </div>
  );
};
