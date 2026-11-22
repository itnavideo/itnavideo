import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface AccessDatabasePasswordLockProps {
  encryptionStandard?: string;
  isExclusiveModeRequired?: boolean;
}

export const AccessDatabasePasswordLock: React.FC<AccessDatabasePasswordLockProps> = (props) => {
  const {
    encryptionStandard = "AES 256-bit Block Cipher (FIPS 140-2)",
    isExclusiveModeRequired = true,
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
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Database Encryption & Password</h3>
        <span style={{ backgroundColor: '#A4373A', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
          EXCLUSIVE LOCK ACTIVE
        </span>
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
          <span style={{ fontSize: '32px' }}>🔒</span>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700 }}>Encrypted at Rest</div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>{encryptionStandard}</div>
          </div>
        </div>

        <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px', fontSize: '12px', color: '#cbd5e1' }}>
          Password prompt required before any table, query, or schema access is permitted.
        </div>
      </div>
    </div>
  );
};
