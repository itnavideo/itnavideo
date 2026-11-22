import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface GoogleTasksSyncListProps {
  tasksCount?: number;
}

export const GoogleTasksSyncList: React.FC<GoogleTasksSyncListProps> = (props) => {
  const {
    tasksCount = 3,
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
      gap: '12px',
      fontFamily: 'Roboto, Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #dadce0', paddingBottom: '10px' }}>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#1a73e8' }}>Google Tasks</h3>
        <span style={{ fontSize: '11px', color: '#5f6368' }}>My Tasks</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        {['Review Remotion video render benchmark', 'Test Groq Whisper transcription fallback', 'Audit 15 video studio workspaces'].map((task, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px' }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #5f6368' }} />
            <span>{task}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
