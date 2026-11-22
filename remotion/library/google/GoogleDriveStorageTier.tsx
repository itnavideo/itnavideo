import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface GoogleDriveStorageTierProps {
  usedGB?: number;
  totalGB?: number;
  planName?: string;
}

export const GoogleDriveStorageTier: React.FC<GoogleDriveStorageTierProps> = (props) => {
  const {
    usedGB = 1420,
    totalGB = 2048,
    planName = "Google One 2 TB Business Standard",
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
      gap: '16px',
      fontFamily: 'Roboto, Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Google Drive Storage</h3>
        <span style={{ fontSize: '11px', color: '#1a73e8' }}>{planName}</span>
      </div>

      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: '32px', fontWeight: 900, color: '#1a73e8' }}>{usedGB} GB <span style={{ fontSize: '14px', color: '#5f6368' }}>of {totalGB} GB used</span></div>
          <div style={{ fontSize: '12px', color: '#5f6368', marginTop: '4px' }}>628 GB remaining across Google Workspace Shared Drives</div>
        </div>

        {/* Segmented Color Storage Bar */}
        <div style={{ display: 'flex', height: '14px', borderRadius: '7px', overflow: 'hidden' }}>
          <div style={{ width: '50%', backgroundColor: '#4285f4' }} title="Google Drive" />
          <div style={{ width: '15%', backgroundColor: '#ea4335' }} title="Gmail" />
          <div style={{ width: '5%', backgroundColor: '#fbbc05' }} title="Google Photos" />
          <div style={{ width: '30%', backgroundColor: '#e0e0e0' }} title="Free Space" />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '11px', color: '#5f6368' }}>
          <span>🔵 Drive (1,020 GB)</span>
          <span>🔴 Gmail (300 GB)</span>
          <span>🟡 Photos (100 GB)</span>
        </div>
      </div>
    </div>
  );
};
