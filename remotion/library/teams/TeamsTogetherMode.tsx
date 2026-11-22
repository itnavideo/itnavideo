import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface TeamsTogetherModeProps {
  sceneEnvironment?: string;
  seatedParticipantsCount?: number;
  themeColor?: string;
}

export const TeamsTogetherMode: React.FC<TeamsTogetherModeProps> = (props) => {
  const {
    sceneEnvironment = "Auditorium Lecture Hall",
    seatedParticipantsCount = 6,
    themeColor = "#5B5FC7",
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

  const participants = ['Sarah C.', 'Marcus V.', 'Elena R.', 'David K.', 'Alex M.', 'Chloe B.'];

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#0a0914',
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
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Teams Together Mode</h3>
        <span style={{ fontSize: '11px', backgroundColor: '#1e1c2e', border: '1px solid #2d2a45', padding: '3px 8px', borderRadius: '4px', color: '#c7d2fe' }}>
          Scene: {sceneEnvironment}
        </span>
      </div>

      {/* Auditorium Seating Rows Simulation */}
      <div style={{
        flex: 1,
        backgroundColor: '#161426',
        borderRadius: '8px',
        border: '1px solid #2d2a45',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Tier 1 (Back Row) */}
        <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
          {participants.slice(3).map((p) => (
            <div key={p} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>👤</div>
              <span style={{ fontSize: '10px', color: '#cbd5e1' }}>{p}</span>
            </div>
          ))}
        </div>

        {/* Tier 2 (Front Row) */}
        <div style={{ display: 'flex', gap: '32px', justifyContent: 'center' }}>
          {participants.slice(0, 3).map((p) => (
            <div key={p} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: themeColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>👤</div>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#f8fafc' }}>{p}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
