import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface GoogleVaultRetentionAuditProps {
  matterName?: string;
  holdPolicy?: string;
}

export const GoogleVaultRetentionAudit: React.FC<GoogleVaultRetentionAuditProps> = (props) => {
  const {
    matterName = "Litigation Matter #8942 - Patent Protection",
    holdPolicy = "Indefinite Legal Hold (Gmail & Drive Data)",
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
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Google Vault eDiscovery & Retention</h3>
        <span style={{ backgroundColor: '#1a73e8', color: '#fff', fontSize: '11px', padding: '2px 8px', borderRadius: '4px' }}>LEGAL HOLD</span>
      </div>

      <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '20px', flex: 1, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 700 }}>{matterName}</div>
          <div style={{ fontSize: '12px', color: '#5f6368', marginTop: '4px' }}>{holdPolicy}</div>
        </div>
        <div style={{ fontSize: '11px', color: '#137333' }}>✓ Export packages signed and ready for forensic audit</div>
      </div>
    </div>
  );
};
