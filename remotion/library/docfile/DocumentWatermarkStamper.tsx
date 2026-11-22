import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface DocumentWatermarkStamperProps {
  stampText?: string;
}

export const DocumentWatermarkStamper: React.FC<DocumentWatermarkStamperProps> = (props) => {
  const {
    stampText = "APPROVED FOR PRODUCTION RELEASE",
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#0c101c',
      padding: '24px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        padding: '28px',
        color: '#1e293b',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
      }}>
        <div style={{
          border: '4px solid #16a34a',
          color: '#16a34a',
          padding: '12px 28px',
          borderRadius: '8px',
          fontWeight: 900,
          fontSize: '20px',
          letterSpacing: '2px',
          transform: 'rotate(-10deg)',
        }}>
          {stampText}
        </div>
      </div>
    </div>
  );
};
