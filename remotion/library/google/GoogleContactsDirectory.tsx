import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface GoogleContactsDirectoryProps {
  personName?: string;
  roleTitle?: string;
}

export const GoogleContactsDirectory: React.FC<GoogleContactsDirectoryProps> = (props) => {
  const {
    personName = "Elena Rostova",
    roleTitle = "Principal Video UX Engineer",
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#f8f9fa',
      color: '#202124',
      padding: '24px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Roboto, Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '24px', flex: 1, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#1a73e8', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 800 }}>ER</div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 800 }}>{personName}</div>
            <div style={{ fontSize: '12px', color: '#5f6368' }}>{roleTitle}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ backgroundColor: '#1a73e8', color: '#fff', border: 'none', borderRadius: '4px', padding: '6px 14px', fontSize: '11px', fontWeight: 700 }}>Send Email</button>
          <button style={{ backgroundColor: '#f1f3f4', color: '#202124', border: 'none', borderRadius: '4px', padding: '6px 14px', fontSize: '11px' }}>Meet Call</button>
        </div>
      </div>
    </div>
  );
};
