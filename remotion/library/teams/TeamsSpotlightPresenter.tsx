import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface TeamsSpotlightPresenterProps {
  presenterName?: string;
  topic?: string;
}

export const TeamsSpotlightPresenter: React.FC<TeamsSpotlightPresenterProps> = (props) => {
  const {
    presenterName = "Sarah Connor",
    topic = "Real-Time Remotion Frame Pipeline Architecture",
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#0a0914',
      padding: '24px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      <div style={{
        flex: 1,
        backgroundColor: '#1e1c2e',
        borderRadius: '8px',
        border: '2px solid #5B5FC7',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          backgroundColor: '#5B5FC7',
          color: '#fff',
          padding: '4px 10px',
          borderRadius: '4px',
          fontSize: '11px',
          fontWeight: 700,
          alignSelf: 'flex-start',
        }}>
          🔦 SPOTLIGHTED FOR EVERYONE
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#5B5FC7', margin: '0 auto 12px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', color: '#fff' }}>SC</div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#f8fafc' }}>{presenterName}</div>
          <div style={{ fontSize: '12px', color: '#c7d2fe', marginTop: '4px' }}>{topic}</div>
        </div>

        <div style={{ fontSize: '10px', color: '#94a3b8', textAlign: 'center' }}>
          Main stage video lock enforced by meeting organizer.
        </div>
      </div>
    </div>
  );
};
