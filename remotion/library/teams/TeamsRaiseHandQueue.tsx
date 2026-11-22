import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface TeamsRaiseHandQueueProps {
  handRaiserName?: string;
  queuePosition?: number;
  totalHandsRaised?: number;
  themeColor?: string;
}

export const TeamsRaiseHandQueue: React.FC<TeamsRaiseHandQueueProps> = (props) => {
  const {
    handRaiserName = "Marcus Vance",
    queuePosition = 1,
    totalHandsRaised = 3,
    themeColor = "#5B5FC7",
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });
  const pulse = (Math.sin(frame * 0.2) + 1) * 0.5;

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>✋</span>
          <span style={{ fontSize: '15px', fontWeight: 700 }}>Raise Hand Priority Queue</span>
        </div>
        <span style={{
          backgroundColor: '#f7b500',
          color: '#1e1c2e',
          fontSize: '11px',
          fontWeight: 800,
          padding: '2px 8px',
          borderRadius: '4px',
        }}>
          {totalHandsRaised} HANDS RAISED
        </span>
      </div>

      {/* Primary Raised Hand Banner */}
      <div style={{
        backgroundColor: '#1e1c2e',
        border: '1px solid #f7b500',
        borderRadius: '8px',
        padding: '18px 22px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: `0 0 ${10 + pulse * 6}px rgba(247, 181, 0, 0.25)`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#f7b500',
            color: '#111',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '14px',
          }}>
            #{queuePosition}
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc' }}>{handRaiserName}</div>
            <div style={{ fontSize: '11px', color: '#cbd5e1' }}>Waiting to speak • Hand raised 1m 24s ago</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ backgroundColor: themeColor, color: '#fff', border: 'none', borderRadius: '4px', padding: '6px 12px', fontSize: '11px', fontWeight: 700 }}>
            Spotlight
          </button>
          <button style={{ backgroundColor: '#2d2a45', color: '#cbd5e1', border: 'none', borderRadius: '4px', padding: '6px 10px', fontSize: '11px' }}>
            Lower Hand
          </button>
        </div>
      </div>
    </div>
  );
};
