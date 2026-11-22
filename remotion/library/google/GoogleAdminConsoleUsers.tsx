import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface GoogleAdminConsoleUsersProps {
  activeUsers?: number;
  twoStepVerificationPct?: number;
}

export const GoogleAdminConsoleUsers: React.FC<GoogleAdminConsoleUsersProps> = (props) => {
  const {
    activeUsers = 340,
    twoStepVerificationPct = 100,
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
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Google Workspace Admin Console</h3>
        <span style={{ fontSize: '11px', color: '#137333', fontWeight: 700 }}>2-Step Enforced</span>
      </div>

      <div style={{ display: 'flex', gap: '16px', flex: 1 }}>
        <div style={{ flex: 1, backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '11px', color: '#5f6368' }}>ACTIVE USERS</div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#1a73e8' }}>{activeUsers}</div>
        </div>
        <div style={{ flex: 1, backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '11px', color: '#5f6368' }}>2FA COMPLIANCE</div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#137333' }}>{twoStepVerificationPct}%</div>
        </div>
      </div>
    </div>
  );
};
