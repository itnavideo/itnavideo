import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface WatermarkOverlayCardProps {
  watermarkText?: string;
  rotationAngle?: number;
  watermarkColor?: string;
  opacity?: number;
}

export const WatermarkOverlayCard: React.FC<WatermarkOverlayCardProps> = (props) => {
  const {
    watermarkText = "CONFIDENTIAL",
    rotationAngle = -45,
    watermarkColor = "#dc2626",
    opacity = 0.18,
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#0f172a',
      padding: '24px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      {/* Paper Surface with Diagonal Watermark */}
      <div style={{
        backgroundColor: '#ffffff',
        flex: 1,
        borderRadius: '8px',
        padding: '36px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        {/* Huge Diagonal Watermark Stamp */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) rotate(${rotationAngle}deg)`,
          fontSize: '76px',
          fontWeight: 900,
          color: watermarkColor,
          opacity: opacity,
          letterSpacing: '12px',
          userSelect: 'none',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          border: `4px solid ${watermarkColor}`,
          padding: '8px 40px',
          borderRadius: '12px',
        }}>
          {watermarkText}
        </div>

        {/* Foreground Sample Document Content */}
        <div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
            PROJECT NEBULA - FINANCIAL ROADMAP
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>Version 3.4 • Strictly Proprietary</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', width: '90%' }} />
            <div style={{ height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', width: '100%' }} />
            <div style={{ height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', width: '85%' }} />
            <div style={{ height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', width: '70%' }} />
          </div>
        </div>

        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8' }}>
          <span>Page 1 of 12</span>
          <span>Security Tag: RESTRICTED-AIRGAP</span>
        </div>
      </div>
    </div>
  );
};
