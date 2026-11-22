import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface GoogleWorkspaceSecurityAlertProps {
  alertDescription?: string;
}

export const GoogleWorkspaceSecurityAlert: React.FC<GoogleWorkspaceSecurityAlertProps> = (props) => {
  const {
    alertDescription = "Suspicious login prevented: Account credentials validated via Google Prompt 2FA.",
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#fce8e6',
      color: '#c5221f',
      padding: '24px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      fontFamily: 'Roboto, Segoe UI, sans-serif',
      opacity: entrance,
      borderRadius: '8px',
      border: '1px solid #ea4335',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '24px' }}>🛡️</span>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 800 }}>Google Workspace Alert Center</div>
          <div style={{ fontSize: '12px', color: '#5f6368' }}>Critical Security Notification</div>
        </div>
      </div>

      <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#202124', margin: 0 }}>
        {alertDescription}
      </p>

      <button style={{ backgroundColor: '#c5221f', color: '#fff', border: 'none', borderRadius: '4px', padding: '6px 16px', fontSize: '12px', fontWeight: 700, alignSelf: 'flex-start' }}>
        View Audit Investigation
      </button>
    </div>
  );
};
