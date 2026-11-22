import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface EncryptedContainerVaultProps {
  containerName?: string;
  cipher?: string;
}

export const EncryptedContainerVault: React.FC<EncryptedContainerVaultProps> = (props) => {
  const {
    containerName = "SecureCorporateVault.hc",
    cipher = "VeraCrypt AES-256-XTS",
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

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
      gap: '16px',
      fontFamily: 'Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Encrypted Container Volume</h3>
        <span style={{ backgroundColor: '#10b981', color: '#fff', fontSize: '11px', padding: '2px 8px', borderRadius: '4px' }}>MOUNTED</span>
      </div>

      <div style={{
        backgroundColor: '#1e293b',
        borderRadius: '8px',
        padding: '20px',
        border: '1px solid #334155',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '32px' }}>🛡️</span>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700 }}>{containerName}</div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Cipher: {cipher}</div>
          </div>
        </div>
        <button style={{ backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: '4px', padding: '6px', fontSize: '11px', fontWeight: 700 }}>
          Dismount Secure Volume
        </button>
      </div>
    </div>
  );
};
