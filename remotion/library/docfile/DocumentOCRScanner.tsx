import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface DocumentOCRScannerProps {
  extractedWordCount?: number;
  confidenceScore?: number;
}

export const DocumentOCRScanner: React.FC<DocumentOCRScannerProps> = (props) => {
  const {
    extractedWordCount = 420,
    confidenceScore = 98.4,
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });
  const laserY = (frame * 3) % 180;

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
      gap: '14px',
      fontFamily: 'Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Optical Character Recognition (OCR)</h3>
        <span style={{ fontSize: '11px', color: '#4ade80' }}>{confidenceScore}% Accuracy</span>
      </div>

      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        padding: '20px',
        color: '#1e293b',
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
      }}>
        {/* Red Sweeping Laser Line */}
        <div style={{
          position: 'absolute',
          top: `${laserY}px`,
          left: 0,
          width: '100%',
          height: '2px',
          backgroundColor: '#ef4444',
          boxShadow: '0 0 8px #ef4444',
        }} />

        <div style={{ fontSize: '12px', lineHeight: '1.7', color: '#475569' }}>
          COMMERCIAL LEASE AGREEMENT (Scanned Document Image)<br />
          This agreement executed on November 2026 establishes tenant operating parameters...
        </div>
      </div>
    </div>
  );
};
