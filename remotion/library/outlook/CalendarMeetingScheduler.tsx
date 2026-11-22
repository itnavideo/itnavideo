import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface CalendarMeetingSchedulerProps {
  meetingTitle?: string;
  timeRange?: string;
  location?: string;
  isTeamsMeeting?: boolean;
  attendeesCount?: number;
  themeColor?: string;
}

export const CalendarMeetingScheduler: React.FC<CalendarMeetingSchedulerProps> = (props) => {
  const {
    meetingTitle = "Quarterly Executive Architecture Sync",
    timeRange = "Thursday, 3:00 PM – 4:00 PM (1 hr)",
    location = "Microsoft Teams Meeting / Conference Room A",
    isTeamsMeeting = true,
    attendeesCount = 8,
    themeColor = "#5B5FC7",
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>📅</span>
          <span style={{ fontSize: '15px', fontWeight: 700 }}>Outlook Calendar • Meeting Invitation</span>
        </div>
        <span style={{
          backgroundColor: themeColor,
          color: '#fff',
          fontSize: '11px',
          fontWeight: 700,
          padding: '3px 8px',
          borderRadius: '4px',
        }}>
          TEAMS ENABLED
        </span>
      </div>

      {/* Meeting Card Body */}
      <div style={{
        backgroundColor: '#1e293b',
        borderRadius: '8px',
        padding: '20px',
        border: '1px solid #334155',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        flex: 1,
      }}>
        <div style={{ fontSize: '18px', fontWeight: 800, color: '#f8fafc' }}>{meetingTitle}</div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#38bdf8' }}>
            <span>🕒</span>
            <span>{timeRange}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#cbd5e1' }}>
            <span>📍</span>
            <span>{location}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#cbd5e1' }}>
            <span>👥</span>
            <span>{attendeesCount} Required Attendees (All Available)</span>
          </div>
        </div>

        {/* Teams Join Block */}
        <div style={{
          marginTop: 'auto',
          backgroundColor: 'rgba(91, 95, 199, 0.15)',
          border: '1px solid #5B5FC7',
          borderRadius: '6px',
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#c7d2fe' }}>Microsoft Teams Meeting</div>
            <div style={{ fontSize: '10px', color: '#94a3b8' }}>Meeting ID: 391 042 811 • Passcode: Itna2025</div>
          </div>
          <button style={{
            backgroundColor: '#5B5FC7',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            padding: '6px 14px',
            fontSize: '12px',
            fontWeight: 700,
          }}>
            Join Meeting
          </button>
        </div>
      </div>
    </div>
  );
};
