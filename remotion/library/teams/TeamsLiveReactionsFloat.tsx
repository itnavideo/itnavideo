import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface TeamsLiveReactionsFloatProps {
  presenterName?: string;
  reactionsCount?: number;
}

export const TeamsLiveReactionsFloat: React.FC<TeamsLiveReactionsFloatProps> = (props) => {
  const {
    presenterName = "Sarah Connor",
    reactionsCount = 24,
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

  const emojis = ['❤️', '👏', '🚀', '🎉', '👍', '🔥'];

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
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Live In-Meeting Reactions</h3>
        <span style={{ fontSize: '11px', color: '#c7d2fe' }}>{reactionsCount} Floating Reactions</span>
      </div>

      {/* Floating Bubbles */}
      <div style={{ flex: 1, position: 'relative' }}>
        {emojis.map((emoji, i) => {
          const yOffset = (frame * (2 + i * 0.8)) % 240;
          return (
            <div key={i} style={{
              position: 'absolute',
              bottom: `${yOffset}px`,
              left: `${20 + i * 15}%`,
              fontSize: '28px',
              filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))',
              transform: `scale(${1 + Math.sin(frame * 0.1 + i) * 0.15})`,
            }}>
              {emoji}
            </div>
          );
        })}
      </div>
    </div>
  );
};
