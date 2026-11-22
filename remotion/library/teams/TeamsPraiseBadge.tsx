import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface TeamsPraiseBadgeProps {
  recipientName?: string;
  badgeTitle?: string;
  praiseMessage?: string;
}

export const TeamsPraiseBadge: React.FC<TeamsPraiseBadgeProps> = (props) => {
  const {
    recipientName = "Elena Rostova",
    badgeTitle = "Awesome Problem Solver",
    praiseMessage = "Thank you for crafting the responsive stepper flows and zero-duplicate architecture across our 15 video studio workspaces!",
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

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
      fontFamily: 'Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      <div style={{
        backgroundColor: '#1e1c2e',
        borderRadius: '8px',
        border: '1px solid #5B5FC7',
        padding: '24px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        textAlign: 'center',
        boxShadow: '0 4px 16px rgba(91, 95, 199, 0.3)',
      }}>
        <div style={{ fontSize: '32px' }}>🏆</div>
        <div>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#facc15' }}>{badgeTitle}</div>
          <div style={{ fontSize: '12px', color: '#c7d2fe', marginTop: '2px' }}>Sent to <strong>{recipientName}</strong></div>
        </div>
        <p style={{ fontSize: '12px', lineHeight: '1.7', color: '#cbd5e1', margin: 0, maxWidth: '85%' }}>
          "{praiseMessage}"
        </p>
      </div>
    </div>
  );
};
