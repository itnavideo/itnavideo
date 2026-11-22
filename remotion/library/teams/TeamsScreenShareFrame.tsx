import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface TeamsScreenShareFrameProps {
  presenterName?: string;
  sharedWindowName?: string;
  isAudioIncluded?: boolean;
}

export const TeamsScreenShareFrame: React.FC<TeamsScreenShareFrameProps> = (props) => {
  const {
    presenterName = "Sarah Connor",
    sharedWindowName = "VS Code - Remotion Studio (itnavideo)",
    isAudioIncluded = true,
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#0c0b14',
      padding: '24px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      {/* Screen Sharing Active Red Border Wrapper */}
      <div style={{
        flex: 1,
        borderRadius: '8px',
        border: '3px solid #ef4444',
        padding: '16px',
        backgroundColor: '#181726',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
      }}>
        {/* Top Floating Control Bar */}
        <div style={{
          position: 'absolute',
          top: '-14px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#ef4444',
          color: '#fff',
          padding: '4px 16px',
          borderRadius: '12px',
          fontSize: '11px',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 2px 10px rgba(239, 68, 68, 0.4)',
        }}>
          <span>🖥️ {presenterName} is sharing {sharedWindowName}</span>
          <button style={{ backgroundColor: '#fff', color: '#ef4444', border: 'none', borderRadius: '4px', padding: '2px 8px', fontSize: '10px', fontWeight: 800 }}>
            Stop Sharing
          </button>
        </div>

        {/* Center Mock Shared Screen */}
        <div style={{
          flex: 1,
          backgroundColor: '#0f172a',
          borderRadius: '6px',
          margin: '16px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#38bdf8',
          fontSize: '14px',
          fontWeight: 600,
        }}>
          <code>[High-Definition 1080p Desktop Video Stream Active]</code>
        </div>
      </div>
    </div>
  );
};
