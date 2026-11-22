import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface AccessSplitDatabaseCardProps {
  frontendFile?: string;
  backendFile?: string;
}

export const AccessSplitDatabaseCard: React.FC<AccessSplitDatabaseCardProps> = (props) => {
  const {
    frontendFile = "Itnavideo_FrontEnd.accdb (Forms, Queries, Reports)",
    backendFile = "Itnavideo_BackEnd.accdb (Data Tables & Relationships)",
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#0c101c',
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
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Database Splitter Architecture</h3>
        <span style={{ fontSize: '11px', color: '#38bdf8' }}>Multi-User Concurrency</span>
      </div>

      <div style={{ display: 'flex', gap: '16px', flex: 1, alignItems: 'center' }}>
        <div style={{ flex: 1, backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '16px' }}>
          <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 700 }}>FRONT-END (CLIENT LAPTOP)</div>
          <div style={{ fontSize: '13px', fontWeight: 700, marginTop: '4px' }}>{frontendFile}</div>
        </div>

        <span style={{ fontSize: '20px' }}>🔗</span>

        <div style={{ flex: 1, backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '16px' }}>
          <div style={{ fontSize: '11px', color: '#4ade80', fontWeight: 700 }}>BACK-END (SHARED FILE SERVER)</div>
          <div style={{ fontSize: '13px', fontWeight: 700, marginTop: '4px' }}>{backendFile}</div>
        </div>
      </div>
    </div>
  );
};
