import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface GoogleKeepStickyNotesProps {
  noteCount?: number;
}

export const GoogleKeepStickyNotes: React.FC<GoogleKeepStickyNotesProps> = (props) => {
  const {
    noteCount = 3,
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
      gap: '16px',
      fontFamily: 'Roboto, Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Google Keep Notes</h3>
        <span style={{ fontSize: '11px', color: '#fbbc05' }}>● Pinned Notes</span>
      </div>

      <div style={{ display: 'flex', gap: '12px', flex: 1 }}>
        <div style={{ flex: 1, backgroundColor: '#fff8b8', padding: '14px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ fontWeight: 700, fontSize: '12px', marginBottom: '6px' }}>Sprint 42 To-Do</div>
          <div style={{ fontSize: '11px', lineHeight: '1.6' }}>
            ☑ Remotion Lambda deploy<br />
            ☑ Zero-duplicate audit<br />
            ☐ S3 asset CORS check
          </div>
        </div>
        <div style={{ flex: 1, backgroundColor: '#cbf0f8', padding: '14px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ fontWeight: 700, fontSize: '12px', marginBottom: '6px' }}>API Secrets Notice</div>
          <div style={{ fontSize: '11px', lineHeight: '1.6' }}>
            Strict Rule 7.1: Never hardcode keys in repo. Use .env.local only!
          </div>
        </div>
      </div>
    </div>
  );
};
