import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface TeamsBreakoutRoomsProps {
  activeRoomName?: string;
  timeRemaining?: string;
  totalRooms?: number;
}

export const TeamsBreakoutRooms: React.FC<TeamsBreakoutRoomsProps> = (props) => {
  const {
    activeRoomName = "Room 2: API & Microservice Performance",
    timeRemaining = "14:32",
    totalRooms = 4,
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

  const rooms = [
    { name: 'Room 1: Video Engine Optimization', participants: 4, open: true },
    { name: 'Room 2: API & Microservice Performance', participants: 5, open: true, current: true },
    { name: 'Room 3: Frontend UX & Stepper Flows', participants: 3, open: true },
    { name: 'Room 4: S3 & Cloudinary CDN Pipeline', participants: 4, open: true },
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
      gap: '16px',
      fontFamily: 'Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Breakout Rooms Manager</h3>
        <span style={{ fontSize: '11px', color: '#facc15', backgroundColor: 'rgba(250, 204, 21, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
          ⏳ Closing in {timeRemaining}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        {rooms.map((r, i) => (
          <div key={i} style={{
            backgroundColor: r.current ? 'rgba(91, 95, 199, 0.25)' : '#1e1c2e',
            border: r.current ? '1px solid #5B5FC7' : '1px solid #2d2a45',
            borderRadius: '6px',
            padding: '12px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: r.current ? 700 : 500, color: r.current ? '#c7d2fe' : '#f8fafc' }}>{r.name}</div>
              <div style={{ fontSize: '10px', color: '#94a3b8' }}>👥 {r.participants} Participants Assigned</div>
            </div>
            <button style={{ backgroundColor: r.current ? '#5B5FC7' : '#2d2a45', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 10px', fontSize: '11px' }}>
              {r.current ? 'Current Room' : 'Join'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
